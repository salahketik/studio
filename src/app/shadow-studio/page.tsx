'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, 
  Layers, 
  Download, 
  RefreshCcw, 
  Loader2,
  Settings2,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function ShadowStudioPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string, width: number, height: number} | null>(null);
  const [blur, setBlur] = useState([20]);
  const [spread, setSpread] = useState([0]);
  const [opacity, setOpacity] = useState([40]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setOriginalImage({ file, url, width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const handleDownload = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      const padding = blur[0] * 2;
      const canvas = document.createElement('canvas');
      canvas.width = originalImage.width + (padding * 2);
      canvas.height = originalImage.height + (padding * 2);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.shadowBlur = blur[0];
      ctx.shadowColor = `rgba(0,0,0,${opacity[0] / 100})`;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = blur[0] / 2;
      
      ctx.drawImage(img, padding, padding);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `shadow_${originalImage.file.name}`);
          toast({ title: "Berhasil!", description: "Gambar dengan bayangan telah diunduh." });
        }
        setIsProcessing(false);
      }, "image/png");
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Shadow Studio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Add Depth to Transparent Assets</p>
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
                  <Settings2 className="w-4 h-4 text-accent" /> Shadow Params
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Blur: {blur[0]}px</Label>
                  </div>
                  <Slider value={blur} onValueChange={setBlur} min={0} max={100} step={1} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Opacity: {opacity[0]}%</Label>
                  </div>
                  <Slider value={opacity} onValueChange={setOpacity} min={0} max={100} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={handleDownload} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Simpan Hasil
                </Button>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
            </Button>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-12 flex items-center justify-center min-h-[400px] bg-muted/20">
                <div 
                  className="max-w-full transition-all duration-200"
                  style={{ filter: `drop-shadow(0 ${blur[0]/2}px ${blur[0]}px rgba(0,0,0,${opacity[0]/100}))` }}
                >
                  <img src={originalImage.url} alt="Preview" className="max-w-full h-auto rounded-sm" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}