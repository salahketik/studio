'use client';

import { useState, useCallback } from 'react';
import type { ImageFile } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useImageConverter(
    setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>
) {
    const [isConverting, setIsConverting] = useState(false);
    const [conversionProgress, setConversionProgress] = useState(0);
    const { toast } = useToast();

    const handleError = useCallback((id: string, message: string) => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === id ? { ...img, status: 'error', error: message } : img
            )
        );
        toast({
            variant: 'destructive',
            title: 'Conversion Error',
            description: `Could not process an image. ${message}`,
        });
    }, [setImages, toast]);

    const convertImage = useCallback((image: ImageFile, onComplete: () => void) => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === image.id ? { ...img, status: 'converting' } : img
            )
        );

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgElement = document.createElement('img');
            imgElement.onload = () => {
                const canvas = document.createElement('canvas');

                let width = imgElement.width;
                let height = imgElement.height;

                if (image.resize && image.resize.enabled) {
                    width = image.resize.width;
                    height = image.resize.height;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    handleError(image.id, 'Could not get canvas context');
                    onComplete();
                    return;
                }
                ctx.drawImage(imgElement, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            handleError(image.id, 'Failed to convert image');
                            onComplete();
                            return;
                        }
                        setImages((prev) =>
                            prev.map((img) =>
                                img.id === image.id
                                    ? {
                                        ...img,
                                        status: 'converted',
                                        convertedFile: blob,
                                        convertedSize: blob.size,
                                        convertedUrl: URL.createObjectURL(blob),
                                    }
                                    : img
                            )
                        );
                        onComplete();
                    },
                    image.conversionOptions.format,
                    image.conversionOptions.quality
                );
            };
            imgElement.onerror = () => {
                handleError(image.id, 'Failed to load image');
                onComplete();
            };
            imgElement.src = e.target?.result as string;
        };
        reader.onerror = () => {
            handleError(image.id, 'Failed to read file');
            onComplete();
        };
        reader.readAsDataURL(image.file);
    }, [setImages, handleError]);

    const convertImages = useCallback(async (imagesToConvert: ImageFile[]) => {
        if (imagesToConvert.length === 0) return;

        setIsConverting(true);
        setConversionProgress(0);

        let completedCount = 0;

        const conversionPromises = imagesToConvert.map(image => {
            return new Promise<void>(resolve => {
                convertImage(image, () => {
                    completedCount++;
                    setConversionProgress((completedCount / imagesToConvert.length) * 100);
                    resolve();
                });
            });
        });

        await Promise.all(conversionPromises);

        setIsConverting(false);
    }, [convertImage]);


    return { isConverting, conversionProgress, convertImages };
}
