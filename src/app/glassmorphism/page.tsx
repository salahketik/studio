
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, GlassWater, Copy, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';

export default function GlassmorphismPage() {
  const { toast } = useToast();
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.2);
  const [border, setBorder] = useState(1);

  const cssCode = `background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${border}px solid rgba(255, 255, 255, 0.3);
border-radius: 20px;`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    toast({ title: "Tersalin!", description: "Kode CSS glassmorphism telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Glass Studio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Transparent UI Asset Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <Card className="rounded-3xl border-none shadow-xl glass-panel">
             <CardHeader className="bg-muted/50 border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <GlassWater className="w-4 h-4 text-accent" /> Parameters
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                   <Label className="text-[10px] uppercase font-bold">Blur Intensity: {blur}px</Label>
                   <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent" />
                </div>
                <div className="space-y-4">
                   <Label className="text-[10px] uppercase font-bold">Opacity: {Math.round(opacity * 100)}%</Label>
                   <input type="range" min="0.05" max="0.6" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent" />
                </div>
                <div className="pt-4 border-t space-y-4">
                   <pre className="p-4 bg-black/5 rounded-2xl border font-mono text-[9px] break-all leading-relaxed overflow-x-auto">
                     {cssCode}
                   </pre>
                   <Button className="w-full h-12 rounded-xl font-bold bg-accent hover:bg-accent/90" onClick={copyCode}>
                      <Copy className="mr-2 h-4 w-4" /> Copy CSS Code
                   </Button>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-7 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[500px] flex items-center justify-center bg-[url('https://picsum.photos/seed/glass/1200/800')] bg-cover bg-center">
           <div 
            className="w-80 h-80 transition-all duration-300 shadow-2xl flex flex-col items-center justify-center text-white text-center p-8 border-white/30"
            style={{ 
              background: `rgba(255, 255, 255, ${opacity})`,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              border: `${border}px solid rgba(255, 255, 255, 0.3)`,
              borderRadius: '2.5rem'
            }}
           >
              <GlassWater className="w-12 h-12 mb-4" />
              <p className="text-2xl font-black uppercase tracking-tighter">Frosted UI</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Glassmorphism Node</p>
           </div>
        </div>
      </div>
    </div>
  );
}
