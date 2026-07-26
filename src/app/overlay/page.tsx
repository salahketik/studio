'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Layers, Download, RefreshCcw, Loader2, UploadCloud, Layers2 } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function OverlayPage() {
  const { toast } = useToast();
  const [baseImg, setBaseImg] = useState<{url: string, file: File} | null>(null);
  const [overlayImg, setOverlayImg] = useState<{url: string} | null>(null);
  const [opacity, setOpacity] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBaseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBaseImg({ file, url: URL.createObjectURL(file) });
  };

  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setOverlayImg({ url: URL.createObjectURL(file) });
  };

  const processImage = () => {
    if (!baseImg || !overlayImg) return;
    setIsProcessing(true);

    const bImg = new Image();
    bImg.src = baseImg.url;
    bImg.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = bImg.width;
      canvas.height = bImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(bImg, 0, 0);
      
      const oImg = new Image();
      oImg.src = overlayImg.url;
      oImg.onload = () => {
        ctx.globalAlpha = opacity[0] / 100;
        ctx.drawImage(oImg, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `overlay_${baseImg.file.name}`);
            toast({ title: "Selesai", description: "Gambar telah digabungkan." });
          }
          setIsProcessing(false);
        }, baseImg.file.type);
      };
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Image Overlay</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Stitch & Blend Layers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Layers2 className="w-4 h-4 text-accent" /> Layer Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground">1. Base Image</Label>
                   <Button variant="outline" className="w-full h-14 border-dashed rounded-xl" onClick={() => document.getElementById('base-up')?.click()}>
                     {baseImg ? "Change Base" : "Upload Base"}
                   </Button>
                   <input id="base-up" type="file" className="hidden" accept="image/*" onChange={handleBaseUpload} />
                </div>
                <div className="space-y-4">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground">2. Overlay Image</Label>
                   <Button variant="outline" className="w-full h-14 border-dashed rounded-xl" onClick={() => document.getElementById('over-up')?.click()}>
                     {overlayImg ? "Change Overlay" : "Upload Overlay"}
                   </Button>
                   <input id="over-up" type="file" className="hidden" accept="image/*" onChange={handleOverlayUpload} />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-[10px] uppercase font-bold">Blend Opacity: {opacity[0]}%</Label>
                  <Slider value={opacity} onValueChange={setOpacity} min={0} max={100} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing || !baseImg || !overlayImg}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Merge & Save
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden min-h-[500px] flex items-center justify-center">
              {!baseImg ? (
                <div className="text-center opacity-20"><UploadCloud className="w-16 h-16 mx-auto mb-2" /><p className="font-black tracking-widest uppercase">Awaiting Assets</p></div>
              ) : (
                <div className="relative p-8 max-w-full">
                  <img src={baseImg.url} alt="Base" className="max-w-full h-auto" />
                  {overlayImg && (
                    <img 
                      src={overlayImg.url} 
                      alt="Overlay" 
                      className="absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] object-cover" 
                      style={{ opacity: opacity[0]/100 }} 
                    />
                  )}
                </div>
              )}
            </Card>
          </div>
      </div>
    </div>
  );
}
