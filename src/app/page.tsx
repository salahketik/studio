'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { ImageFile, ConversionOptions, ConversionFormat } from '@/types';
import { ImageUploader } from '@/components/image-uploader';
import { ImageList } from '@/components/image-list';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';


export default function Home() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [globalOptions, setGlobalOptions] = useState<ConversionOptions>({ format: 'image/webp', quality: 0.8 });
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const convertImage = useCallback((image: ImageFile, options: ConversionOptions, onComplete: () => void) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === image.id
          ? { ...img, status: 'converting' }
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
          onComplete();
          return;
        }
        ctx.drawImage(imgElement, 0, 0);
        
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
          options.format,
          options.quality
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
  }, []);
  
  const handleBatchConvert = useCallback(async (imagesToConvert: ImageFile[]) => {
      if (imagesToConvert.length === 0) return;
      
      setIsConverting(true);
      setConversionProgress(0);
      
      let completedCount = 0;
      
      const conversionPromises = imagesToConvert.map(image => {
        return new Promise<void>(resolve => {
            convertImage(image, image.conversionOptions, () => {
                completedCount++;
                setConversionProgress((completedCount / imagesToConvert.length) * 100);
                resolve();
            });
        });
      });

      await Promise.all(conversionPromises);
      
      setIsConverting(false);
  }, [convertImage]);

  const handleImageUpload = useCallback(
    (files: File[]) => {
      const newImages: ImageFile[] = files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        file,
        originalSize: file.size,
        status: 'pending',
        conversionOptions: globalOptions
      }));

      const uniqueNewImages = newImages.filter(
        (newImg) => !images.some((existingImg) => existingImg.id === newImg.id)
      );

      if (uniqueNewImages.length > 0) {
        setImages((prev) => [...prev, ...uniqueNewImages]);
      }
    },
    [images, globalOptions]
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
  
  const handleReconvertImage = useCallback((id: string, options: ConversionOptions) => {
    const imageToConvert = images.find(img => img.id === id);
    if(imageToConvert) {
      const updatedImage = { ...imageToConvert, conversionOptions: options };
      handleUpdateImage(id, { conversionOptions: options, status: 'pending' });
      handleBatchConvert([updatedImage]);
    }
  }, [images, handleBatchConvert, handleUpdateImage]);

  const convertedImages = useMemo(() => images.filter(img => img.status === 'converted' && img.convertedFile), [images]);
  const pendingImages = useMemo(() => images.filter(img => img.status === 'pending'), [images]);

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
      saveAs(zipBlob, 'ImagePress_images.zip');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Zip Creation Failed',
        description: 'Could not create the zip file.',
      });
    }

  }, [convertedImages, toast]);
  
  const handleApplyGlobalOptions = useCallback(() => {
    setImages(prev => prev.map(img => ({ ...img, conversionOptions: globalOptions, status: 'pending' })));
    toast({
        title: "Global Settings Applied",
        description: "All images have been updated with the new conversion settings.",
    })
  }, [globalOptions, toast]);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold font-headline">ImagePress</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <ImageUploader onUpload={handleImageUpload} />

          {images.length > 0 && (
            <div className="flex justify-end gap-2">
               <Button onClick={handleDownloadAll} disabled={convertedImages.length === 0 || isConverting}>
                <Download className="mr-2 h-4 w-4" />
                Download All (.zip)
              </Button>
              <Button variant="destructive" onClick={handleClearAll} disabled={isConverting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}

          <ImageList 
            images={images} 
            onRemove={handleRemoveImage} 
            onUpdateImage={handleUpdateImage}
            onConvert={handleReconvertImage}
            globalOptions={globalOptions}
            onGlobalOptionsChange={setGlobalOptions}
            onApplyGlobalOptions={handleApplyGlobalOptions}
            onConvertAll={() => handleBatchConvert(pendingImages)}
            isConverting={isConverting}
            conversionProgress={conversionProgress}
          />
        </div>
      </main>
      <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ImagePress. All rights reserved.</p>
      </footer>
    </div>
  );
}
