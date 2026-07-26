'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Square, Download, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function ImageBorderPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [thickness, setThickness] = useState([20]);
  const [color, setColor] = useState('#ffffff');
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
      const border = thickness[0];
      const canvas = document.createElement('canvas');
      canvas.width = img.width + (border * 2);
      canvas.height = img.height + (border * 2);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, border, border);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `border_${originalImage.file.name}`);
          toast({ title: "Selesai", description: "Bingkai telah ditambahkan ke gambar." });
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
          <h1 className="text-2xl font-black uppercase tracking-tight">Border Master</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Fine Art Framing</p>
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
                  <Square className="w-4 h-4 text-accent" /> Border Config
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Thickness: {thickness[0]}px</Label>
                  <Slider value={thickness} onValueChange={setThickness} min={0} max={200} step={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold">Border Color</Label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold mt-4" onClick={processImage} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export Image
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-12 flex items-center justify-center min-h-[400px] bg-muted/20">
                 <div 
                  className="p-4 shadow-2xl transition-all"
                  style={{ backgroundColor: color, padding: `${thickness[0]/4}px` }}
                 >
                    <img src={originalImage.url} alt="Preview" className="max-w-full h-auto" />
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}