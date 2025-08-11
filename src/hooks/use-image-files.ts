'use client';

import { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageFile, ConversionOptions } from '@/types';
import { useToast } from './use-toast';

const defaultGlobalOptions: ConversionOptions = {
    format: 'image/webp',
    quality: 0.8,
};

export function useImageFiles() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [globalOptions, setGlobalOptions] = useState<ConversionOptions>(defaultGlobalOptions);
    const { toast } = useToast();

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
        setImages((prev) => {
            const imageToRemove = prev.find((img) => img.id === id);
            if (imageToRemove) {
                if (imageToRemove.originalUrl) URL.revokeObjectURL(imageToRemove.originalUrl);
                if (imageToRemove.convertedUrl) URL.revokeObjectURL(imageToRemove.convertedUrl);
            }
            return prev.filter((img) => img.id !== id);
        });
    }, []);

    const handleClearAll = useCallback(() => {
        images.forEach(img => {
            if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
            if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
        });
        setImages([]);
    }, [images]);

    const handleUpdateImage = useCallback((id: string, newImageData: Partial<ImageFile>) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...newImageData } : img));
    }, []);
    
    const convertedImages = useMemo(() => images.filter(img => img.status === 'converted' && img.convertedFile), [images]);

    const handleDownloadAll = useCallback(async () => {
        if (convertedImages.length === 0) {
          toast({
            title: 'No Images to Download',
            description: 'Please convert some images first.',
          });
          return;
        }
    
        const zip = new JSZip();
        convertedImages.forEach((image) => {
          const extension = image.conversionOptions.format.split('/')[1];
          const newName = image.file.name.substring(0, image.file.name.lastIndexOf('.')) + `.${extension}`;
          zip.file(newName, image.convertedFile!);
        });
    
        try {
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          saveAs(zipBlob, 'WebPGator_images.zip');
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Zip Creation Failed',
            description: 'Could not create the zip file.',
          });
        }
    }, [convertedImages, toast]);

    const handleApplyGlobalOptions = useCallback(() => {
        setImages(prev => prev.map(img => {
            if (img.status === 'converting' || img.status === 'ai_optimizing') {
                return img;
            }
            return { ...img, conversionOptions: globalOptions, status: 'pending' };
        }));
        toast({
            title: "Global Settings Applied",
            description: "All pending images have been updated with the new conversion settings.",
        })
    }, [globalOptions, toast]);


    return {
        images,
        globalOptions,
        setGlobalOptions,
        handleImageUpload,
        handleRemoveImage,
        handleClearAll,
        handleUpdateImage,
        handleDownloadAll,
        handleApplyGlobalOptions,
        convertedImages,
    };
}
