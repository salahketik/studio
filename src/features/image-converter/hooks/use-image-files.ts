'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageFile, ConversionOptions } from '@/features/image-converter/types';
import { useToast } from '@/hooks/use-toast';

const defaultGlobalOptions: ConversionOptions = {
    format: 'image/webp',
    quality: 0.8,
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(imageUrl); // Clean up immediately
        };
        img.onerror = (err) => {
            reject(err);
            URL.revokeObjectURL(imageUrl);
        };
        img.src = imageUrl;
    });
};

export function useImageFiles() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [globalOptions, setGlobalOptions] = useState<ConversionOptions>(defaultGlobalOptions);
    const { toast } = useToast();

    const handleImageUpload = useCallback(async (files: File[]) => {
        const newImagesPromises = files.map(async (file): Promise<ImageFile | null> => {
            try {
                const dimensions = await getImageDimensions(file);
                return {
                    id: `${file.name}-${file.lastModified}-${file.size}`,
                    file,
                    originalSize: file.size,
                    status: 'pending',
                    conversionOptions: globalOptions,
                    originalUrl: URL.createObjectURL(file), // Create URL for display
                    originalDimensions: dimensions,
                };
            } catch (error) {
                console.error("Tidak dapat membaca dimensi gambar untuk file:", file.name, error);
                toast({
                    variant: 'destructive',
                    title: 'Gagal Memuat Gambar',
                    description: `Tidak dapat memproses file ${file.name}. Mungkin file tersebut rusak.`
                });
                return null;
            }
        });

        const newImages = (await Promise.all(newImagesPromises)).filter(
          (img): img is ImageFile => img !== null
        );

        setImages((prev) => {
            const uniqueNewImages = newImages.filter(
                (newImg) => !prev.some((existingImg) => existingImg.id === newImg.id)
            );
            return [...prev, ...uniqueNewImages];
        });
    }, [globalOptions, toast]);

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

    // Cleanup all object URLs on component unmount
    useEffect(() => {
      return () => {
        images.forEach(img => {
            if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
            if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
        });
      }
    }, [images]);

    const handleUpdateImage = useCallback((id: string, newImageData: Partial<ImageFile>) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...newImageData } : img));
    }, []);
    
    const convertedImages = useMemo(() => images.filter(img => img.status === 'converted' && img.convertedFile), [images]);

    const handleDownloadAll = useCallback(async () => {
        if (convertedImages.length === 0) {
          toast({
            title: 'Tidak Ada Gambar untuk Diunduh',
            description: 'Silakan konversi beberapa gambar terlebih dahulu.',
          });
          return;
        }
    
        const zip = new JSZip();
        convertedImages.forEach((image) => {
          let extension = image.conversionOptions.format.split('/')[1];
          if (extension === 'jpeg') extension = 'jpeg';
          if (image.conversionOptions.format === 'image/jpg') extension = 'jpg';
          if (image.conversionOptions.format === 'image/x-icon') extension = 'ico';

          const newName = image.file.name.substring(0, image.file.name.lastIndexOf('.')) + `.${extension}`;
          zip.file(newName, image.convertedFile!);
        });
    
        try {
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          saveAs(zipBlob, 'WebPGator_images.zip');
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Pembuatan Zip Gagal',
            description: 'Tidak dapat membuat file zip.',
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
            title: "Pengaturan Global Diterapkan",
            description: "Semua gambar yang tertunda telah diperbarui dengan pengaturan konversi baru.",
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
