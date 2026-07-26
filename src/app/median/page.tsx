'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Filter, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function MedianFilterPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processMedian = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Limit size for heavy processing
      const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width, h = canvas.height;
      const output = new Uint8ClampedArray(data.length);
      const radius = 1;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const rVals: number[] = [], gVals: number[] = [], bVals: number[] = [];
          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              const ny = Math.min(h-1, Math.max(0, y+ky));
              const nx = Math.min(w-1, Math.max(0, x+kx));
              const idx = (ny * w + nx) * 4;
              rVals.push(data[idx]);
              gVals.push(data[idx+1]);
              bVals.push(data[idx+2]);
            }
          }
          rVals.sort((a,b) => a-b);
          gVals.sort((a,b) => a-b);
          bVals.sort((a,b) => a-b);

          const mid = Math.floor(rVals.length / 2);
          const outIdx = (y * w + x) * 4;
          output[outIdx] = rVals[mid];
          output[outIdx+1] = gVals[mid];
          output[outIdx+2] = bVals[mid];
          output[outIdx+3] = 255;
        }
      }

      ctx.putImageData(new ImageData(output, w, h), 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `median_${originalImage.file.name}`);
          toast({ title: "Denoise Selesai", description: "Bintik noise telah diredam secara halus." });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Median Filter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Rank-Order Denoise Engine</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Filter className="w-4 h-4 text-accent" /> Mode</CardTitle></CardHeader>
              <CardContent className="p-6">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processMedian} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Clean Noise
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 flex items-center justify-center p-8 bg-muted/10 rounded-[3rem]">
             <img src={originalImage.url} alt="Preview" className="max-w-full h-auto rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}