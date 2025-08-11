'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Crop as CropIcon, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageFile, ResizeOptions, CropOptions } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EditImageDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  image: ImageFile;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
}

export function EditImageDialog({ isOpen, setIsOpen, image, onUpdateImage }: EditImageDialogProps) {
  // Resize state
  const [resizeEnabled, setResizeEnabled] = useState(image.resize?.enabled ?? false);
  const [width, setWidth] = useState(image.resize?.width ?? image.originalDimensions?.width ?? 0);
  const [height, setHeight] = useState(image.resize?.height ?? image.originalDimensions?.height ?? 0);
  const [isLocked, setIsLocked] = useState(true);

  // Crop state
  const [cropEnabled, setCropEnabled] = useState(image.crop?.enabled ?? false);
  const [crop, setCrop] = useState<Crop | undefined>(undefined);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(image.crop?.crop ?? null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { toast } = useToast();

  const aspectRatio = image.originalDimensions ? image.originalDimensions.width / image.originalDimensions.height : 1;
  
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );
      setCrop(image.crop?.crop ? { ...image.crop.crop, unit: 'px'} : initialCrop);
    }
  }


  useEffect(() => {
    if (isOpen) {
      const { resize, crop: cropData, originalDimensions } = image;
      setResizeEnabled(resize?.enabled ?? false);
      setWidth(resize?.width ?? originalDimensions?.width ?? 0);
      setHeight(resize?.height ?? originalDimensions?.height ?? 0);

      setCropEnabled(cropData?.enabled ?? false);
      if (cropData?.crop) {
        setCompletedCrop(cropData.crop);
        setCrop({ ...cropData.crop, unit: 'px' });
      } else {
        setCompletedCrop(null);
        setCrop(undefined);
      }
    }
  }, [isOpen, image]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setWidth(newWidth);
    if (isLocked) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setHeight(newHeight);
    if (isLocked) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };
  
  const handleApply = () => {
    const resizeOptions: ResizeOptions = {
      enabled: resizeEnabled,
      width: width,
      height: height,
    };
    
    const cropOptions: CropOptions = {
        enabled: cropEnabled,
        crop: completedCrop,
    }

    onUpdateImage(image.id, { resize: resizeOptions, crop: cropOptions, status: 'pending' });
    toast({
      title: 'Changes Applied',
      description: 'Image edit settings have been updated. Re-convert to see the changes.',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Image: {image.file.name}</DialogTitle>
          <DialogDescription>
            Resize and crop your image before conversion.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-start">
          <div className="relative w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
            {image.originalUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                disabled={!cropEnabled}
                aspect={isLocked ? aspectRatio : undefined}
                className="max-h-[50vh]"
              >
                <Image 
                  ref={imgRef}
                  src={image.originalUrl} 
                  alt="Original Preview" 
                  onLoad={onImageLoad}
                  width={image.originalDimensions?.width}
                  height={image.originalDimensions?.height}
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </ReactCrop>
            )}
          </div>
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
            
            <Collapsible open={resizeEnabled} onOpenChange={setResizeEnabled} asChild>
              <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                      <Label htmlFor="resize-switch" className="font-bold flex items-center gap-2 cursor-pointer"><Pencil className="h-4 w-4" />Resize Image</Label>
                      <CollapsibleTrigger asChild>
                         <Switch
                          id="resize-switch"
                          checked={resizeEnabled}
                          onCheckedChange={setResizeEnabled}
                        />
                      </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className={cn("space-y-4", !resizeEnabled && "opacity-50 pointer-events-none")}>
                      <div className="flex items-end gap-2">
                          <div className="grid w-full gap-1.5">
                              <Label htmlFor="width">Width</Label>
                              <Input id="width" type="number" value={width} onChange={handleWidthChange} />
                          </div>
                          <span className="pb-2 text-muted-foreground">x</span>
                          <div className="grid w-full gap-1.5">
                              <Label htmlFor="height">Height</Label>
                              <Input id="height" type="number" value={height} onChange={handleHeightChange} />
                          </div>
                          <Button
                              variant="outline"
                              size="icon"
                              className="flex-shrink-0"
                              onClick={() => setIsLocked(!isLocked)}
                          >
                              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Original: {image.originalDimensions?.width} x {image.originalDimensions?.height}</p>
                  </CollapsibleContent>
              </div>
            </Collapsible>
            
            <Collapsible open={cropEnabled} onOpenChange={setCropEnabled} asChild>
              <div className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                      <Label htmlFor="crop-switch" className="font-bold flex items-center gap-2 cursor-pointer"><CropIcon className="h-4 w-4" />Crop Image</Label>
                       <CollapsibleTrigger asChild>
                          <Switch
                              id="crop-switch"
                              checked={cropEnabled}
                              onCheckedChange={setCropEnabled}
                          />
                      </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className={cn("space-y-2", !cropEnabled && "opacity-50 pointer-events-none")}>
                    <p className="text-xs text-muted-foreground text-center">Enable to draw a crop area on the preview image.</p>
                  </CollapsibleContent>
              </div>
            </Collapsible>

            <div className="p-4 border rounded-lg opacity-50">
                <p className="text-center text-sm text-muted-foreground">Rotate coming soon!</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleApply}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
