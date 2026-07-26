'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Calculator, Hash, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AspectCalculatorPage() {
  const [w1, setW1] = useState<number>(1920);
  const [h1, setH1] = useState<number>(1080);
  const [w2, setW2] = useState<number>(1080);
  const [h2, setH2] = useState<number>(0);

  useEffect(() => {
    if (w1 && h1 && w2) {
      setH2(Math.round((h1 / w1) * w2));
    }
  }, [w1, h1, w2]);

  const gcd = (a: number, b: number): number => {
    return b ? gcd(b, a % b) : a;
  };

  const ratio = () => {
    const common = gcd(w1, h1);
    return `${w1 / common}:${h1 / common}`;
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Aspect Ratio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Proportional Dimension Logic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl">
           <CardHeader className="bg-muted/50 border-b py-4">
             <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <Hash className="w-4 h-4 text-accent" /> Base Dimensions
             </CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase">Base Width</Label>
                    <Input type="number" value={w1} onChange={(e) => setW1(Number(e.target.value))} className="h-12 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase">Base Height</Label>
                    <Input type="number" value={h1} onChange={(e) => setH1(Number(e.target.value))} className="h-12 rounded-xl" />
                 </div>
              </div>
              <div className="p-6 bg-accent/5 rounded-3xl border border-accent/20 text-center">
                 <p className="text-[10px] font-black uppercase text-accent mb-1">Detected Ratio</p>
                 <p className="text-4xl font-black tracking-tighter">{ratio()}</p>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-xl bg-accent text-white">
           <CardHeader className="border-b border-white/10 py-4">
             <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <ArrowRightLeft className="w-4 h-4" /> Scaled Output
             </CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Target Width</Label>
                    <Input type="number" value={w2} onChange={(e) => setW2(Number(e.target.value))} className="h-14 rounded-2xl bg-white/10 border-white/20 text-white text-2xl font-black" />
                 </div>
                 <div className="h-px bg-white/10 my-4" />
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase opacity-60">Calculated Height</Label>
                    <div className="h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center px-4 text-3xl font-black tracking-tighter">
                       {h2} px
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}