'use client';

import type { ImageFile, ConversionOptions } from '@/types';
import { ImageListItem } from './image-list-item';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface ImageListProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
  onConvert: (id: string, options: ConversionOptions) => void;
}

export function ImageList({ images, onRemove, onUpdateImage, onConvert }: ImageListProps) {
  if (images.length === 0) {
    return null;
  }
  
  const pendingImages = images.filter(img => img.status === 'pending');

  const handleConvertAll = () => {
    pendingImages.forEach(image => {
      onConvert(image.id, image.conversionOptions);
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Conversion Queue</CardTitle>
                <CardDescription>
                    {images.length} image(s) ready to be processed.
                </CardDescription>
            </div>
            {pendingImages.length > 0 && (
                <Button onClick={handleConvertAll}>
                    <Zap className="mr-2 h-4 w-4"/>
                    Convert All Pending
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {images.map((image) => (
            <ImageListItem 
              key={image.id} 
              image={image} 
              onRemove={onRemove} 
              onUpdateImage={onUpdateImage}
              onConvert={onConvert}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
