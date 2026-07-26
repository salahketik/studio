
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Box, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function PolaroidPage() {
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
      const border = 40;
      const bottomBorder = 120;
      const canvas = document.createElement('canvas');
      canvas.width = img.width + (border * 2);
      canvas.height = img.height + border + bottomBorder;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Polaroid frame
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Shadow simulation
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.drawImage(img, border, border);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `polaroid_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Bingkai Polaroid telah ditambahkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Polaroid Maker</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Instant Retro Frame Tool</p>
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
                  <Box className="w-4 h-4 text-accent" /> Instant Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Polaroid
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 flex items-center justify-center p-12 bg-muted/10 rounded-[3rem]">
             <div className="bg-white p-6 pb-20 shadow-2xl transition-transform hover:rotate-1 duration-500">
                <img src={originalImage.url} alt="Preview" className="max-w-[400px] h-auto shadow-inner" style={{ filter: 'sepia(0.2) contrast(1.1)' }} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
