'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { runAIOptimization } from '@/app/actions';
import type { ImageFile } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICompressionDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  image: ImageFile;
  onUpdateImage: (id: string, newImageData: Partial<ImageFile>) => void;
}

export function AICompressionDialog({ isOpen, setIsOpen, image, onUpdateImage }: AICompressionDialogProps) {
  const [lossTolerance, setLossTolerance] = useState([50]);
  const [description, setDescription] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedImage, setOptimizedImage] = useState<{ url: string; size: number } | null>(null);
  const { toast } = useToast();

  const fileToDataUri = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setOptimizedImage(null);
    onUpdateImage(image.id, { status: 'ai_optimizing', progress: 50 });

    try {
      const imageUri = await fileToDataUri(image.convertedFile!);
      const result = await runAIOptimization({
        imageUri,
        informationLossTolerance: lossTolerance[0],
        description,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      const res = await fetch(result.optimizedImageUri!);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOptimizedImage({ url, size: blob.size });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Optimization Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsOptimizing(false);
      onUpdateImage(image.id, { status: 'converted', progress: 100 });
    }
  };
  
  const handleApply = async () => {
     if (!optimizedImage) return;

     const res = await fetch(optimizedImage.url);
     const blob = await res.blob();
     
     onUpdateImage(image.id, {
        convertedFile: blob,
        convertedSize: blob.size,
        convertedUrl: optimizedImage.url,
     });
     toast({
        title: "Success",
        description: "AI optimized image has been applied.",
        className: "bg-green-100 text-green-800"
     })
     setIsOpen(false);
  };
  
  useEffect(() => {
    if (!isOpen) {
        setOptimizedImage(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>AI-Assisted Compression</DialogTitle>
          <DialogDescription>
            Fine-tune WebP compression for '{image.file.name}' with AI.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <Label>Original (Converted)</Label>
                <div className="mt-2 relative aspect-video w-full rounded-md overflow-hidden border">
                  <Image src={image.convertedUrl!} alt="Original" layout="fill" objectFit="contain" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">Size: {image.convertedSize ? (image.convertedSize / 1024).toFixed(2) : 0} KB</p>
              </div>
              <div>
                <Label>AI Optimized Preview</Label>
                <div className="mt-2 relative aspect-video w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                  {isOptimizing && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
                  {!isOptimizing && optimizedImage && <Image src={optimizedImage.url} alt="Optimized" layout="fill" objectFit="contain" />}
                  {!isOptimizing && !optimizedImage && <Sparkles className="w-8 h-8 text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {optimizedImage ? `Size: ${(optimizedImage.size / 1024).toFixed(2)} KB` : 'Run optimizer to see preview'}
                </p>
              </div>
          </div>
          
          <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="loss-slider">Information Loss Tolerance: {lossTolerance[0]}%</Label>
                <Slider
                  id="loss-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={lossTolerance}
                  onValueChange={setLossTolerance}
                  className={cn('my-2')}
                />
                <p className="text-xs text-muted-foreground">0% is lossless (higher quality, larger size), 100% is maximum loss (lower quality, smaller size).</p>
              </div>
              <div>
                  <Label htmlFor="description">Image Description (Optional)</Label>
                  <Textarea id="description" placeholder="e.g., 'A vibrant portrait for a profile picture' or 'A small, fast-loading icon for a website menu'." value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2" />
              </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Optimizing...</> : <><Sparkles className="mr-2 h-4 w-4" /> Run Optimizer</>}
          </Button>
          <Button onClick={handleApply} disabled={!optimizedImage || isOptimizing}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
