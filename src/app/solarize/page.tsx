'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Sparkles, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function SolarizePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [threshold, setThreshold] = useState([128]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processSolarize = () => {
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
      const t = threshold[0];

      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] > t ? 255 - data[i] : data[i];
        data[i+1] = data[i+1] > t ? 255 - data[i+1] : data[i+1];
        data[i+2] = data[i+2] > t ? 255 - data[i+2] : data[i+2];
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `solar_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Filter Solarize telah diterapkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Solarize Filter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Artistic Inversion Engine</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> Control</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold">Threshold: {threshold[0]}</Label>
                  <Slider value={threshold} onValueChange={setThreshold} min={0} max={255} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processSolarize} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Render Art
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