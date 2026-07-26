'use client';

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { 
  ChevronLeft, 
  Grid3X3, 
  Download, 
  RefreshCcw, 
  FileImage, 
  Loader2,
  LayoutGrid,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GridSplitterPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string, width: number, height: number} | null>(null);
  const [gridSize, setGridSize] = useState<string>('3x3');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setOriginalImage({ file, url, width: img.width, height: img.height });
      };
      img.src = url;
    }
  };

  const processSplit = async () => {
    if (!originalImage) return;
    setIsProcessing(true);

    const [cols, rows] = gridSize.split('x').map(Number);
    const img = new Image();
    img.src = originalImage.url;
    
    img.onload = async () => {
      const zip = new JSZip();
      const partWidth = img.width / cols;
      const partHeight = img.height / rows;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = partWidth;
      canvas.height = partHeight;

      for (let r = 0; rows > r; r++) {
        for (let c = 0; cols > c; c++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img, 
            c * partWidth, r * partHeight, partWidth, partHeight, 
            0, 0, partWidth, partHeight
          );
          
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            zip.file(`part_${r + 1}_${c + 1}.png`, blob);
          }
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `grid_${gridSize}_${originalImage.file.name.split('.')[0]}.zip`);
      
      setIsProcessing(false);
      toast({ title: "Berhasil!", description: `Gambar telah dibagi menjadi ${cols * rows} bagian dan diunduh sebagai ZIP.` });
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Grid Splitter</h1>
            <p className="text-muted-foreground">Bagi gambar menjadi grid estetik untuk konten Instagram dan media sosial lainnya.</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-accent" /> Konfigurasi Grid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Pilih Format Grid</Label>
                  <Select value={gridSize} onValueChange={setGridSize}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Pilih Grid" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3x3">3x3 (Instagram Grid Standard)</SelectItem>
                      <SelectItem value="3x1">3x1 (Panorama Landscape)</SelectItem>
                      <SelectItem value="3x2">3x2 (Double Rows)</SelectItem>
                      <SelectItem value="2x2">2x2 (Simple Grid)</SelectItem>
                      <SelectItem value="1x3">1x3 (Vertical Story Split)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl space-y-2">
                   <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase">
                      <Info className="w-3.5 h-3.5" /> Tips Konten
                   </div>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">
                     Gunakan format **3x3** untuk menciptakan "Giant Grid" di profil Instagram Anda. Pastikan subjek utama gambar berada di tengah grid agar tetap terlihat bagus secara individu.
                   </p>
                </div>

                <Button 
                  className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl shadow-lg font-bold text-md"
                  onClick={processSplit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses Bagian...</>
                  ) : (
                    <><Download className="mr-2 h-5 w-5" /> Bagi & Unduh ZIP</>
                  )}
                </Button>

                <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl overflow-hidden glass-panel">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" /> Pratinjau Grid: {gridSize}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="aspect-square relative max-w-lg mx-auto bg-muted/30 rounded-2xl overflow-hidden border-4 border-white shadow-inner">
                  <img 
                    src={originalImage.url} 
                    alt="Original" 
                    className="w-full h-full object-cover"
                  />
                  {/* Grid Overlay */}
                  <div className={`absolute inset-0 grid grid-cols-${gridSize.split('x')[0]} grid-rows-${gridSize.split('x')[1]}`}>
                    {Array.from({ length: Number(gridSize.split('x')[0]) * Number(gridSize.split('x')[1]) }).map((_, i) => (
                      <div key={i} className="border border-white/50 bg-black/5 flex items-center justify-center">
                         <span className="text-white/20 font-black text-2xl">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex gap-4 items-center">
                  <div className="p-3 bg-primary/20 rounded-xl"><FileImage className="w-6 h-6 text-accent" /></div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-widest">Resolusi Asli</p>
                    <p className="text-sm font-mono">{originalImage.width}x{originalImage.height} px</p>
                  </div>
               </div>
               <div className="bg-accent/5 p-4 rounded-2xl border border-accent/20 flex gap-4 items-center">
                  <div className="p-3 bg-accent/20 rounded-xl"><Layers className="w-6 h-6 text-accent" /></div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold uppercase tracking-widest">Output Terdeteksi</p>
                    <p className="text-sm font-mono">{gridSize.split('x').reduce((a,b) => Number(a)*Number(b), 1)} File Gambar</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
