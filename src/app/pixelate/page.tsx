'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Component, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function PixelatePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [pixelSize, setPixelSize] = useState([10]);
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

      const size = (pixelSize[0] || 1) / 100;
      const w = canvas.width * size;
      const h = canvas.height * size;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `pixel_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Efek pixelate telah diterapkan." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  // Preview Scale Logic: 
  // We use a small image size with image-rendering: pixelated for live preview
  const previewScale = (pixelSize[0] || 1) / 100;

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Pixelate Art</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Retro 8-Bit Generator</p>
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
                  <Component className="w-4 h-4 text-accent" /> Block Size
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pixel Density: {pixelSize[0]}%</Label>
                  <Slider value={pixelSize} onValueChange={setPixelSize} min={1} max={50} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Pixel Art
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
                 <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={originalImage.url} 
                      alt="Preview" 
                      className="max-w-full h-auto transition-all"
                      style={{ 
                        imageRendering: 'pixelated',
                        width: '100%',
                        transform: `scale(${1})`,
                        filter: `blur(${0}px)` // Reset filter
                      }} 
                    />
                    {/* Live Preview Overlay using CSS scaling to simulate pixelation */}
                    <div 
                      className="absolute inset-0 bg-muted/10 flex items-center justify-center"
                      style={{
                        backdropFilter: `blur(${1 / previewScale}px)`,
                        WebkitBackdropFilter: `blur(${1 / previewScale}px)`,
                        opacity: 0.1
                      }}
                    />
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}