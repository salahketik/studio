
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Palette, Download, Copy, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function GradientStudioPage() {
  const { toast } = useToast();
  const [c1, setC1] = useState('#2563eb');
  const [c2, setC2] = useState('#9333ea');
  const [angle, setAngle] = useState(45);

  const cssCode = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    toast({ title: "Tersalin!", description: "Kode CSS gradien telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Gradient Studio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Dynamic Linear Color Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
          <CardHeader className="bg-muted/50 border-b py-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" /> Configure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold">Start Color</Label>
                  <Input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-14 p-1 cursor-pointer" />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold">End Color</Label>
                  <Input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-14 p-1 cursor-pointer" />
               </div>
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] uppercase font-bold">Angle: {angle}°</Label>
               <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent" />
            </div>
            <div className="pt-4 space-y-3">
               <div className="p-4 bg-black/5 rounded-2xl border font-mono text-[10px] break-all">
                  {cssCode}
               </div>
               <Button className="w-full rounded-xl font-bold bg-accent hover:bg-accent/90" onClick={copyCode}>
                  <Copy className="mr-2 h-4 w-4" /> Copy CSS Code
               </Button>
            </div>
          </CardContent>
        </Card>

        <div 
          className="rounded-[3rem] shadow-2xl border-8 border-white min-h-[400px] flex items-center justify-center text-white text-center p-8 transition-all duration-300"
          style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }}
        >
           <div className="space-y-2 mix-blend-overlay">
              <p className="text-4xl font-black uppercase tracking-tighter">Vibrant View</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Live Preview Node</p>
           </div>
        </div>
      </div>
    </div>
  );
}
