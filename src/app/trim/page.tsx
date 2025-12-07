'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

import { ImageUploader } from '@/features/smart-trim/components/image-uploader';
import { Button } from '@/components/ui/button';
import { Download, Loader2, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { saveAs } from 'file-saver';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';


export default function TrimPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [trimmedImage, setTrimmedImage] = useState<{url: string, blob: Blob} | null>(null);
  const [isTrimming, setIsTrimming] = useState(false);
  const [tolerance, setTolerance] = useState([20]);

  const handleImageUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (files.length > 1) {
        toast({
            title: "Satu gambar dalam satu waktu",
            description: "Fitur Potong Cerdas hanya memproses satu gambar dalam satu waktu. Gambar pertama yang dipilih.",
        })
      }
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setTrimmedImage(null); // Reset trimmed image on new upload
    }
  }, [toast]);
  
  const trimCanvas = (canvas: HTMLCanvasElement, tolerance: number) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    
    // Auto-detect background color from top-left pixel
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];
    const bgA = data[3];

    let top = height, bottom = -1, left = width, right = -1;
    const colorThreshold = 10; // To account for slight color variations

    function isPixelEmpty(i: number) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = data[i+3];

        // Check for transparency
        if (a < tolerance) {
            return true;
        }

        // Check if color is very similar to background color
        const colorDiff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
        if (colorDiff < colorThreshold && a === bgA) {
            return true;
        }

        return false;
    }

    // Find top bound
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!isPixelEmpty((y * width + x) * 4)) {
                top = y;
                break;
            }
        }
        if (top !== height) break;
    }

    // Find bottom bound
    for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            if (!isPixelEmpty((y * width + x) * 4)) {
                bottom = y;
                break;
            }
        }
        if (bottom !== -1) break;
    }

    // Find left bound
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (!isPixelEmpty((y * width + x) * 4)) {
                left = x;
                break;
            }
        }
        if (left !== width) break;
    }

    // Find right bound
    for (let x = width - 1; x >= 0; x--) {
        for (let y = 0; y < height; y++) {
            if (!isPixelEmpty((y * width + x) * 4)) {
                right = x;
                break;
            }
        }
        if (right !== -1) break;
    }

    if (top >= bottom || left >= right) {
        return null; // Image is fully transparent or uniform color
    }
    
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
    img.crossOrigin = "anonymous"; // Important for loading images from object URLs
    img.src = originalImage.url;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            toast({ variant: 'destructive', title: 'Kesalahan', description: 'Tidak dapat membuat konteks kanvas.' });
            setIsTrimming(false);
            return;
        }
        ctx.drawImage(img, 0, 0);

        const trimmedCanvas = trimCanvas(canvas, tolerance[0]);

        if (trimmedCanvas) {
            trimmedCanvas.toBlob(blob => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setTrimmedImage({ url, blob });
                } else {
                    toast({ variant: 'destructive', title: 'Kesalahan', description: 'Gagal membuat blob gambar yang dipotong.' });
                }
                setIsTrimming(false);
            }, originalImage.file.type);
        } else {
            toast({ title: 'Tidak Ada yang Dipotong', description: 'Gambar tampak kosong atau transparan.' });
            setTrimmedImage({ url: originalImage.url, blob: originalImage.file }); // Show original if nothing to trim
            setIsTrimming(false);
        }
    }
    img.onerror = () => {
        toast({ variant: 'destructive', title: 'Kesalahan', description: 'Gagal memuat gambar untuk diproses.' });
        setIsTrimming(false);
    }
  }, [originalImage, tolerance, toast]);

  useEffect(() => {
    if (originalImage) {
        handleTrim();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalImage, tolerance]);


  const handleDownload = () => {
    if (!trimmedImage || !originalImage) return;
    const extension = originalImage.file.name.split('.').pop();
    const newName = originalImage.file.name.replace(/\.[^/.]+$/, `_trimmed.${extension}`);
    saveAs(trimmedImage.blob, newName);
  }

  const originalSize = useMemo(() => {
    if (!originalImage) return 0;
    return originalImage.file.size;
  }, [originalImage]);

  const trimmedSize = useMemo(() => {
    if (!trimmedImage) return 0;
    return trimmedImage.blob.size;
  }, [trimmedImage]);
  
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 h-full">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Potong Cerdas</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Unggah gambar untuk secara otomatis menghapus ruang kosong atau transparan di sekitarnya.
              </p>
          </div>
          
          {!originalImage && <ImageUploader onUpload={handleImageUpload} />}

          {originalImage && (
              <Card>
                  <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="flex flex-col gap-4">
                              <h3 className="font-semibold text-lg">Asli</h3>
                              <div className="relative min-h-48 w-full rounded-md overflow-hidden border flex items-center justify-center">
                                  <Image src={originalImage.url} alt="Original image" width="0" height="0" sizes="100vw" style={{ width: '100%', height: 'auto' }} />
                              </div>
                              <p className="text-sm text-muted-foreground text-center">Ukuran: {formatBytes(originalSize)}</p>
                          </div>
                          <div className="flex flex-col gap-4">
                              <h3 className="font-semibold text-lg">Hasil Potong</h3>
                              <div className="relative min-h-48 w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                                  {isTrimming && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
                                  {!isTrimming && trimmedImage && <Image src={trimmedImage.url} alt="Trimmed image" width="0" height="0" sizes="100vw" style={{ width: '100%', height: 'auto' }} />}
                                  {!isTrimming && !trimmedImage && <ImageIcon className="w-8 h-8 text-muted-foreground" />}
                              </div>
                              <p className="text-sm text-muted-foreground text-center">
                                  {trimmedImage ? `Ukuran: ${formatBytes(trimmedSize)}` : 'Memproses...'}
                              </p>
                          </div>
                      </div>

                      <div className="max-w-sm mx-auto mt-8 space-y-4">
                          <div>
                              <Label htmlFor="tolerance-slider">Toleransi Transparansi: {tolerance[0]}</Label>
                              <Slider
                                  id="tolerance-slider"
                                  min={0}
                                  max={255}
                                  step={1}
                                  value={tolerance}
                                  onValueChange={setTolerance}
                                  className={cn('my-2')}
                                  disabled={isTrimming}
                              />
                              <p className="text-xs text-muted-foreground">Menyesuaikan sensitivitas. Nilai yang lebih rendah akan memotong lebih ketat. Algoritma juga akan memotong warna latar belakang solid (misalnya putih).</p>
                          </div>
                      </div>

                      <div className="flex justify-center gap-4 mt-8">
                          <Button onClick={handleDownload} disabled={!trimmedImage || isTrimming}>
                              <Download className="mr-2 h-4 w-4" />
                              Unduh
                          </Button>
                      </div>
                          <div className="text-center mt-6">
                          <Button variant="link" onClick={() => { setOriginalImage(null); setTrimmedImage(null); }}>
                              Atau unggah gambar lain
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          )}
      </div>
    </div>
  );
}
