'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, UserCircle, Download, RefreshCcw, Loader2, Crop } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';

export default function AvatarCirclePage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const processAvatar = () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = originalImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw image centered and cropped
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;
      ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `avatar_circle_${Date.now()}.png`);
          toast({ title: "Selesai", description: "Avatar bulat telah dihasilkan." });
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Circular Avatar</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Perfect Profile Picture Cropper</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
            <CardHeader className="bg-muted/50 border-b py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Crop className="w-4 h-4 text-accent" /> Source
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center gap-6">
              <img src={originalImage.url} alt="Source" className="max-h-60 rounded-xl shadow-lg" />
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold" onClick={() => setOriginalImage(null)}>
                <RefreshCcw className="mr-2 h-3 w-3" /> Change Image
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-accent/5">
            <CardHeader className="border-b py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent text-center">Avatar Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-10 flex flex-col items-center justify-center gap-8">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                 <img src={originalImage.url} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl font-bold shadow-xl" onClick={processAvatar} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Download className="mr-2" />} Download PNG Avatar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
