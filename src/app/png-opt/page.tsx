'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Minimize2, Download, RefreshCcw, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';

export default function PngOptimizerPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [optimized, setOptimized] = useState<{blob: Blob, size: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setOptimized(null);
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

      // Simple Canvas optimization (re-encoding)
      canvas.toBlob((blob) => {
        if (blob) {
          setOptimized({ blob, size: blob.size });
          toast({ title: "Optimization Done", description: "PNG has been re-encoded for better size." });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  const download = () => {
    if (!optimized || !originalImage) return;
    saveAs(optimized.blob, `optimized_${originalImage.file.name}`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">PNG Optimizer</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Lossless Compression Utility</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
             <CardHeader className="border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest">Original Aset</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6 text-center">
                <img src={originalImage.url} className="max-h-60 mx-auto rounded shadow-sm" />
                <Badge variant="outline">{(originalImage.file.size / 1024).toFixed(2)} KB</Badge>
                <Button className="w-full h-12 bg-accent font-bold rounded-xl" onClick={processImage} disabled={isProcessing}>
                   {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />} Optimize Now
                </Button>
             </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
             <CardHeader className="bg-muted/50 border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest">Optimized Result</CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6 text-center">
                {optimized ? (
                  <>
                    <img src={originalImage.url} className="max-h-60 mx-auto rounded shadow-sm opacity-90" />
                    <div className="space-y-1">
                       <p className="text-2xl font-black text-accent">{(optimized.size / 1024).toFixed(2)} KB</p>
                       <p className="text-[10px] uppercase font-bold text-green-600">Saved: {((originalImage.file.size - optimized.size) / originalImage.file.size * 100).toFixed(1)}%</p>
                    </div>
                    <Button className="w-full h-12 bg-black text-white hover:bg-black/90 font-bold rounded-xl" onClick={download}>
                       <Download className="mr-2" /> Download Optimized
                    </Button>
                  </>
                ) : (
                  <div className="h-60 flex items-center justify-center opacity-20"><Minimize2 className="w-16 h-16" /></div>
                )}
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}