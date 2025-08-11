'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageFile, ResizeOptions } from '@/types';

interface EditImageDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  image: ImageFile;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
}

export function EditImageDialog({ isOpen, setIsOpen, image, onUpdateImage }: EditImageDialogProps) {
  const [resizeEnabled, setResizeEnabled] = useState(image.resize?.enabled ?? false);
  const [width, setWidth] = useState(image.resize?.width ?? image.originalDimensions?.width ?? 0);
  const [height, setHeight] = useState(image.resize?.height ?? image.originalDimensions?.height ?? 0);
  const [isLocked, setIsLocked] = useState(true);
  const { toast } = useToast();

  const aspectRatio = image.originalDimensions ? image.originalDimensions.width / image.originalDimensions.height : 1;

  useEffect(() => {
    if (isOpen) {
      const currentResize = image.resize;
      setResizeEnabled(currentResize?.enabled ?? false);
      setWidth(currentResize?.width ?? image.originalDimensions?.width ?? 0);
      setHeight(currentResize?.height ?? image.originalDimensions?.height ?? 0);
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
    onUpdateImage(image.id, { resize: resizeOptions, status: 'pending' });
    toast({
      title: 'Changes Applied',
      description: 'Image edit settings have been updated. Re-convert to see the changes.',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Image: {image.file.name}</DialogTitle>
          <DialogDescription>
            Resize, crop, and rotate your image before conversion.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-start">
          <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-muted">
            {image.originalUrl && <Image src={image.originalUrl} alt="Original Preview" layout="fill" objectFit="contain" />}
          </div>
          <div className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                    <Label htmlFor="resize-switch" className="font-bold">Resize Image</Label>
                    <Switch
                        id="resize-switch"
                        checked={resizeEnabled}
                        onCheckedChange={setResizeEnabled}
                    />
                </div>
                <div className={cn("space-y-4", !resizeEnabled && "opacity-50 pointer-events-none")}>
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
                </div>
            </div>
            
            {/* Placeholder for future editing tools */}
            <div className="p-4 border rounded-lg opacity-50">
                <p className="text-center text-sm text-muted-foreground">Crop & Rotate coming soon!</p>
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
