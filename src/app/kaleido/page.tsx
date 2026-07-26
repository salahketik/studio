'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Focus, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function KaleidoscopePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [segments, setSegments] = useState([8]);
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
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const segs = segments[0];
      const angle = (Math.PI * 2) / segs;

      ctx.translate(size / 2, size / 2);
      for (let i = 0; i < segs; i++) {
        ctx.rotate(angle);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, size, -angle / 2, angle / 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `kaleido_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Geometri fraktal telah dihasilkan." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Kaleidoscope</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Fractal Geometry Studio</p>
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
                  <Focus className="w-4 h-4 text-accent" /> Segments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Sections: {segments[0]}</Label>
                  <Slider value={segments} onValueChange={setSegments} min={4} max={24} step={2} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Fractal
                </Button>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> New Image
            </Button>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-8 flex items-center justify-center min-h-[400px] bg-muted/20">
                 <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                    <img src={originalImage.url} alt="Preview" className="w-full h-full object-cover animate-spin" style={{ animationDuration: '20s' }} />
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
