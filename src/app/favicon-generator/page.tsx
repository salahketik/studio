'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, 
  Box, 
  Download, 
  RefreshCcw, 
  Loader2,
  Info,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';

export default function FaviconGeneratorPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const generateFavicon = async () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 32;
    canvas.height = 32;
    
    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 32, 32);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'favicon.ico');
          toast({ title: "Selesai!", description: "Favicon 32x32 telah dihasilkan." });
        }
        setIsProcessing(false);
      }, 'image/x-icon');
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Favicon Generator</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Standard Web Icon Maker</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
            <CardHeader className="bg-muted/50 border-b py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Box className="w-4 h-4 text-accent" /> Source Image
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-xl overflow-hidden border bg-muted/20 flex items-center justify-center">
                <img src={originalImage.url} alt="Source" className="max-w-full max-h-full object-contain" />
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
                <RefreshCcw className="mr-2 h-3 w-3" /> Change Image
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-2xl overflow-hidden h-fit">
            <CardHeader className="bg-accent/5 border-b py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">Output Ready</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border">
                 <div className="w-8 h-8 bg-white border rounded shadow-sm flex items-center justify-center">
                    <img src={originalImage.url} alt="ICO" className="w-4 h-4" />
                 </div>
                 <div className="space-y-0.5">
                   <p className="text-xs font-bold uppercase">favicon.ico</p>
                   <p className="text-[10px] text-muted-foreground font-mono">32 x 32 px</p>
                 </div>
              </div>
              
              <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl font-bold shadow-lg" onClick={generateFavicon} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Export .ICO
              </Button>

              <div className="p-4 bg-accent/5 rounded-xl flex gap-3">
                 <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                   Ekspor ini menghasilkan standar .ico 32px yang kompatibel dengan semua browser modern.
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}