'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Monitor, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function ScanLinePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [gap, setGap] = useState([2]);
  const [opacity, setOpacity] = useState([30]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processLines = () => {
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

      const step = gap[0] || 2;
      ctx.fillStyle = `rgba(0,0,0,${opacity[0] / 100})`;
      for (let y = 0; y < canvas.height; y += step) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `crt_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Efek Scan Line retro telah diterapkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Scan Line FX</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Retro CRT Monitor Filter</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Monitor className="w-4 h-4 text-accent" /> Control</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold">Line Gap: {gap[0]}px</Label>
                  <Slider value={gap} onValueChange={setGap} min={2} max={10} step={1} />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold">Intensity: {opacity[0]}%</Label>
                  <Slider value={opacity} onValueChange={setOpacity} min={10} max={100} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processLines} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Render CRT
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 flex items-center justify-center p-8 bg-muted/10 rounded-[3rem] relative overflow-hidden">
             <img src={originalImage.url} alt="Preview" className="max-w-full h-auto rounded-lg shadow-2xl" />
             <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
          </div>
        </div>
      )}
    </div>
  );
}