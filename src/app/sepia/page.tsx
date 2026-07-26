
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Coins, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function SepiaProPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processSepia = () => {
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
        const r = data[i], g = data[i+1], b = data[i+2];
        data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
        data[i+1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
        data[i+2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `sepia_${originalImage.file.name}`);
          toast({ title: "Berhasil", description: "Filter Sepia Pro telah diterapkan." });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Sepia Pro</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Advanced Vintage Grading</p>
        </div>
      </div>
      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] border-none shadow-xl bg-[#11121d]"><CardHeader className="border-b border-white/5 py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Coins className="w-4 h-4 text-yellow-600" /> Controls</CardTitle></CardHeader>
              <CardContent className="p-6">
                <Button className="w-full h-12 bg-yellow-600 hover:bg-yellow-700 rounded-xl font-bold" onClick={processSepia} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Sepia
                </Button>
                <Button variant="ghost" className="w-full text-xs mt-4" onClick={() => setOriginalImage(null)}><RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar</Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8 flex items-center justify-center bg-muted/10 rounded-[3rem] p-8">
            <img src={originalImage.url} alt="Preview" className="max-w-full h-auto rounded-lg shadow-2xl" style={{ filter: 'sepia(1)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
