
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  FileImage,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Wand2,
  Loader2,
  Pencil,
} from 'lucide-react';
import type { ImageFile, ConversionOptions, ConversionFormat } from '@/features/image-converter/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AICompressionDialog } from './ai-compression-dialog';
import { EditImageDialog } from './edit-image-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useImageConverter } from '@/features/image-converter/hooks/use-image-converter';


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
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { conversionOptions } = image;

  const { convertImages, isConverting } = useImageConverter(onUpdateImage);

  const imageUrl = useMemo(() => {
    return image.convertedUrl || image.originalUrl;
  }, [image.originalUrl, image.convertedUrl]);

  const sizeReduction = image.convertedSize
    ? ((image.originalSize - image.convertedSize) / image.originalSize) * 100
    : 0;

  const isItemBusy = image.status === 'converting' || image.status === 'ai_optimizing' || isConverting;

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
    
    let extension = image.conversionOptions.format.split('/')[1];
    if (extension === 'jpeg') extension = 'jpeg';
    if (image.conversionOptions.format === 'image/jpg') extension = 'jpg';
    if (image.conversionOptions.format === 'image/x-icon') {
        extension = 'ico';
    }

    const a = document.createElement('a');
    a.href = image.convertedUrl;
    a.download = image.file.name.replace(/\.[^/.]+$/, `.${extension}`);
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
  };

  const handleConvertClick = () => {
    if (image.status !== 'pending') {
      onUpdateImage(image.id, { status: 'pending' });
    }
    convertImages([image]);
  };

  const handleOptionsChange = (newOptions: Partial<ConversionOptions>) => {
    onUpdateImage(image.id, { conversionOptions: { ...conversionOptions, ...newOptions } });
  };
  
  const showQualitySlider = useMemo(() => conversionOptions.format === 'image/jpeg' || conversionOptions.format === 'image/jpg' || conversionOptions.format === 'image/webp', [conversionOptions.format]);
  const isIcoFormat = useMemo(() => conversionOptions.format === 'image/x-icon', [conversionOptions.format]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-16 h-16 relative bg-muted rounded-md overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt={image.file.name} layout="fill" objectFit="cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <p className="font-semibold truncate" title={image.file.name}>{image.file.name}</p>
            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <span>{formatBytes(image.originalSize)}</span>
              {image.convertedSize && image.status === 'converted' && (
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
            {image.status === 'error' && (
              <p className="text-xs text-destructive mt-1">{image.error}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <StatusIndicator />
            <Button
                size="icon"
                variant="ghost"
                onClick={handleDownload}
                disabled={image.status !== 'converted'}
                title="Unduh"
            >
                <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onRemove(image.id)} disabled={isItemBusy} title="Hapus">
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pl-20">
        <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
          <div>
            <Label>Format</Label>
            <Select 
              value={conversionOptions.format} 
              onValueChange={(value) => handleOptionsChange({ format: value as ConversionFormat })} 
              disabled={isItemBusy}
            >
                <SelectTrigger className="w-full mt-1 h-9">
                    <SelectValue placeholder="Pilih format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="image/webp">WebP</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/jpg">JPG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/x-icon">ICO (via PNG 32x32)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          
          <div className={cn(!showQualitySlider && 'opacity-50')}>
              <Label>Kualitas: {Math.round(conversionOptions.quality * 100)}%</Label>
              <Slider
                  value={[conversionOptions.quality * 100]}
                  onValueChange={(v) => handleOptionsChange({ quality: v[0] / 100 })}
                  max={100}
                  step={1}
                  className="mt-2"
                  disabled={isItemBusy || !showQualitySlider}
              />
          </div>
        </div>
        
        <div className="flex gap-2 self-end sm:self-center pt-4">
           <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={isItemBusy || isIcoFormat}
              title={isIcoFormat ? "Pengeditan dinonaktifkan untuk format ICO" : "Edit Gambar"}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
          </Button>
          <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAiDialogOpen(true)}
              disabled={image.status !== 'converted' || isItemBusy || isIcoFormat}
              title={isIcoFormat ? "Bantuan AI dinonaktifkan untuk format ICO" : "Kompresi dengan Bantuan AI"}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Bantuan AI
          </Button>
          <Button size="sm" onClick={handleConvertClick} disabled={isItemBusy}>
              {isItemBusy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Konversi...</> : 'Konversi' }
          </Button>
        </div>
      </div>

      <EditImageDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        image={image}
        onUpdateImage={onUpdateImage}
      />
      
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
