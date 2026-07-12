'use client';

import { useMemo } from 'react';
import { useImageFiles } from '@/features/image-converter/hooks/use-image-files';
import { useImageConverter } from '@/features/image-converter/hooks/use-image-converter';
import { useDocumentTitle } from '@/features/image-converter/hooks/use-document-title';

import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { ImageList } from '@/features/image-converter/components/image-list';
import { Button } from '@/components/ui/button';
import { Download, Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';


export default function ImageConverterPage() {
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
    ? `(${pendingImages.length}) Tertunda - Konverter Gambar`
    : 'Konverter Gambar - Alat Kreatif';
  useDocumentTitle(documentTitle);


  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 h-full">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
            </Button>
            <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight">Konverter Gambar</h1>
                <p className="text-muted-foreground text-sm">
                    Konversi massal gambar ke WebP, JPG, atau PNG dengan cepat.
                </p>
            </div>
        </div>

        <ImageUploader onUpload={handleImageUpload} />

        {images.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button onClick={() => handleDownloadAll()} disabled={convertedImages.length === 0 || isConverting} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Unduh Semua (.zip)
              </Button>
              <Button variant="destructive" onClick={handleClearAll} disabled={isConverting} className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Semua
              </Button>
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}
