'use client';

import { useState, useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageFile } from '@/types';
import { ImageUploader } from '@/components/image-uploader';
import { ImageList } from '@/components/image-list';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const { toast } = useToast();

  const convertImage = useCallback((image: ImageFile) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === image.id
          ? { ...img, status: 'converting', progress: 0 }
          : img
      )
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = document.createElement('img');
      imgElement.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          handleError(image.id, 'Could not get canvas context');
          return;
        }
        ctx.drawImage(imgElement, 0, 0);
        
        // Simulate progress for better UX
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, progress: Math.min(progress, 99) } : img
            )
          );
          if (progress >= 100) {
            clearInterval(interval);
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  handleError(image.id, 'Failed to convert image');
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
                          progress: 100,
                        }
                      : img
                  )
                );
              },
              'image/webp',
              0.8 // Default quality
            );
          }
        }, 50);

      };
      imgElement.onerror = () => {
        handleError(image.id, 'Failed to load image');
      };
      imgElement.src = e.target?.result as string;
    };
    reader.onerror = () => {
      handleError(image.id, 'Failed to read file');
    };
    reader.readAsDataURL(image.file);
  }, []);

  const handleImageUpload = useCallback(
    (files: File[]) => {
      const newImages: ImageFile[] = files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        file,
        originalSize: file.size,
        status: 'pending',
      }));

      const uniqueNewImages = newImages.filter(
        (newImg) => !images.some((existingImg) => existingImg.id === newImg.id)
      );

      if (uniqueNewImages.length > 0) {
        setImages((prev) => [...prev, ...uniqueNewImages]);
        uniqueNewImages.forEach(convertImage);
      }
    },
    [images, convertImage]
  );

  const handleError = (id: string, message: string) => {
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
  };

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setImages([]);
  }, []);
  
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
      const newName = image.file.name.substring(0, image.file.name.lastIndexOf('.')) + '.webp';
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

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-6 border-b border-border">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-headline text-center">WebPGator</h1>
          <p className="text-muted-foreground text-center mt-2">
            Bulk convert and optimize your images to WebP with AI-powered precision.
          </p>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <ImageUploader onUpload={handleImageUpload} />

          {images.length > 0 && (
            <div className="flex justify-end gap-2">
               <Button onClick={handleDownloadAll} disabled={convertedImages.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download All (.zip)
              </Button>
              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}

          <ImageList images={images} onRemove={handleRemoveImage} onUpdateImage={handleUpdateImage} />
        </div>
      </main>
      <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WebPGator. All rights reserved.</p>
      </footer>
    </div>
  );
}
