
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  BrainCircuit, 
  UploadCloud, 
  RefreshCcw, 
  Loader2,
  Sparkles,
  Info,
  Pipette,
  Type,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { analyzeImage, type AnalyzeImageOutput } from '@/ai/flows/analyze-image';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AIAnalystPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [result, setResult] = useState<AnalyzeImageOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      
      setIsProcessing(true);
      try {
        const photoDataUri = await fileToDataUri(file);
        const analysis = await analyzeImage({ photoDataUri });
        setResult(analysis);
        toast({ title: "Analisis Selesai", description: "AI telah berhasil membedah aset visual Anda." });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Kesalahan AI', description: 'Gagal menganalisis gambar. Pastikan API Key valid.' });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">AI Image Analyst</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Deep Visual Inspection Engine</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-accent" /> Source Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-4">
                  <img src={originalImage.url} alt="Source" className="max-w-full max-h-full object-contain shadow-sm" />
                </div>
                {isProcessing && (
                  <div className="mt-6 flex flex-col items-center gap-3 animate-pulse">
                     <Loader2 className="w-8 h-8 animate-spin text-accent" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-accent">AI sedang berpikir...</p>
                  </div>
                )}
                {!isProcessing && (
                   <Button variant="ghost" className="w-full mt-6 text-[10px] uppercase font-bold tracking-widest" onClick={() => { setOriginalImage(null); setResult(null); }}>
                      <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                   </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-6">
             {result ? (
               <div className="space-y-6">
                  <Card className="rounded-3xl border-none shadow-2xl overflow-hidden h-fit">
                    <CardHeader className="bg-accent/5 border-b py-4 flex flex-row items-center justify-between">
                       <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2"><Sparkles className="w-4 h-4" /> Visual Intelligence</CardTitle>
                       <Badge variant="outline" className="text-[8px] font-black uppercase bg-accent/10 border-accent/20">Analyzed by Gemini 2.0</Badge>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><Type className="w-3.5 h-3.5" /> SEO Alt-Text</Label>
                          <div className="p-4 bg-muted/30 rounded-2xl border text-sm font-medium leading-relaxed italic">
                             "{result.altText}"
                          </div>
                       </div>

                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><Search className="w-3.5 h-3.5" /> Deskripsi Konten</Label>
                          <p className="text-[13px] leading-relaxed text-muted-foreground">
                             {result.description}
                          </p>
                       </div>

                       <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><Pipette className="w-3.5 h-3.5" /> Palet Warna Dominan</Label>
                          <div className="flex flex-wrap gap-3">
                             {result.palette.map((color, i) => (
                               <div key={i} className="group flex items-center gap-2 p-1.5 pr-4 rounded-xl border bg-card hover:border-accent/40 transition-all cursor-pointer" onClick={() => navigator.clipboard.writeText(color.hex)}>
                                  <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black font-mono leading-none">{color.hex}</span>
                                     <span className="text-[8px] uppercase font-bold text-muted-foreground">{color.name}</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground">SEO Tags</Label>
                          <div className="flex flex-wrap gap-2">
                             {result.tags.map(tag => (
                               <Badge key={tag} variant="secondary" className="bg-muted hover:bg-accent hover:text-white transition-colors cursor-pointer text-[10px] px-3 py-1 rounded-full">#{tag}</Badge>
                             ))}
                          </div>
                       </div>
                    </CardContent>
                  </Card>
               </div>
             ) : !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-[3rem] opacity-20 text-center">
                   <BrainCircuit className="w-16 h-16 mb-4" />
                   <p className="font-black uppercase tracking-widest text-xs">Menunggu Input Aset</p>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
