'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Brush, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function OilPaintPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [radius, setRadius] = useState([4]);
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
      const width = canvas.width;
      const height = canvas.height;
      const rad = radius[0];
      const intensityLevels = 20;

      const output = new Uint8ClampedArray(data.length);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const intensityCount = new Array(intensityLevels).fill(0);
          const rSum = new Array(intensityLevels).fill(0);
          const gSum = new Array(intensityLevels).fill(0);
          const bSum = new Array(intensityLevels).fill(0);

          for (let ky = -rad; ky <= rad; ky++) {
            for (let kx = -rad; kx <= rad; kx++) {
              const ny = y + ky;
              const nx = x + kx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                const idx = (ny * width + nx) * 4;
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                const intensity = Math.floor(((r + g + b) / 3) * intensityLevels / 256);
                intensityCount[intensity]++;
                rSum[intensity] += r;
                gSum[intensity] += g;
                bSum[intensity] += b;
              }
            }
          }

          let maxIntensity = 0;
          let maxCount = 0;
          for (let i = 0; i < intensityLevels; i++) {
            if (intensityCount[i] > maxCount) {
              maxCount = intensityCount[i];
              maxIntensity = i;
            }
          }

          const outIdx = (y * width + x) * 4;
          output[outIdx] = rSum[maxIntensity] / maxCount;
          output[outIdx + 1] = gSum[maxIntensity] / maxCount;
          output[outIdx + 2] = bSum[maxIntensity] / maxCount;
          output[outIdx + 3] = 255;
        }
      }

      ctx.putImageData(new ImageData(output, width, height), 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `oil_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Efek lukisan cat minyak telah diterapkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Oil Paint Studio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Impressionist Art Filter</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Brush className="w-4 h-4 text-accent" /> Stroke Control</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Brush Radius: {radius[0]}px</Label>
                  <Slider value={radius} onValueChange={setRadius} min={1} max={10} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Render Painting
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}><RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar</Button>
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