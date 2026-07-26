
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  ChevronLeft, 
  ImagePlus, 
  Download, 
  RefreshCcw, 
  Loader2,
  Sparkles,
  Info,
  Wand2,
  Monitor,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateBackground } from '@/ai/flows/generate-background';
import { Badge } from '@/components/ui/badge';

export default function AIBackgroundPage() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('Cyberpunk neon city alley at night with rainy reflection');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateBackground({ prompt });
      setGeneratedUrl(result.imageUrl);
      toast({ title: "Background Dihasilkan!", description: "AI Imagen 4 telah merender visual Anda." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Generasi Gagal', description: 'Gagal memanggil model Imagen 4. Pastikan API Key aktif.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedUrl) return;
    saveAs(generatedUrl, `ai_bg_${Date.now()}.png`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">AI Background Gen</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Imagen 4 Artistic Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <Card className="rounded-3xl border-none shadow-xl glass-panel">
             <CardHeader className="bg-muted/50 border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Wand2 className="w-4 h-4 text-accent" /> Prompt Rack
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                   <Label className="text-[10px] uppercase font-bold text-muted-foreground">Visual Theme / Keywords</Label>
                   <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your background idea..."
                    className="w-full min-h-[120px] p-4 bg-muted/30 border-none rounded-2xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-accent resize-none"
                   />
                </div>
                <Button className="w-full h-14 bg-accent hover:bg-accent/90 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rendering Art...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate Image</>}
                </Button>
                
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl space-y-2">
                   <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase">
                      <Info className="w-3.5 h-3.5" /> Pro Tip
                   </div>
                   <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                     Gunakan kata-kata seperti "cinematic lighting", "minimalist studio", atau "vaporwave aesthetic" untuk hasil yang lebih terarah.
                   </p>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-7">
           <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-black min-h-[500px] flex items-center justify-center relative">
              {generatedUrl ? (
                <>
                  <img src={generatedUrl} alt="AI Result" className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" />
                  <div className="absolute bottom-8 right-8 flex gap-3">
                     <Button size="icon" className="h-12 w-12 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl" onClick={downloadImage}>
                        <Download className="w-5 h-5" />
                     </Button>
                     <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60" onClick={() => setGeneratedUrl(null)}>
                        <RefreshCcw className="w-5 h-5" />
                     </Button>
                  </div>
                  <Badge className="absolute top-8 left-8 bg-accent text-white border-none uppercase text-[9px] font-black px-3 py-1">Ready: 1024x1024 px</Badge>
                </>
              ) : (
                <div className="text-center space-y-4 opacity-20">
                   <ImagePlus className="w-20 h-20 mx-auto" />
                   <p className="font-black uppercase tracking-[0.2em] text-xs">Canvas Visual Kosong</p>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                   <div className="text-center space-y-3">
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-[10px] font-black uppercase text-white tracking-widest">Processing Node...</p>
                   </div>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
