'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { runAIOptimization } from '@/app/actions';
import type { ImageFile } from '@/features/image-converter/types';
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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
      if (!image.convertedFile) {
        throw new Error('File terkonversi tidak ditemukan.');
      }
      const imageUri = await fileToDataUri(image.convertedFile);
      const result = await runAIOptimization({
        imageUri,
        informationLossTolerance: lossTolerance[0],
        description,
      });

      if (!isMounted.current) return;

      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.optimizedImageUri) {
        throw new Error('AI tidak mengembalikan gambar yang dioptimalkan.');
      }

      const res = await fetch(result.optimizedImageUri);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOptimizedImage({ url, size: blob.size });

    } catch (error) {
      if (!isMounted.current) return;
      toast({
        variant: 'destructive',
        title: 'Optimisasi AI Gagal',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.',
      });
    } finally {
      if (isMounted.current) {
        setIsOptimizing(false);
        onUpdateImage(image.id, { status: 'converted', progress: 100 });
      }
    }
  };
  
  const handleApply = async () => {
     if (!optimizedImage) return;

     const res = await fetch(optimizedImage.url);
     const blob = await res.blob();
     
     // Revoke old converted URL if it exists
     if (image.convertedUrl) {
       URL.revokeObjectURL(image.convertedUrl);
     }
     
     onUpdateImage(image.id, {
        convertedFile: blob,
        convertedSize: blob.size,
        convertedUrl: optimizedImage.url,
     });
     toast({
        title: "Sukses",
        description: "Gambar hasil optimisasi AI telah diterapkan.",
     })
     setIsOpen(false);
  };
  
  useEffect(() => {
    if (!isOpen) {
        setOptimizedImage(null);
    }
  }, [isOpen]);

  // Cleanup effect
  useEffect(() => {
    let currentOptimizedUrl = optimizedImage?.url;
    return () => {
        if (currentOptimizedUrl) {
            URL.revokeObjectURL(currentOptimizedUrl);
        }
    }
  }, [optimizedImage]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Kompresi dengan Bantuan AI</DialogTitle>
          <DialogDescription>
            Sempurnakan kompresi WebP untuk '{image.file.name}' dengan AI.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <Label>Asli (Terkonversi)</Label>
                <div className="mt-2 relative aspect-video w-full rounded-md overflow-hidden border">
                  {image.convertedUrl ? <Image src={image.convertedUrl} alt="Asli" fill objectFit="contain" /> : <div className="flex items-center justify-center h-full bg-muted">Gambar tidak tersedia</div>}
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">Ukuran: {image.convertedSize ? (image.convertedSize / 1024).toFixed(2) : 0} KB</p>
              </div>
              <div>
                <Label>Pratinjau Hasil Optimisasi AI</Label>
                <div className="mt-2 relative aspect-video w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                  {isOptimizing && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
                  {!isOptimizing && optimizedImage && <Image src={optimizedImage.url} alt="Optimized" fill objectFit="contain" />}
                  {!isOptimizing && !optimizedImage && <Sparkles className="w-8 h-8 text-muted-foreground" />}
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {optimizedImage ? `Ukuran: ${(optimizedImage.size / 1024).toFixed(2)} KB` : 'Jalankan pengoptimal untuk melihat pratinjau'}
                </p>
              </div>
          </div>
          
          <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="loss-slider">Toleransi Kehilangan Informasi: {lossTolerance[0]}%</Label>
                <Slider
                  id="loss-slider"
                  min={0}
                  max={100}
                  step={1}
                  value={lossTolerance}
                  onValueChange={setLossTolerance}
                  className={cn('my-2')}
                />
                <p className="text-xs text-muted-foreground">0% adalah lossless (kualitas lebih tinggi, ukuran lebih besar), 100% adalah kehilangan maksimum (kualitas lebih rendah, ukuran lebih kecil).</p>
              </div>
              <div>
                  <Label htmlFor="description">Deskripsi Gambar (Opsional)</Label>
                  <Textarea id="description" placeholder="cth., 'Potret cerah untuk foto profil' atau 'Ikon kecil yang cepat dimuat untuk menu situs web'." value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2" />
              </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
          <Button onClick={handleOptimize} disabled={isOptimizing}>
            {isOptimizing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Mengoptimalkan...</> : <><Sparkles className="mr-2 h-4 w-4" /> Jalankan Pengoptimal</>}
          </Button>
          <Button onClick={handleApply} disabled={!optimizedImage || isOptimizing}>Terapkan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
