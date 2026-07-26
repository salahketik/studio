'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  Pipette, 
  Copy, 
  RefreshCcw, 
  FileImage, 
  Download,
  Info,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';

interface ColorInfo {
  hex: string;
  rgb: string;
  percentage: number;
}

export default function PaletteExtractorPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractPalette = useCallback((imgUrl: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts: Record<string, number> = {};

      // Sample pixels (every 10th pixel for performance)
      for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i];
        const g = imageData[i+1];
        const b = imageData[i+2];
        const a = imageData[i+3];

        if (a < 128) continue; // Skip transparent

        // Round color values to reduce noise (quantization)
        const factor = 16;
        const qr = Math.round(r / factor) * factor;
        const qg = Math.round(g / factor) * factor;
        const qb = Math.round(b / factor) * factor;

        const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([hex, count]) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return {
            hex: hex.toUpperCase(),
            rgb: `rgb(${r}, ${g}, ${b})`,
            percentage: (count / (imageData.length / 40)) * 100
          };
        });

      setPalette(sortedColors);
      setIsProcessing(false);
      toast({ title: "Palet Berhasil Diekstrak", description: "Warna dominan telah diidentifikasi." });
    };
  }, [toast]);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setOriginalImage({ file, url });
      extractPalette(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Tersalin!", description: `${text} telah disalin ke papan klip.` });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Ekstrak Palet Warna</h1>
            <p className="text-muted-foreground">Identifikasi warna dominan dari gambar Anda secara instan.</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl overflow-hidden glass-panel">
              <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-accent" /> Sumber Gambar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center">
                  <img src={originalImage.url} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
              </CardContent>
            </Card>

            <div className="bg-accent/5 border border-accent/20 p-6 rounded-3xl flex gap-4 items-start">
               <div className="p-2 bg-accent/10 rounded-lg"><Info className="w-5 h-5 text-accent" /></div>
               <div className="space-y-1">
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">Informasi Teknik</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Sistem melakukan pemindaian piksel lokal dan menggunakan algoritma kuantisasi warna untuk mengelompokkan warna yang serupa. Proses ini dilakukan 100% di browser Anda tanpa mengirim data ke server.
                  </p>
               </div>
            </div>
            
            <Button variant="ghost" className="w-full text-xs" onClick={() => { setOriginalImage(null); setPalette([]); }}>
              <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
            </Button>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <div className="flex items-center gap-2"><Pipette className="w-4 h-4 text-accent" /> Palet Terdeteksi</div>
                  <Badge variant="secondary" className="text-[9px] uppercase">{palette.length} Warna</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow overflow-y-auto max-h-[600px]">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Menganalisis Piksel...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {palette.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="group flex items-center justify-between p-3 rounded-2xl border bg-card hover:border-accent/40 transition-all cursor-pointer"
                        onClick={() => copyToClipboard(color.hex)}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl shadow-inner border border-white/20" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="space-y-0.5">
                            <p className="font-mono font-bold text-sm">{color.hex}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{color.rgb}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-accent">{color.percentage.toFixed(1)}%</p>
                            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-accent" style={{ width: `${color.percentage}%` }} />
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-accent/10 group-hover:text-accent">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
