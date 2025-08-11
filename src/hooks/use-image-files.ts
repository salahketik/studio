'use client';

import { useState, useCallback } from 'react';
import type { ImageFile, ConversionOptions } from '@/types';

const defaultGlobalOptions: ConversionOptions = {
    format: 'image/webp',
    quality: 0.8,
};

export function useImageFiles() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [globalOptions, setGlobalOptions] = useState<ConversionOptions>(defaultGlobalOptions);

    const handleImageUpload = useCallback((files: File[]) => {
        const newImages: ImageFile[] = files.map((file) => {
            const originalUrl = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                setImages(prev => prev.map(i => {
                    if (i.originalUrl === originalUrl) {
                        return { ...i, originalDimensions: { width: img.width, height: img.height } };
                    }
                    return i;
                }));
            };
            img.src = originalUrl;

            return {
                id: `${file.name}-${file.lastModified}-${file.size}`,
                file,
                originalSize: file.size,
                status: 'pending',
                conversionOptions: globalOptions,
                originalUrl: originalUrl,
            };
        });

        const uniqueNewImages = newImages.filter(
            (newImg) => !images.some((existingImg) => existingImg.id === newImg.id)
        );

        if (uniqueNewImages.length > 0) {
            setImages((prev) => [...prev, ...uniqueNewImages]);
        }
    }, [images, globalOptions]);

    const handleRemoveImage = useCallback((id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    }, []);

    const handleClearAll = useCallback(() => {
        setImages([]);
    }, []);

    const handleUpdateImage = useCallback((id: string, newImageData: Partial<ImageFile>) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...newImageData } : img));
    }, []);

    return {
        images,
        setImages,
        globalOptions,
        setGlobalOptions,
        handleImageUpload,
        handleRemoveImage,
        handleClearAll,
        handleUpdateImage,
    };
}
