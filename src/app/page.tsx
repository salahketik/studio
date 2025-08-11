'use client';

import { useCallback, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';
import { useImageFiles } from '@/hooks/use-image-files';
import { useImageConverter } from '@/hooks/use-image-converter';

import { ImageUploader } from '@/components/image-uploader';
import { ImageList } from '@/components/image-list';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';


export default function Home() {
  const { toast } = useToast();
  const {
    images,
    setImages,
    handleImageUpload,
    handleRemoveImage,
    handleClearAll,
    handleUpdateImage,
    globalOptions,
    setGlobalOptions,
  } = useImageFiles();

  const { isConverting, conversionProgress, convertImages } = useImageConverter(setImages);

  const handleReconvertImage = useCallback((id: string) => {
    const imageToConvert = images.find(img => img.id === id);
    if(imageToConvert) {
      handleUpdateImage(id, { status: 'pending' });
      convertImages([imageToConvert]);
    }
  }, [images, convertImages, handleUpdateImage]);

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
  }, [globalOptions, toast, setImages]);

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
            onConvertAll={() => convertImages(pendingImages)}
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
