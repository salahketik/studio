'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Binary, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function HalftonePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [dotSize, setDotSize] = useState([8]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processHalftone = () => {
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

      const size = dotSize[0];
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;
      tCtx.drawImage(img, 0, 0);
      const data = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;

      ctx.fillStyle = 'black';
      for (let y = 0; y < canvas.height; y += size) {
        for (let x = 0; x < canvas.width; x += size) {
          const offset = (y * canvas.width + x) * 4;
          const r = data[offset];
          const g = data[offset + 1];
          const b = data[offset + 2];
          const avg = (r + g + b) / 3;
          const radius = (size / 2) * (1 - avg / 255);

          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `halftone_${Date.now()}.png`);
          toast({ title: "Berhasil", description: "Filter Halftone telah diterapkan." });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Halftone Filter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Retro Newsprint Dot Effect</p>
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
                  <Binary className="w-4 h-4 text-accent" /> Dot Density
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Size: {dotSize[0]}px</Label>
                  <Slider value={dotSize} onValueChange={setDotSize} min={4} max={30} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processHalftone} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Art
                </Button>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> New Image
            </Button>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-white">
                 <div className="text-center opacity-40 uppercase font-black tracking-widest p-12">
                   Click "Export" to see result. High-res dots calculation is intensive.
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
