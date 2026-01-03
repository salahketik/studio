'use client';

import { useState, useCallback } from 'react';
import type { ImageFile } from '@/features/image-converter/types';
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
            title: 'Kesalahan Konversi',
            description: `Tidak dapat memproses gambar. ${message}`,
        });
    }, [onUpdateImage, toast]);

    const convertImage = useCallback((image: ImageFile, onComplete: () => void) => {
        onUpdateImage(image.id, { status: 'converting', progress: 0 });

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgElement = document.createElement('img');
            imgElement.onload = () => {
                onUpdateImage(image.id, { progress: 25 });
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    handleError(image.id, 'Tidak dapat mengambil konteks kanvas');
                    onComplete();
                    return;
                }

                let sourceX = 0;
                let sourceY = 0;
                let sourceWidth = imgElement.width;
                let sourceHeight = imgElement.height;
                let destWidth = imgElement.width;
                let destHeight = imgElement.height;
                
                const isIcoFormat = image.conversionOptions.format === 'image/x-icon';

                const isCropEnabled = image.crop?.enabled && image.crop.crop && !isIcoFormat;
                const isResizeEnabled = image.resize?.enabled && !isIcoFormat;

                if (isCropEnabled) {
                    const crop = image.crop.crop as PixelCrop;
                    sourceX = crop.x;
                    sourceY = crop.y;
                    sourceWidth = crop.width;
                    sourceHeight = crop.height;
                }
                
                onUpdateImage(image.id, { progress: 50 });

                if (isResizeEnabled) {
                    destWidth = image.resize!.width;
                    destHeight = image.resize!.height;
                } else if (isCropEnabled) {
                    destWidth = sourceWidth;
                    destHeight = sourceHeight;
                } else if (isIcoFormat) {
                    destWidth = 32;
                    destHeight = 32;
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
                
                onUpdateImage(image.id, { progress: 75 });

                let blobFormat = image.conversionOptions.format;
                if (isIcoFormat) {
                    blobFormat = 'image/png';
                } else if (blobFormat === 'image/jpg') {
                    blobFormat = 'image/jpeg';
                }

                const blobQuality = isIcoFormat ? 1.0 : image.conversionOptions.quality;


                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            handleError(image.id, 'Gagal mengonversi gambar');
                            onComplete();
                            return;
                        }
                        
                        // Revoke old URL if it exists
                        if (image.convertedUrl) {
                            URL.revokeObjectURL(image.convertedUrl);
                        }

                        onUpdateImage(image.id, {
                            status: 'converted',
                            convertedFile: blob,
                            convertedSize: blob.size,
                            convertedUrl: URL.createObjectURL(blob),
                            progress: 100,
                        });
                        onComplete();
                    },
                    blobFormat,
                    blobQuality
                );
            };
            imgElement.onerror = () => {
                handleError(image.id, 'Gagal memuat gambar');
                onComplete();
            };
            imgElement.src = e.target?.result as string;
        };
        reader.onerror = () => {
            handleError(image.id, 'Gagal membaca file');
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
