'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FileImage,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Wand2,
  Loader2,
} from 'lucide-react';
import type { ImageFile } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AICompressionDialog } from './ai-compression-dialog';

interface ImageListItemProps {
  image: ImageFile;
  onRemove: (id: string) => void;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ImageListItem({ image, onRemove, onUpdateImage }: ImageListItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

  useEffect(() => {
    if (image.status === 'converted' && image.convertedUrl) {
      setImageUrl(image.convertedUrl);
    } else {
      const url = URL.createObjectURL(image.file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image.file, image.status, image.convertedUrl]);
  
  const sizeReduction = image.convertedSize
    ? ((image.originalSize - image.convertedSize) / image.originalSize) * 100
    : 0;

  const StatusIndicator = () => {
    switch (image.status) {
      case 'converting':
      case 'ai_optimizing':
        return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
      case 'converted':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileImage className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const handleDownload = () => {
    if (!image.convertedUrl || !image.convertedFile) return;
    const a = document.createElement('a');
    a.href = image.convertedUrl;
    a.download = image.file.name.replace(/\.[^/.]+$/, ".webp");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 w-16 h-16 relative bg-muted rounded-md overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={image.file.name} layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <p className="font-semibold truncate" title={image.file.name}>{image.file.name}</p>
        <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
          <span>{formatBytes(image.originalSize)}</span>
          {image.convertedSize && (
            <>
              <span>&rarr;</span>
              <span className="font-medium text-foreground">{formatBytes(image.convertedSize)}</span>
              {sizeReduction > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  -{sizeReduction.toFixed(1)}%
                </Badge>
              )}
            </>
          )}
        </div>
        {(image.status === 'converting' || image.status === 'ai_optimizing') && image.progress !== undefined && (
          <Progress value={image.progress} className="h-2 mt-1" />
        )}
        {image.status === 'error' && (
          <p className="text-xs text-destructive mt-1">{image.error}</p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <StatusIndicator />
        <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsAiDialogOpen(true)}
            disabled={image.status !== 'converted'}
            title="AI-Assisted Compression"
          >
            <Wand2 className="h-4 w-4" />
        </Button>
        <Button
            size="icon"
            variant="ghost"
            onClick={handleDownload}
            disabled={image.status !== 'converted'}
            title="Download"
          >
            <Download className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onRemove(image.id)} title="Remove">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      
      {image.status === 'converted' &&
        <AICompressionDialog
            isOpen={isAiDialogOpen}
            setIsOpen={setIsAiDialogOpen}
            image={image}
            onUpdateImage={onUpdateImage}
        />
      }
    </div>
  );
}
