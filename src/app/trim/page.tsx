'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Download, Loader2, ImageIcon, UploadCloud, ChevronLeft, Scissors, Info, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { saveAs } from 'file-saver';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ImageUploader } from '@/features/smart-trim/components/image-uploader';
import Link from 'next/link';

export default function TrimPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [trimmedImage, setTrimmedImage] = useState<{url: string, blob: Blob} | null>(null);
  const [isTrimming, setIsTrimming] = useState(false);
  const [tolerance, setTolerance] = useState([20]);

  const handleImageUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setTrimmedImage(null);
    }
  }, []);
  
  const trimCanvas = (canvas: HTMLCanvasElement, toleranceValue: number) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    
    const bgR = data[0], bgG = data[1], bgB = data[2], bgA = data[3];

    let top = height, bottom = -1, left = width, right = -1;

    function isPixelEmpty(i: number) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a < toleranceValue) return true;
        const colorThreshold = 30;
        if (
            Math.abs(r - bgR) < colorThreshold &&
            Math.abs(g - bgG) < colorThreshold &&
            Math.abs(b - bgB) < colorThreshold &&
            Math.abs(a - bgA) < toleranceValue
        ) return true;
        return false;
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!isPixelEmpty((y * width + x) * 4)) { top = y; break; }
        }
        if (top !== height) break;
    }
    for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            if (!isPixelEmpty((y * width + x) * 4)) { bottom = y; break; }
        }
        if (bottom !== -1) break;
    }
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (!isPixelEmpty((y * width + x) * 4)) { left = x; break; }
        }
        if (left !== width) break;
    }
    for (let x = width - 1; x >= 0; x--) {
        for (let y = 0; y < height; y++) {
            if (!isPixelEmpty((y * width + x) * 4)) { right = x; break; }
        }
        if (right !== -1) break;
    }

    if (top >= bottom || left >= right) return null;
    
    const trimWidth = right - left + 1;
    const trimHeight = bottom - top + 1;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimWidth;
    trimmedCanvas.height = trimHeight;
    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (!trimmedCtx) return null;
    
    trimmedCtx.drawImage(canvas, left, top, trimWidth, trimHeight, 0, 0, trimWidth, trimHeight);
    return trimmedCanvas;
  }

  const handleTrim = useCallback(async () => {
    if (!originalImage) return;
    setIsTrimming(true);
    setTrimmedImage(null);

    const img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = originalImage.url;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsTrimming(false);
            return;
        }
        ctx.drawImage(img, 0, 0);
        const trimmedCanvas = trimCanvas(canvas, tolerance[0]);
        if (trimmedCanvas) {
            trimmedCanvas.toBlob(blob => {
                if (blob) setTrimmedImage({ url: URL.createObjectURL(blob), blob });
                setIsTrimming(false);
            }, originalImage.file.type);
        } else {
            setTrimmedImage({ url: originalImage.url, blob: originalImage.file });
            setIsTrimming(false);
        }
    }
  }, [originalImage, tolerance]);

  useEffect(() => {
    if (originalImage) handleTrim();
  }, [originalImage, tolerance, handleTrim]);

  const handleDownload = () => {
    if (!trimmedImage || !originalImage) return;
    const extension = originalImage.file.name.split('.').pop();
    const newName = originalImage.file.name.replace(/\.[^/.]+$/, `_trimmed.${extension}`);
    saveAs(trimmedImage.blob, newName);
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i];
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 h-full bg-background/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" asChild className="rounded-full">
                      <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight uppercase">Potong Cerdas</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold opacity-60">Auto Margin Scraper</p>
                  </div>
              </div>
              {originalImage && (
                  <Button variant="outline" className="rounded-xl" onClick={() => { setOriginalImage(null); setTrimmedImage(null); }}>
                      <UploadCloud className="mr-2 h-4 w-4" /> Ganti Gambar
                  </Button>
              )}
          </div>
          
          {!originalImage && <ImageUploader onUpload={handleImageUpload} />}

          {originalImage && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
                  <Card className="lg:col-span-3 overflow-hidden rounded-3xl border-none shadow-2xl glass-panel">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-b">
                          <div className="flex-1 p-6 space-y-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Asset</h3>
                              <div className="aspect-square relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-4">
                                  <Image src={originalImage.url} alt="Original" width={1000} height={1000} className="w-auto h-auto max-h-full max-w-full object-contain" />
                              </div>
                              <p className="text-center text-[10px] font-mono opacity-50">{formatBytes(originalImage.file.size)}</p>
                          </div>
                          <div className="flex-1 p-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Trimmed Ready</h3>
                                {trimmedImage && (
                                   <Badge variant="secondary" className="bg-accent/10 text-accent text-[8px] font-black uppercase">Alpha Processed</Badge>
                                )}
                              </div>
                              <div className="aspect-square relative rounded-2xl overflow-hidden border bg-accent/5 flex items-center justify-center p-4">
                                  {isTrimming ? (
                                      <div className="flex flex-col items-center gap-3">
                                          <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                          <p className="text-[10px] font-black uppercase text-accent tracking-widest">Scanning Pixels...</p>
                                      </div>
                                  ) : trimmedImage ? (
                                      <Image src={trimmedImage.url} alt="Trimmed" width={1000} height={1000} className="w-auto h-auto max-h-full max-w-full object-contain shadow-2xl" />
                                  ) : (
                                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                  )}
                              </div>
                              <p className="text-center text-[10px] font-mono text-accent font-black">
                                  {trimmedImage ? formatBytes(trimmedImage.blob.size) : 'Processing...'}
                              </p>
                          </div>
                        </div>
                      </CardContent>
                  </Card>

                  <div className="space-y-6">
                      <Card className="rounded-3xl border-none shadow-xl">
                          <CardContent className="p-6 space-y-6">
                              <div className="space-y-4">
                                  <Label className="text-[10px] font-black uppercase flex items-center gap-2 text-muted-foreground">
                                      <Scissors className="h-3.5 w-3.5 text-accent" /> Tolerance: {tolerance[0]}
                                  </Label>
                                  <Slider
                                      min={0} max={255} step={1}
                                      value={tolerance}
                                      onValueChange={setTolerance}
                                      disabled={isTrimming}
                                  />
                                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl flex gap-3">
                                      <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                      <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                          Gunakan toleransi lebih tinggi jika latar belakang tidak sepenuhnya bersih.
                                      </p>
                                  </div>
                              </div>
                              <Button 
                                onClick={handleDownload} 
                                disabled={!trimmedImage || isTrimming} 
                                className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-lg text-xs font-black uppercase tracking-widest"
                              >
                                  <Download className="mr-2 h-4 w-4" /> Download PNG
                              </Button>
                          </CardContent>
                      </Card>
                      
                      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 space-y-3">
                          <div className="flex items-center gap-2">
                             <Sparkles className="h-3.5 w-3.5 text-primary" />
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Technical Tip</h4>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                              Alat ini bekerja paling baik untuk **Logo transparan**, **Aset Game**, dan **Ikon UI** yang memiliki margin kosong terlalu besar.
                          </p>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
