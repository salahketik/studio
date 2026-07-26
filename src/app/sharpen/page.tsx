'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Wand2, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function SharpenPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [amount, setAmount] = useState([1.5]);
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
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width;
      const h = canvas.height;
      const mix = amount[0];

      // Sharpen Kernel
      const kernel = [0, -mix, 0, -mix, 1 + 4 * mix, -mix, 0, -mix, 0];
      const output = new Uint8ClampedArray(data.length);

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let res = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                res += data[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
              }
            }
            output[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, res));
          }
          output[(y * w + x) * 4 + 3] = 255;
        }
      }
      
      ctx.putImageData(new ImageData(output, w, h), 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `sharp_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Ketajaman gambar telah ditingkatkan." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  const a = amount[0];

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Sharpen Pro</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Local Edge Enhancement</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-accent" /> Control Rack
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Intensity: {amount[0]}x</Label>
                  <Slider value={amount} onValueChange={setAmount} min={0} max={4} step={0.1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Sharp Image
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20 relative">
                 {/* Live SVG Filter for Real-time Preview */}
                 <svg className="absolute w-0 h-0 invisible">
                    <filter id="live-sharpen">
                      <feConvolveMatrix 
                        order="3" 
                        preserveAlpha="true" 
                        matrix={`0 -${a} 0 -${a} ${1 + 4*a} -${a} 0 -${a} 0`}
                      />
                    </filter>
                 </svg>
                 <img 
                    src={originalImage.url} 
                    alt="Preview" 
                    className="max-w-full h-auto transition-all" 
                    style={{ filter: 'url(#live-sharpen)' }}
                 />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}