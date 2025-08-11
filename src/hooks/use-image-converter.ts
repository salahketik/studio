'use client';

import { useState, useCallback } from 'react';
import type { ImageFile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PixelCrop } from 'react-image-crop';

export function useImageConverter(
    onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void
) {
    const [isConverting, setIsConverting] = useState(false);
    const [conversionProgress, setConversionProgress] = useState(0);
    const { toast } = useToast();

    const handleError = useCallback((id: string, message: string) => {
        onUpdateImage(id, { status: 'error', error: message });
        toast({
            variant: 'destructive',
            title: 'Conversion Error',
            description: `Could not process an image. ${message}`,
        });
    }, [onUpdateImage, toast]);

    const convertImage = useCallback((image: ImageFile, onComplete: () => void) => {
        onUpdateImage(image.id, { status: 'converting' });

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgElement = document.createElement('img');
            imgElement.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    handleError(image.id, 'Could not get canvas context');
                    onComplete();
                    return;
                }

                let sourceX = 0;
                let sourceY = 0;
                let sourceWidth = imgElement.width;
                let sourceHeight = imgElement.height;
                let destWidth = imgElement.width;
                let destHeight = imgElement.height;
                
                const isCropEnabled = image.crop?.enabled && image.crop.crop;
                const isResizeEnabled = image.resize?.enabled;

                if (isCropEnabled) {
                    const crop = image.crop.crop as PixelCrop;
                    sourceX = crop.x;
                    sourceY = crop.y;
                    sourceWidth = crop.width;
                    sourceHeight = crop.height;
                }

                if (isResizeEnabled) {
                    destWidth = image.resize!.width;
                    destHeight = image.resize!.height;
                } else if (isCropEnabled) {
                    // If only cropping is enabled, the destination size is the crop size.
                    destWidth = sourceWidth;
                    destHeight = sourceHeight;
                }
                
                canvas.width = destWidth;
                canvas.height = destHeight;
                
                ctx.drawImage(
                    imgElement,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    0,
                    0,
                    destWidth,
                    destHeight
                );

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            handleError(image.id, 'Failed to convert image');
                            onComplete();
                            return;
                        }
                        onUpdateImage(image.id, {
                            status: 'converted',
                            convertedFile: blob,
                            convertedSize: blob.size,
                            convertedUrl: URL.createObjectURL(blob),
                        });
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
    }, [onUpdateImage, handleError]);

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
