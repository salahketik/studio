'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

import { ImageUploader } from '@/features/smart-trim/components/image-uploader';
import { Button } from '@/components/ui/button';
import { Download, Loader2, ImageIcon, UploadCloud, ChevronLeft, Scissors } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { saveAs } from 'file-saver';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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
  
  const trimCanvas = (canvas: HTMLCanvasElement, tolerance: number) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    
    const bgR = data[0], bgG = data[1], bgB = data[2], bgA = data[3];

    let top = height, bottom = -1, left = width, right = -1;

    function isPixelEmpty(i: number) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        const colorThreshold = 30;
        if (a < tolerance) return true;
        if (
            Math.abs(r - bgR) < colorThreshold &&
            Math.abs(g - bgG) < colorThreshold &&
            Math.abs(b - bgB) < colorThreshold &&
            Math.abs(a - bgA) < tolerance
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
                    <h1 className="text-3xl font-bold tracking-tight">Potong Cerdas</h1>
                    <p className="text-muted-foreground text-sm">Hapus area kosong atau transparan secara otomatis.</p>
                  </div>
              </div>
              {originalImage && (
                  <Button variant="outline" onClick={() => { setOriginalImage(null); setTrimmedImage(null); }}>
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
                              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original</h3>
                              <div className="aspect-square relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-4">
                                  <Image src={originalImage.url} alt="Original" width={0} height={0} sizes="100vw" className="w-auto h-auto max-h-full max-w-full object-contain" />
                              </div>
                              <p className="text-center text-xs font-mono">{formatBytes(originalImage.file.size)}</p>
                          </div>
                          <div className="flex-1 p-6 space-y-4">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-accent">Trimmed Result</h3>
                              <div className="aspect-square relative rounded-2xl overflow-hidden border bg-accent/5 flex items-center justify-center p-4">
                                  {isTrimming ? (
                                      <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                  ) : trimmedImage ? (
                                      <Image src={trimmedImage.url} alt="Trimmed" width={0} height={0} sizes="100vw" className="w-auto h-auto max-h-full max-w-full object-contain" />
                                  ) : (
                                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                  )}
                              </div>
                              <p className="text-center text-xs font-mono text-accent">
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
                                  <Label className="text-sm font-bold flex items-center gap-2">
                                      <Scissors className="h-4 w-4 text-accent" /> Toleransi: {tolerance[0]}
                                  </Label>
                                  <Slider
                                      min={0} max={255} step={1}
                                      value={tolerance}
                                      onValueChange={setTolerance}
                                      disabled={isTrimming}
                                  />
                                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                                      Gunakan toleransi lebih tinggi jika latar belakang tidak sepenuhnya bersih. Nilai 0 hanya memotong piksel yang identik.
                                  </p>
                              </div>
                              <Button 
                                onClick={handleDownload} 
                                disabled={!trimmedImage || isTrimming} 
                                className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-lg text-lg font-bold"
                              >
                                  <Download className="mr-2 h-5 w-5" /> Unduh Hasil
                              </Button>
                          </CardContent>
                      </Card>
                      
                      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Pro Tip</h4>
                          <p className="text-[11px] text-muted-foreground">
                              Alat ini sangat berguna untuk memotong asset game atau logo yang memiliki margin transparan terlalu besar.
                          </p>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
