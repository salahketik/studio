'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Palette, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function CmykSplitterPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const splitChannel = (type: 'c' | 'm' | 'y' | 'k') => {
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
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        let val = 0;
        if (type === 'c') val = c * 255;
        if (type === 'm') val = m * 255;
        if (type === 'y') val = y * 255;
        if (type === 'k') val = k * 255;

        data[i] = data[i+1] = data[i+2] = 255 - val; // Invert to show intensity as grayscale
        data[i+3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `channel_${type.toUpperCase()}_${originalImage.file.name}`);
          toast({ title: "Channel Exported", description: `Kanal ${type.toUpperCase()} telah dipisahkan.` });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">CMYK Splitter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Print Separation Preview</p>
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
                  <Palette className="w-4 h-4 text-accent" /> Export Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button className="w-full justify-between bg-cyan-500 hover:bg-cyan-600 text-white font-bold" onClick={() => splitChannel('c')} disabled={isProcessing}>
                  Cyan Channel <Download className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-magenta-500 hover:bg-magenta-600 bg-pink-500 text-white font-bold" onClick={() => splitChannel('m')} disabled={isProcessing}>
                  Magenta Channel <Download className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-yellow-500 hover:bg-yellow-600 text-black font-bold" onClick={() => splitChannel('y')} disabled={isProcessing}>
                  Yellow Channel <Download className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-black hover:bg-zinc-800 text-white font-bold" onClick={() => splitChannel('k')} disabled={isProcessing}>
                  Key (Black) Channel <Download className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> New Image
            </Button>
          </div>

          <div className="lg:col-span-8 flex items-center justify-center p-8 bg-muted/10 rounded-[3rem]">
             <img src={originalImage.url} alt="Original" className="max-w-full h-auto rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
