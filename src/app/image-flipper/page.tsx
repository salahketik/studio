'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, RotateCcw, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function ImageFlipperPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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

      ctx.translate(flipH ? canvas.width : 0, flipV ? canvas.height : 0);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `flip_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Gambar telah diputar balik." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Image Flipper</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Fast Mirror Utility</p>
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
                  <RotateCcw className="w-4 h-4 text-accent" /> Flip Options
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button 
                  variant={flipH ? 'secondary' : 'outline'} 
                  className="w-full justify-between" 
                  onClick={() => setFlipH(!flipH)}
                >
                  Horizontal Flip <span>{flipH ? 'ON' : 'OFF'}</span>
                </Button>
                <Button 
                  variant={flipV ? 'secondary' : 'outline'} 
                  className="w-full justify-between" 
                  onClick={() => setFlipV(!flipV)}
                >
                  Vertical Flip <span>{flipV ? 'ON' : 'OFF'}</span>
                </Button>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold mt-4" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Save Flipped
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
                  className="max-w-full h-auto transition-all"
                  style={{ transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})` }} 
                 />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
