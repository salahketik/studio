'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Paintbrush2, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function PosterizePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [levels, setLevels] = useState([5]);
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
      const step = Math.floor(255 / (levels[0] - 1));

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(data[i] / step) * step;
        data[i+1] = Math.floor(data[i+1] / step) * step;
        data[i+2] = Math.floor(data[i+2] / step) * step;
      }
      
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `poster_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Efek posterize telah diterapkan." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  // Pre-calculate SVG filter values for live preview
  const l = levels[0];
  const stepSize = 1 / (l - 1);
  const tableValues = Array.from({ length: l }, (_, i) => i * stepSize).join(' ');

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Posterize Filter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pop Art Color Reduction</p>
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
                  <Paintbrush2 className="w-4 h-4 text-accent" /> Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Color Tones: {levels[0]}</Label>
                  <Slider value={levels} onValueChange={setLevels} min={2} max={20} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Art
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20 relative">
                 <svg className="absolute w-0 h-0 invisible">
                    <filter id="live-posterize">
                      <feComponentTransfer>
                        <feFuncR type="discrete" tableValues={tableValues} />
                        <feFuncG type="discrete" tableValues={tableValues} />
                        <feFuncB type="discrete" tableValues={tableValues} />
                      </feComponentTransfer>
                    </filter>
                 </svg>
                 <img 
                    src={originalImage.url} 
                    alt="Preview" 
                    className="max-w-full h-auto" 
                    style={{ filter: 'url(#live-posterize)' }}
                 />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}