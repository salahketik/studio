'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, SlidersHorizontal, Download, RefreshCcw, 
  Loader2, Sparkles, RotateCcw, Palette, Sun, Contrast, Wind, Info
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
  hueRotate: number;
}

const defaultSettings: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  hueRotate: 0,
};

export default function FiltersPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string, width: number, height: number} | null>(null);
  const [settings, setSettings] = useState<FilterSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalImage?.url) {
        URL.revokeObjectURL(originalImage.url);
      }
    };
  }, [originalImage]);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      // Clean up previous image if exists
      if (originalImage?.url) URL.revokeObjectURL(originalImage.url);
      
      const file = files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setOriginalImage({ file, url, width: img.width, height: img.height });
        setSettings(defaultSettings);
      };
      img.src = url;
    }
  };

  const getFilterString = (s: FilterSettings) => {
    return `brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturation}%) grayscale(${s.grayscale}%) sepia(${s.sepia}%) blur(${s.blur}px) hue-rotate(${s.hueRotate}deg)`;
  };

  const handleDownload = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = getFilterString(settings);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `filter_${originalImage.file.name}`);
          toast({ title: "Berhasil!", description: "Gambar telah diunduh dengan filter baru." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  const updateSetting = (key: keyof FilterSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-tight">Filter Studio</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Local Post-Processing Module</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-accent" /> Penyesuaian</div>
                  <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase" onClick={() => setSettings(defaultSettings)}>
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { label: 'Brightness', key: 'brightness', icon: Sun, min: 0, max: 200, unit: '%' },
                  { label: 'Contrast', key: 'contrast', icon: Contrast, min: 0, max: 200, unit: '%' },
                  { label: 'Saturation', key: 'saturation', icon: Palette, min: 0, max: 200, unit: '%' },
                  { label: 'Hue Rotate', key: 'hueRotate', icon: Sparkles, min: 0, max: 360, unit: '°' },
                  { label: 'Blur', key: 'blur', icon: Wind, min: 0, max: 20, unit: 'px' },
                ].map((item) => (
                  <div key={item.key} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5" /> {item.label}
                      </Label>
                      <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">
                        {settings[item.key as keyof FilterSettings]}{item.unit}
                      </span>
                    </div>
                    <Slider 
                      min={item.min} max={item.max} step={1} 
                      value={[settings[item.key as keyof FilterSettings]]} 
                      onValueChange={(v) => updateSetting(item.key as keyof FilterSettings, v[0])}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-accent/5 border border-accent/20 p-5 rounded-3xl flex gap-4 items-start">
               <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                 Pemrosesan filter dilakukan secara instan di GPU browser menggunakan akselerasi perangkat keras. Tidak ada latensi server.
               </p>
            </div>

            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
              <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
            </Button>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden h-full flex flex-col">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Live Studio Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow flex flex-col">
                <div className="flex-grow relative bg-muted/30 flex items-center justify-center p-8 min-h-[400px]">
                   <img 
                      src={originalImage.url} 
                      alt="Preview" 
                      className="max-w-full max-h-[500px] object-contain shadow-2xl"
                      style={{ filter: getFilterString(settings) }}
                    />
                </div>
                <div className="p-6 bg-muted/10 border-t flex items-center justify-between gap-4">
                   <Badge variant="outline" className="text-[9px] font-mono uppercase">
                     Ready: {originalImage.width}x{originalImage.height}
                   </Badge>
                   <Button 
                    className="bg-accent hover:bg-accent/90 rounded-xl px-8 h-12 shadow-lg font-black text-xs uppercase tracking-widest" 
                    onClick={handleDownload}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rendering...</> : <><Download className="w-4 h-4 mr-2" /> Simpan Hasil</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
