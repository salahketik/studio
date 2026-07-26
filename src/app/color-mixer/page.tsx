'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Palette, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function ColorMixerPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [r, setR] = useState([100]);
  const [g, setG] = useState([100]);
  const [b, setB] = useState([100]);
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

      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * (r[0] / 100);
        data[i+1] = data[i+1] * (g[0] / 100);
        data[i+2] = data[i+2] * (b[0] / 100);
      }
      
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `mixed_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Warna telah dicampur." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Color Mixer</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">RGB Channel Lab</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Palette className="w-4 h-4 text-accent" /> Mix Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-red-600">Red: {r[0]}%</Label>
                  <Slider value={r} onValueChange={setR} min={0} max={200} step={1} />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-green-600">Green: {g[0]}%</Label>
                  <Slider value={g} onValueChange={setG} min={0} max={200} step={1} />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-blue-600">Blue: {b[0]}%</Label>
                  <Slider value={b} onValueChange={setB} min={0} max={200} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Mix
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20">
                 <img 
                  src={originalImage.url} 
                  alt="Preview" 
                  className="max-w-full h-auto"
                  style={{ 
                    filter: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${r[0]/100} 0 0 0 0 0 ${g[0]/100} 0 0 0 0 0 ${b[0]/100} 0 0 0 0 0 1 0"/></filter></svg>#f')` 
                  }} 
                 />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}