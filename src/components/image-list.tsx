'use client';

import type { ImageFile, ConversionOptions } from '@/types';
import { ImageListItem } from './image-list-item';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { GlobalConversionSettings } from './global-conversion-settings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';


interface ImageListProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
  globalOptions: ConversionOptions;
  onGlobalOptionsChange: (options: ConversionOptions) => void;
  onApplyGlobalOptions: () => void;
  onConvertAll: () => void;
  isConverting: boolean;
  conversionProgress: number;
}

export function ImageList({ 
  images, 
  onRemove, 
  onUpdateImage, 
  globalOptions, 
  onGlobalOptionsChange, 
  onApplyGlobalOptions,
  onConvertAll,
  isConverting,
  conversionProgress,
}: ImageListProps) {
  if (images.length === 0) {
    return null;
  }
  
  const pendingImages = images.filter(img => img.status === 'pending');
  const convertingImages = images.filter(img => img.status === 'converting');
  const totalConverting = isConverting ? (pendingImages.length + convertingImages.length) : 0;
  const completedInBatch = totalConverting > 0 ? (conversionProgress / 100) * totalConverting : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <CardTitle>Conversion Queue</CardTitle>
                <CardDescription>
                    {images.length} image(s) in queue. {pendingImages.length} pending.
                </CardDescription>
            </div>
            {pendingImages.length > 0 && (
                <Button onClick={onConvertAll} className="w-full sm:w-auto" disabled={isConverting}>
                    <Zap className="mr-2 h-4 w-4"/>
                    {isConverting ? 'Converting...' : `Convert All Pending (${pendingImages.length})`}
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <GlobalConversionSettings 
            options={globalOptions}
            onOptionsChange={onGlobalOptionsChange}
            onApplyToAll={onApplyGlobalOptions}
            disabled={images.length === 0 || isConverting}
          />

          {isConverting && (
            <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  Converting {Math.round(completedInBatch)} of {totalConverting} images...
                </p>
                <Progress value={conversionProgress} className="w-full" />
            </div>
          )}

          <ScrollArea className="h-[45vh] pr-4">
            <div className="space-y-4">
              {images.map((image) => (
                <ImageListItem 
                  key={image.id} 
                  image={image} 
                  onRemove={onRemove} 
                  onUpdateImage={onUpdateImage}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
