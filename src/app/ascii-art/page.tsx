'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Terminal, Copy, RefreshCcw, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function AsciiArtPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [ascii, setAscii] = useState('');
  const [resolution, setRepeat] = useState([100]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      processToAscii(URL.createObjectURL(file), resolution[0]);
    }
  };

  const processToAscii = (url: string, res: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = res;
      const height = (img.height / img.width) * width * 0.55; // Adjust for character aspect ratio
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;
      
      const chars = '@%#*+=-:. ';
      let asciiStr = '';

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const r = imageData[offset];
          const g = imageData[offset + 1];
          const b = imageData[offset + 2];
          const avg = (r + g + b) / 3;
          const charIndex = Math.floor((avg / 255) * (chars.length - 1));
          asciiStr += chars[charIndex];
        }
        asciiStr += '\n';
      }

      setAscii(asciiStr);
      setIsProcessing(false);
    };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ascii);
    toast({ title: "Tersalin!", description: "Seni ASCII telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">ASCII Art Pro</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Image to Character Converter</p>
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
                  <Terminal className="w-4 h-4 text-accent" /> Control Rack
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Density: {resolution[0]} chars</Label>
                  <Slider value={resolution} onValueChange={(v) => { setRepeat(v); processToAscii(originalImage.url, v[0]); }} min={50} max={250} step={10} />
                </div>
                <div className="flex flex-col gap-2">
                   <Button className="w-full bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={copyToClipboard}>
                     <Copy className="mr-2 h-4 w-4" /> Copy Text
                   </Button>
                   <Button variant="outline" className="w-full rounded-xl font-bold" onClick={() => setOriginalImage(null)}>
                     <RefreshCcw className="mr-2 h-4 w-4" /> Change Image
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden bg-black text-green-500 p-4">
               <pre className="text-[6px] sm:text-[8px] leading-[0.8] font-mono overflow-auto max-h-[600px] whitespace-pre">
                 {isProcessing ? "Rendering ASCII..." : ascii}
               </pre>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
