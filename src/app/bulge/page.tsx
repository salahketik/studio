'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Maximize2, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function BulgeWarpPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [strength, setStrength] = useState([0.5]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processWarp = () => {
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
      const output = new Uint8ClampedArray(data.length);
      const w = canvas.width, h = canvas.height;
      const centerX = w / 2, centerY = h / 2;
      const radius = Math.min(w, h) / 2;
      const bulge = strength[0];

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let dx = x - centerX;
          let dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius) {
            const percent = dist / radius;
            const factor = Math.pow(percent, bulge);
            dx *= factor;
            dy *= factor;
          }

          const sx = Math.floor(centerX + dx);
          const sy = Math.floor(centerY + dy);

          if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
            const outIdx = (y * w + x) * 4;
            const inIdx = (sy * w + sx) * 4;
            output[outIdx] = data[inIdx];
            output[outIdx + 1] = data[inIdx + 1];
            output[outIdx + 2] = data[inIdx + 2];
            output[outIdx + 3] = data[inIdx + 3];
          }
        }
      }

      ctx.putImageData(new ImageData(output, w, h), 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `bulge_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Distorsi lensa telah diterapkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Bulge Warp</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Lens Distortion Engine</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Maximize2 className="w-4 h-4 text-accent" /> Control</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold">Strength: {strength[0]}x</Label>
                  <Slider value={strength} onValueChange={setStrength} min={0.1} max={2.0} step={0.1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processWarp} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Render Warp
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