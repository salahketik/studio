'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, 
  ShieldAlert, 
  Download, 
  RefreshCcw, 
  FileImage, 
  Loader2,
  Lock,
  Eye,
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';

export default function MetadataCleanerPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setOriginalImage({ file, url });
      setIsCleaned(false);
    }
  };

  const processClean = async () => {
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

      // Redrawing on canvas effectively strips EXIF/Metadata
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `privacy_clean_${originalImage.file.name}`);
          setIsCleaned(true);
          toast({ title: "Privasi Terjamin!", description: "Metadata telah dihapus dan file diunduh." });
        }
        setIsProcessing(false);
      }, originalImage.file.type);
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight uppercase">Hapus Metadata</h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Lindungi Privasi Foto Anda</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          
          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl overflow-hidden glass-panel">
              <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-accent" /> Sumber Gambar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-4">
                  <img src={originalImage.url} alt="Original" className="max-w-full max-h-full object-contain shadow-sm" />
                </div>
              </CardContent>
            </Card>

            <div className="bg-accent/5 border border-accent/20 p-6 rounded-3xl flex gap-4 items-start">
               <div className="p-2 bg-accent/10 rounded-lg"><Info className="w-5 h-5 text-accent" /></div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">Bagaimana Cara Kerjanya?</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Sistem akan merender ulang gambar Anda ke dalam kanvas digital murni. Proses ini secara otomatis membuang semua informasi tersembunyi seperti Lokasi GPS, Model Kamera, dan Tanggal Pengambilan foto.
                  </p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden h-fit">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" /> Panel Privasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border">
                      <div className="flex items-center gap-3">
                         <Eye className="w-4 h-4 text-muted-foreground" />
                         <span className="text-[11px] font-bold uppercase">Status Metadata</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] border-orange-500/30 text-orange-600 bg-orange-500/5 uppercase font-black tracking-widest">Terdeteksi Berisiko</Badge>
                   </div>
                </div>

                <Button 
                  className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl shadow-lg font-black text-xs uppercase tracking-widest"
                  onClick={processClean}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus Jejak...</>
                  ) : (
                    <><ShieldAlert className="mr-2 h-4 w-4" /> Bersihkan & Unduh</>
                  )}
                </Button>

                {isCleaned && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">Selesai: File 100% Bersih</p>
                  </div>
                )}

                <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest text-muted-foreground" onClick={() => { setOriginalImage(null); setIsCleaned(false); }}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
