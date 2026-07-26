'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, 
  Maximize2, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Download, 
  RefreshCcw,
  LayoutGrid,
  FileImage,
  Loader2,
  Crop
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';

interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: any;
  platform: string;
}

const socialPresets: Preset[] = [
  { id: 'ig_post', name: 'Instagram Post', width: 1080, height: 1080, icon: Instagram, platform: 'Instagram' },
  { id: 'ig_story', name: 'Instagram Story', width: 1080, height: 1920, icon: Instagram, platform: 'Instagram' },
  { id: 'yt_thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: Youtube, platform: 'YouTube' },
  { id: 'li_cover', name: 'LinkedIn Cover', width: 1584, height: 396, icon: Linkedin, platform: 'LinkedIn' },
  { id: 'tw_post', name: 'Twitter Post', width: 1200, height: 675, icon: Twitter, platform: 'Twitter' },
];

export default function ResizerPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setPreviewUrl(null);
      setSelectedPreset(null);
    }
  };

  const processResize = useCallback(async (preset: Preset) => {
    if (!originalImage) return;
    setIsProcessing(true);
    setSelectedPreset(preset);

    const img = document.createElement('img');
    img.src = originalImage.url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fit and Fill Logic (Center Crop)
      const scale = Math.max(preset.width / img.width, preset.height / img.height);
      const x = (preset.width / 2) - (img.width / 2) * scale;
      const y = (preset.height / 2) - (img.height / 2) * scale;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      canvas.toBlob((blob) => {
        if (blob) {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    };
  }, [originalImage, previewUrl]);

  const handleDownload = () => {
    if (!previewUrl || !selectedPreset) return;
    saveAs(previewUrl, `${selectedPreset.id}_${originalImage?.file.name}`);
    toast({ title: "Berhasil", description: "Gambar telah diunduh dengan ukuran baru." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Resizer Pro</h1>
            <p className="text-muted-foreground">Ubah ukuran gambar untuk berbagai format media sosial secara instan.</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-accent" /> Pilih Format
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {socialPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => processResize(preset)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl border transition-all hover:bg-accent/5",
                      selectedPreset?.id === preset.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg text-accent">
                        <preset.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold">{preset.name}</p>
                        <p className="text-[10px] text-muted-foreground">{preset.width}x{preset.height}</p>
                      </div>
                    </div>
                  </button>
                ))}
                <Button variant="ghost" className="w-full text-xs mt-4" onClick={() => setOriginalImage(null)}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-b">
                  <div className="flex-1 p-6 space-y-4">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                      <FileImage className="w-3 h-3" /> Original
                    </Label>
                    <div className="aspect-square relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-4">
                      <img src={originalImage.url} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-4 bg-accent/5">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-accent flex items-center gap-2">
                        <Maximize2 className="w-3 h-3" /> Preview: {selectedPreset?.name || 'Pilih Format'}
                      </Label>
                      {previewUrl && <Badge variant="secondary" className="bg-accent/10 text-accent text-[9px]">Ready</Badge>}
                    </div>
                    <div className="aspect-square relative rounded-2xl overflow-hidden border border-accent/20 bg-white flex items-center justify-center p-4">
                      {isProcessing ? (
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 animate-spin text-accent" />
                          <p className="text-[10px] uppercase font-bold text-accent tracking-tighter">Resizing...</p>
                        </div>
                      ) : previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl" />
                      ) : (
                        <div className="text-center space-y-2 opacity-40">
                          <Crop className="w-8 h-8 mx-auto" />
                          <p className="text-[10px] font-bold">PILIH FORMAT DI KIRI</p>
                        </div>
                      )}
                    </div>
                    {previewUrl && (
                      <Button className="w-full bg-accent hover:bg-accent/90 rounded-xl h-12 shadow-lg font-bold" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" /> Unduh Hasil
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
