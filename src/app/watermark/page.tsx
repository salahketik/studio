'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, 
  Stamp, 
  Download, 
  RefreshCcw, 
  UploadCloud, 
  Type, 
  Image as ImageIcon,
  Loader2,
  SlidersHorizontal,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function WatermarkPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string, width: number, height: number} | null>(null);
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkText, setWatermarkText] = useState('© VISUAL SUITE');
  const [watermarkImg, setWatermarkImg] = useState<{url: string, width: number, height: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Settings
  const [opacity, setOpacity] = useState([50]);
  const [scale, setScale] = useState([20]);
  const [position, setPosition] = useState<'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-right');

  const handleMainUpload = (files: File[]) => {
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

  const handleWatermarkImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setWatermarkImg({ url, width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const applyWatermark = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mainImg = new Image();
    mainImg.src = originalImage.url;
    mainImg.onload = () => {
      ctx.drawImage(mainImg, 0, 0);
      ctx.globalAlpha = opacity[0] / 100;

      if (watermarkType === 'text') {
        const fontSize = (canvas.width * (scale[0] / 100)) / 2;
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 15;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        const offset = fontSize;

        if (position === 'top-left') { x = offset; y = offset; ctx.textAlign = 'left'; }
        if (position === 'top-right') { x = canvas.width - offset; y = offset; ctx.textAlign = 'right'; }
        if (position === 'bottom-left') { x = offset; y = canvas.height - offset; ctx.textAlign = 'left'; }
        if (position === 'bottom-right') { x = canvas.width - offset; y = canvas.height - offset; ctx.textAlign = 'right'; }

        ctx.strokeText(watermarkText, x, y);
        ctx.fillText(watermarkText, x, y);
      } else if (watermarkImg) {
        const wImg = new Image();
        wImg.src = watermarkImg.url;
        wImg.onload = () => {
          const wScale = (canvas.width * (scale[0] / 100)) / wImg.width;
          const drawW = wImg.width * wScale;
          const drawH = wImg.height * wScale;
          
          let x = (canvas.width - drawW) / 2;
          let y = (canvas.height - drawH) / 2;
          const offset = 40;

          if (position === 'top-left') { x = offset; y = offset; }
          if (position === 'top-right') { x = canvas.width - drawW - offset; y = offset; }
          if (position === 'bottom-left') { x = offset; y = canvas.height - drawH - offset; }
          if (position === 'bottom-right') { x = canvas.width - drawW - offset; y = canvas.height - drawH - offset; }

          ctx.drawImage(wImg, x, y, drawW, drawH);
          finish();
        };
        return;
      }

      finish();
    };

    const finish = () => {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `watermarked_${originalImage.file.name}`);
          toast({ title: "Berhasil!", description: "Gambar dengan watermark telah diunduh." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Watermark Pro</h1>
            <p className="text-muted-foreground">Lindungi aset visual Anda dengan watermark logo atau teks profesional.</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleMainUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Stamp className="w-4 h-4 text-accent" /> Jenis Watermark
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as any)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="text" className="gap-2"><Type className="w-4 h-4" /> Teks</TabsTrigger>
                    <TabsTrigger value="image" className="gap-2"><ImageIcon className="w-4 h-4" /> Logo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Isi Teks</Label>
                      <Input value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="cth: © Nama Anda" className="rounded-xl" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="image" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Unggah Logo PNG</Label>
                      <div 
                        className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-accent/5 transition-all"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <input id="logo-upload" type="file" accept="image/png" className="hidden" onChange={handleWatermarkImgUpload} />
                        {watermarkImg ? (
                           <p className="text-xs font-bold text-accent truncate">Logo Terpilih ✓</p>
                        ) : (
                           <div className="flex flex-col items-center gap-2">
                             <UploadCloud className="w-6 h-6 text-muted-foreground" />
                             <p className="text-[10px] text-muted-foreground uppercase">Klik untuk Pilih Logo</p>
                           </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-6 pt-4 border-t">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Transparansi: {opacity[0]}%</Label>
                    </div>
                    <Slider value={opacity} onValueChange={setOpacity} min={5} max={100} step={1} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Skala: {scale[0]}%</Label>
                    </div>
                    <Slider value={scale} onValueChange={setScale} min={5} max={100} step={1} />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Posisi</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'top-left', icon: Layout, label: 'TL' },
                        { id: 'center', icon: Layout, label: 'Mid' },
                        { id: 'top-right', icon: Layout, label: 'TR' },
                        { id: 'bottom-left', icon: Layout, label: 'BL' },
                        { id: 'bottom-right', icon: Layout, label: 'BR' },
                      ].map((pos) => (
                        <Button 
                          key={pos.id} 
                          variant={position === pos.id ? 'secondary' : 'outline'}
                          size="sm"
                          className={cn("h-10 rounded-xl text-[10px]", position === pos.id && "bg-accent/10 text-accent border-accent")}
                          onClick={() => setPosition(pos.id as any)}
                        >
                          {pos.id.replace('-', ' ').toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl font-bold shadow-lg" onClick={applyWatermark} disabled={isProcessing || (watermarkType === 'image' && !watermarkImg)}>
                  {isProcessing ? <><Loader2 className="mr-2 animate-spin" /> Rendering...</> : <><Download className="mr-2" /> Simpan Hasil</>}
                </Button>

                <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl overflow-hidden glass-panel">
               <CardHeader className="bg-muted/30 border-b">
                 <CardTitle className="text-xs font-bold uppercase tracking-widest text-accent">Live Preview</CardTitle>
               </CardHeader>
               <CardContent className="p-8 flex items-center justify-center bg-muted/20 min-h-[400px]">
                 <div className="relative group max-w-full shadow-2xl border-4 border-white">
                    <img src={originalImage.url} alt="Main" className="max-w-full h-auto rounded-sm" />
                    
                    {/* Watermark Overlay Emulator */}
                    <div 
                      className={cn(
                        "absolute pointer-events-none transition-all duration-200 flex",
                        position === 'center' && "inset-0 items-center justify-center",
                        position === 'top-left' && "top-4 left-4",
                        position === 'top-right' && "top-4 right-4",
                        position === 'bottom-left' && "bottom-4 left-4",
                        position === 'bottom-right' && "bottom-4 right-4"
                      )}
                      style={{ opacity: opacity[0] / 100 }}
                    >
                      {watermarkType === 'text' ? (
                        <span 
                          className="font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                          style={{ fontSize: `${scale[0] / 2}vw` }}
                        >
                          {watermarkText}
                        </span>
                      ) : watermarkImg && (
                        <img 
                          src={watermarkImg.url} 
                          alt="Watermark" 
                          style={{ width: `${scale[0]}%` }}
                        />
                      )}
                    </div>
                 </div>
               </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
