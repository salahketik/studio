'use client';

import { useState } from 'react';
import { runAIAnalyzeImage } from '@/app/actions';
import type { AnalyzeImageOutput } from '@/ai/flows/analyze-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Copy, 
  Palette, 
  Search, 
  Type,
  Hash,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function VisionAnalystPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeImageOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setAnalysis(null);
    }
  };

  const startAnalysis = async () => {
    if (!originalImage) return;
    setIsAnalyzing(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = await runAIAnalyzeImage({ photoDataUri: e.target?.result as string });
        if (result.error) throw new Error(result.error);
        setAnalysis(result as AnalyzeImageOutput);
        toast({ title: "Analisis Berhasil", description: "AI telah mengekstrak detail dari gambar Anda." });
      };
      reader.readAsDataURL(originalImage.file);
    } catch (error) {
      toast({ variant: 'destructive', title: "Gagal", description: "Terjadi kesalahan saat menganalisis." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Teks Disalin", description: `${label} telah disalin ke papan klip.` });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Vision Analyst AI</h1>
            <p className="text-muted-foreground">Ekstrak palet warna, Alt-Text SEO, dan deskripsi cerdas menggunakan AI.</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
          
          {/* Preview Image */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl overflow-hidden glass-panel h-fit">
              <CardContent className="p-6 space-y-6">
                <div className="aspect-square relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-2">
                  <img src={originalImage.url} alt="To Analyze" className="max-w-full max-h-full object-contain rounded-xl" />
                </div>
                {!analysis && (
                  <Button onClick={startAnalysis} disabled={isAnalyzing} className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 shadow-xl font-bold">
                    {isAnalyzing ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Menganalisis...</> : <><Sparkles className="mr-3 h-5 w-5" /> Mulai Analisis Vision</>}
                  </Button>
                )}
                <Button variant="ghost" className="w-full text-xs" onClick={() => { setOriginalImage(null); setAnalysis(null); }}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-7 space-y-6">
            {!analysis && !isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-3xl opacity-50">
                <Search className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Siap Menganalisis</h3>
                <p className="text-sm max-w-xs mx-auto">Klik tombol "Mulai Analisis Vision" untuk melihat keajaiban AI.</p>
              </div>
            ) : isAnalyzing ? (
                <div className="space-y-6">
                    <Card className="rounded-3xl border-none shadow-lg animate-pulse">
                        <div className="p-12 space-y-4">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="h-20 bg-muted rounded w-full"></div>
                        </div>
                    </Card>
                </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-6 duration-700">
                {/* Palette */}
                <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
                  <CardHeader className="bg-muted/30 border-b pb-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Palette className="h-4 w-4 text-accent" /> Palet Warna Dominan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {analysis.palette.map((color, idx) => (
                        <div key={idx} className="space-y-2 group cursor-pointer" onClick={() => copyToClipboard(color.hex, 'Kode Warna')}>
                          <div 
                            className="aspect-square rounded-2xl shadow-inner border border-white/20 transition-transform group-hover:scale-105" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="text-center">
                            <p className="text-[10px] font-bold truncate uppercase">{color.name}</p>
                            <p className="text-[9px] font-mono text-muted-foreground">{color.hex}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Text */}
                <Card className="rounded-3xl border-none shadow-xl">
                  <CardHeader className="pb-3 pt-6 px-6">
                     <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Search className="h-4 w-4 text-accent" /> Metadata & SEO
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Type className="w-3 h-3" /> Alt-Text (Recommended)
                         </Label>
                         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(analysis.altText, 'Alt-Text')}>
                            <Copy className="h-3 w-3" />
                         </Button>
                      </div>
                      <p className="text-sm p-4 bg-muted/50 rounded-2xl leading-relaxed border border-border/10">{analysis.altText}</p>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Hash className="w-3 h-3" /> SEO Tags
                       </Label>
                       <div className="flex flex-wrap gap-2">
                         {analysis.tags.map((tag, idx) => (
                           <Badge key={idx} variant="secondary" className="bg-accent/5 text-accent border-accent/10 px-3 py-1">
                             #{tag}
                           </Badge>
                         ))}
                       </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-3">
                        <CardTitle className="text-sm font-bold">Analisis Mendalam</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                            "{analysis.description}"
                        </p>
                    </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
