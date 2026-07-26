'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Split, Download, RefreshCcw, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ImageStitcherPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<{url: string, file: File}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setImages([...images, ...newImgs]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const processStitch = () => {
    if (images.length < 2) return;
    setIsProcessing(true);

    const loadedImgs: HTMLImageElement[] = [];
    let loadedCount = 0;

    images.forEach((imgObj, idx) => {
      const img = new Image();
      img.src = imgObj.url;
      img.onload = () => {
        loadedImgs[idx] = img;
        loadedCount++;
        if (loadedCount === images.length) finish();
      };
    });

    const finish = () => {
      const maxWidth = Math.max(...loadedImgs.map(i => i.width));
      const totalHeight = loadedImgs.reduce((acc, i) => acc + i.height, 0);

      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let currentY = 0;
      loadedImgs.forEach(img => {
        ctx.drawImage(img, 0, currentY, canvas.width, (img.height / img.width) * canvas.width);
        currentY += (img.height / img.width) * canvas.width;
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `stitched_${Date.now()}.png`);
          toast({ title: "Berhasil!", description: "Gambar telah digabungkan secara vertikal." });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Image Stitcher</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Vertical Content Assembler</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
           <Card className="rounded-3xl border-none shadow-xl">
             <CardHeader className="bg-muted/50 border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Split className="w-4 h-4 text-accent" /> Queue
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <input id="multi-up" type="file" multiple className="hidden" accept="image/*" onChange={handleUpload} />
                <Button variant="outline" className="w-full h-14 border-dashed rounded-xl" onClick={() => document.getElementById('multi-up')?.click()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Images
                </Button>
                
                <div className="space-y-2">
                   {images.map((img, i) => (
                     <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-3">
                           <img src={img.url} className="w-8 h-8 object-cover rounded" />
                           <span className="text-[10px] font-bold truncate max-w-[120px]">{img.file.name}</span>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeImage(i)}>
                           <Trash2 className="h-3 w-3" />
                        </Button>
                     </div>
                   ))}
                </div>

                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processStitch} disabled={isProcessing || images.length < 2}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Stitch & Download
                </Button>
             </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-8">
           <Card className="rounded-3xl border-none shadow-2xl glass-panel p-4 flex flex-col gap-2 bg-muted/10 overflow-y-auto max-h-[700px]">
              {images.length === 0 ? (
                <div className="h-[400px] flex items-center justify-center opacity-20 uppercase font-black tracking-widest">No Images Selected</div>
              ) : (
                images.map((img, i) => (
                  <img key={i} src={img.url} className="w-full h-auto rounded-sm border shadow-sm" />
                ))
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}