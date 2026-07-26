
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Camera, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function LomoPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
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

      // Lomo Filter: High Saturation, High Contrast, Vignette
      ctx.filter = 'saturate(1.8) contrast(1.4) brightness(1.1)';
      ctx.drawImage(img, 0, 0);

      const vGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.sqrt(Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2))
      );
      vGradient.addColorStop(0, 'rgba(0,0,0,0)');
      vGradient.addColorStop(0.6, 'rgba(0,0,0,0)');
      vGradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      
      ctx.fillStyle = vGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `lomo_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Filter Lomo telah diterapkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Lomo Camera</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Vibrant Vintage Aesthetics</p>
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
                  <Camera className="w-4 h-4 text-accent" /> Action
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Lomo
                </Button>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> New Image
            </Button>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20 relative">
                 <img 
                  src={originalImage.url} 
                  alt="Preview" 
                  className="max-w-full h-auto"
                  style={{ filter: 'saturate(1.8) contrast(1.4) brightness(1.1)' }}
                 />
                 <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
