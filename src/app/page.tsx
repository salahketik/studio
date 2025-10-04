'use client';

import { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useImageFiles } from '@/hooks/use-image-files';
import { useImageConverter } from '@/hooks/use-image-converter';
import { useDocumentTitle } from '@/hooks/use-document-title';

import { ImageUploader } from '@/components/image-uploader';
import { ImageList } from '@/components/image-list';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';


export default function Home() {
  const { toast } = useToast();
  const {
    images,
    handleImageUpload,
    handleRemoveImage,
    handleClearAll,
    handleUpdateImage,
    globalOptions,
    setGlobalOptions,
    handleDownloadAll,
    handleApplyGlobalOptions,
    convertedImages
  } = useImageFiles();

  const { isConverting, conversionProgress, convertImages } = useImageConverter(handleUpdateImage);
  
  const pendingImages = useMemo(() => images.filter(img => img.status === 'pending'), [images]);
  
  const documentTitle = pendingImages.length > 0
    ? `(${pendingImages.length}) Pending - WebPGator`
    : 'WebPGator';
  useDocumentTitle(documentTitle);


  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold font-headline">WebPGator</h1>
              <nav className="flex items-center gap-2">
                <Button variant="link" asChild className="p-0 text-muted-foreground data-[active]:text-foreground">
                    <Link href="/">Bulk Converter</Link>
                </Button>
                <Button variant="link" asChild className="p-0 text-muted-foreground">
                    <Link href="/trim">Smart Trim</Link>
                </Button>
              </nav>
            </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <ImageUploader onUpload={handleImageUpload} />

          {images.length > 0 && (
            <div className="flex justify-end gap-2">
               <Button onClick={() => handleDownloadAll()} disabled={convertedImages.length === 0 || isConverting}>
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
        <p>&copy; {new Date().getFullYear()} WebPGator. All rights reserved.</p>
      </footer>
    </div>
  );
}
