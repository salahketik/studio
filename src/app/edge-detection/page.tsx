'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Wand2, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function EdgeDetectionPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processImage = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width;
      const h = canvas.height;

      const output = new Uint8ClampedArray(data.length);
      const kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1]; // Laplacian Kernel

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let res = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                res += data[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
              }
            }
            output[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, res));
          }
          output[(y * w + x) * 4 + 3] = 255;
        }
      }
      
      ctx.putImageData(new ImageData(output, w, h), 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `edge_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Garis tepi telah dideteksi." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Edge Detection</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Laplacian Contour Analysis</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-accent" /> Analysis Hub
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Render Contours
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-black">
                 <img src={originalImage.url} alt="Preview" className="max-w-full h-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
