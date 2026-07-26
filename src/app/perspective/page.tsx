'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Share2, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function PerspectivePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [rotateX, setRotateX] = useState([0]);
  const [rotateY, setRotateY] = useState([0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const exportResult = async () => {
    if (!originalImage) return;
    setIsProcessing(true);
    
    // Using simple HTML-to-image concept since perspective warp in raw canvas
    // requires complex 3D math. For the MVP, we use CSS preview & DOM capture.
    const { toPng } = await import('html-to-image');
    const el = document.getElementById('perspective-preview');
    if (el) {
      toPng(el)
        .then(dataUrl => {
          saveAs(dataUrl, `perspective_${Date.now()}.png`);
          toast({ title: "Selesai", description: "Gambar perspektif telah diunduh." });
          setIsProcessing(false);
        });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Perspective Warp</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">3D Skew & Tilt Engine</p>
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
                  <Share2 className="w-4 h-4 text-accent" /> Transform Rack
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Rotate Y (Horiz): {rotateY[0]}°</Label>
                  <Slider value={rotateY} onValueChange={setRotateY} min={-45} max={45} step={1} />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Rotate X (Vert): {rotateX[0]}°</Label>
                  <Slider value={rotateX} onValueChange={setRotateX} min={-45} max={45} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={exportResult} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export PNG
                </Button>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> New Image
            </Button>
          </div>

          <div className="lg:col-span-8 flex items-center justify-center p-12 bg-muted/10 rounded-[3rem] overflow-hidden">
             <div 
              id="perspective-preview"
              className="relative transition-transform duration-300 shadow-2xl"
              style={{ 
                perspective: '1000px',
                transform: `rotateY(${rotateY[0]}deg) rotateX(${rotateX[0]}deg)`,
                transformStyle: 'preserve-3d'
              }}
             >
                <img src={originalImage.url} alt="Perspective" className="max-w-full h-auto rounded-lg" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
