'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Type, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export default function CanvasTextPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [text, setText] = useState('YOUR CAPTION');
  const [size, setSize] = useState([40]);
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
      
      const fontSize = (size[0] / 1000) * canvas.width;
      ctx.font = `black ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 10;
      ctx.strokeText(text, canvas.width / 2, canvas.height * 0.9);
      ctx.fillText(text, canvas.width / 2, canvas.height * 0.9);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `text_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Teks telah ditambahkan ke gambar." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Canvas Text</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Minimalist Banner Tool</p>
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
                  <Type className="w-4 h-4 text-accent" /> Text Options
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                   <Label className="text-[10px] uppercase font-bold">Caption Content</Label>
                   <Input value={text} onChange={(e) => setText(e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold">Font Size</Label>
                  <Slider value={size} onValueChange={setSize} min={10} max={200} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Banner
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20 relative">
                 <img src={originalImage.url} alt="Preview" className="max-w-full h-auto" />
                 <div className="absolute bottom-[10%] inset-x-0 text-center pointer-events-none px-4">
                    <span 
                      className="font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      style={{ fontSize: `${size[0] / 5}px` }}
                    >
                      {text}
                    </span>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}