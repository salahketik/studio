'use client';

import { useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useImageFiles } from '@/features/image-converter/hooks/use-image-files';
import { useImageConverter } from '@/features/image-converter/hooks/use-image-converter';
import { useDocumentTitle } from '@/hooks/use-document-title';

import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { ImageList } from '@/features/image-converter/components/image-list';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';


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
    ? `(${pendingImages.length}) Tertunda - WebPGator`
    : 'WebPGator';
  useDocumentTitle(documentTitle);


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 h-full">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <ImageUploader onUpload={handleImageUpload} />

        {images.length > 0 && (
          <div className="flex justify-end gap-2">
              <Button onClick={() => handleDownloadAll()} disabled={convertedImages.length === 0 || isConverting}>
              <Download className="mr-2 h-4 w-4" />
              Unduh Semua (.zip)
            </Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={isConverting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Semua
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
    </div>
  );
}
