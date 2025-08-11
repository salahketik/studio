'use client';

import type { ImageFile } from '@/types';
import { ImageListItem } from './image-list-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageListProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
}

export function ImageList({ images, onRemove, onUpdateImage }: ImageListProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {images.map((image) => (
            <ImageListItem key={image.id} image={image} onRemove={onRemove} onUpdateImage={onUpdateImage} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
