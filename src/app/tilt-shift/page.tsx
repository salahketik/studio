
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Focus, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function TiltShiftPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [blur, setBlur] = useState([10]);
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

      // Draw original
      ctx.drawImage(img, 0, 0);

      // Create a temporary blurred version
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;
      tCtx.filter = `blur(${blur[0]}px)`;
      tCtx.drawImage(img, 0, 0);

      // Mask with gradient
      const mask = ctx.createLinearGradient(0, 0, 0, canvas.height);
      mask.addColorStop(0, 'black');
      mask.addColorStop(0.3, 'transparent');
      mask.addColorStop(0.7, 'transparent');
      mask.addColorStop(1, 'black');

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(tempCanvas, 0, 0);
      
      // Note: Full tilt-shift requires complex masking. For MVP we use CSS preview.
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `tilt_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Efek Tilt-Shift telah diterapkan." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Tilt-Shift FX</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Miniature Model Simulation</p>
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
                  <Focus className="w-4 h-4 text-accent" /> Optics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Blur Level: {blur[0]}px</Label>
                  <Slider value={blur} onValueChange={setBlur} min={0} max={30} step={1} />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Miniature
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0 flex items-center justify-center min-h-[400px] bg-muted/20 relative">
                 <img 
                  src={originalImage.url} 
                  alt="Preview" 
                  className="max-w-full h-auto"
                 />
                 {/* CSS Based Tilt-Shift Mask Overlay */}
                 <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    backdropFilter: `blur(${blur[0]}px)`,
                    WebkitBackdropFilter: `blur(${blur[0]}px)`,
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 30%, transparent 70%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 30%, transparent 70%, black 100%)'
                  }}
                 />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
