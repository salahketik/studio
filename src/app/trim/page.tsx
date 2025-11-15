'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

import { ImageUploader } from '@/components/image-uploader';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Crop, Image as ImageIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
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
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    let top = height, bottom = 0, left = width, right = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            // Check if pixel alpha is greater than the tolerance
            if (data[i+3] > tolerance) {
                if (y < top) top = y;
                if (y > bottom) bottom = y;
                if (x < left) left = x;
                if (x > right) right = x;
            }
        }
    }

    // If the image is entirely blank
    if (top > bottom) {
        return null;
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
    img.src = originalImage.url;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
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
  }, [originalImage, tolerance, handleTrim]);


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
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold font-headline">WebPGator</h1>
              <nav className="flex items-center gap-2">
                <Button variant="link" asChild className="p-0 text-muted-foreground">
                    <Link href="/">Konverter Massal</Link>
                </Button>
                <Button variant="link" asChild className="p-0 text-muted-foreground">
                    <Link href="/pdf-converter">Alat PDF</Link>
                </Button>
                <Button variant="link" asChild className="p-0 text-muted-foreground data-[active]:text-foreground">
                    <Link href="/trim">Potong Cerdas</Link>
                </Button>
              </nav>
            </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
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
                                <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                                    <Image src={originalImage.url} alt="Original image" layout="fill" objectFit="contain" />
                                </div>
                                <p className="text-sm text-muted-foreground text-center">Ukuran: {formatBytes(originalSize)}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-lg">Hasil Potong</h3>
                                <div className="relative aspect-square w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                                    {isTrimming && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
                                    {!isTrimming && trimmedImage && <Image src={trimmedImage.url} alt="Trimmed image" layout="fill" objectFit="contain" />}
                                    {!isTrimming && !trimmedImage && <ImageIcon className="w-8 h-8 text-muted-foreground" />}
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    {trimmedImage ? `Ukuran: ${formatBytes(trimmedSize)}` : 'Memproses...'}
                                </p>
                            </div>
                        </div>

                        <div className="max-w-sm mx-auto mt-8 space-y-4">
                            <div>
                                <Label htmlFor="tolerance-slider">Toleransi Pemangkasan: {tolerance[0]}</Label>
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
                                <p className="text-xs text-muted-foreground">Menyesuaikan sensitivitas. Nilai yang lebih tinggi akan memotong lebih agresif (berguna untuk gambar dengan bayangan tipis).</p>
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
      </main>
      <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WebPGator. Hak cipta dilindungi undang-undang.</p>
      </footer>
    </div>
  );
}
