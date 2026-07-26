'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Split, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function RgbSplitterPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processSplit = (type: 'r' | 'g' | 'b') => {
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
        if (type === 'r') { data[i+1] = 0; data[i+2] = 0; }
        if (type === 'g') { data[i] = 0; data[i+2] = 0; }
        if (type === 'b') { data[i] = 0; data[i+1] = 0; }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `channel_${type.toUpperCase()}_${originalImage.file.name}`);
          toast({ title: "Kanal Diekspor", description: `Saluran warna ${type.toUpperCase()} telah dipisahkan.` });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">RGB Splitter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Primary Channel Separation</p>
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
                  <Split className="w-4 h-4 text-accent" /> Export Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button className="w-full justify-between bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => processSplit('r')} disabled={isProcessing}>
                  Red Channel <Download className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-green-600 hover:bg-green-700 text-white font-bold" onClick={() => processSplit('g')} disabled={isProcessing}>
                  Green Channel <Download className="w-4 h-4" />
                </Button>
                <Button className="w-full justify-between bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={() => processSplit('b')} disabled={isProcessing}>
                  Blue Channel <Download className="w-4 h-4" />
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