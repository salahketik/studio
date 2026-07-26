
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Eye, RefreshCcw, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ColorContrastPage() {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#2563eb');
  const [ratio, setRatio] = useState(0);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const l = (v: number) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    return 0.2126 * l(r) + 0.7152 * l(g) + 0.0722 * l(b);
  };

  useEffect(() => {
    const l1 = hexToRgb(fg);
    const l2 = hexToRgb(bg);
    const res = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    setRatio(res);
  }, [fg, bg]);

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Color Contrast</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">WCAG Accessibility Checker</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl">
           <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Eye className="w-4 h-4 text-accent" /> Palette</CardTitle></CardHeader>
           <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase">Foreground</Label>
                    <Input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-14 p-1 cursor-pointer" />
                    <Input value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 text-center font-mono uppercase text-xs" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase">Background</Label>
                    <Input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-14 p-1 cursor-pointer" />
                    <Input value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 text-center font-mono uppercase text-xs" />
                 </div>
              </div>
              <div className="p-8 rounded-[2rem] text-center border-4 border-white shadow-2xl transition-colors" style={{ backgroundColor: bg, color: fg }}>
                 <p className="text-2xl font-black mb-2">Sample Text View</p>
                 <p className="text-[11px] leading-relaxed opacity-80">This is how your text looks with these colors. WCAG standards ensure everyone can read it.</p>
              </div>
           </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="rounded-3xl border-none shadow-2xl bg-accent text-white p-8">
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Contrast Ratio</p>
                    <p className="text-6xl font-black tracking-tighter">{ratio.toFixed(2)} : 1</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-2xl">
                    {ratio >= 4.5 ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10 text-red-300" />}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className={cn("p-4 rounded-2xl border bg-white/5", ratio >= 4.5 ? "border-white/20" : "border-red-400/40")}>
                    <p className="text-[10px] font-black uppercase mb-1">WCAG AA</p>
                    <p className="text-xs font-bold">{ratio >= 4.5 ? 'PASSED ✓' : 'FAILED ✗'}</p>
                 </div>
                 <div className={cn("p-4 rounded-2xl border bg-white/5", ratio >= 7 ? "border-white/20" : "border-white/5")}>
                    <p className="text-[10px] font-black uppercase mb-1">WCAG AAA</p>
                    <p className="text-xs font-bold">{ratio >= 7 ? 'PASSED ✓' : 'FAILED ✗'}</p>
                 </div>
              </div>
           </Card>

           <div className="bg-muted/50 p-6 rounded-3xl border flex gap-4">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-[11px] font-bold text-accent uppercase tracking-widest">Standards</p>
                 <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Standard **AA** memerlukan rasio minimal **4.5:1** untuk teks normal. Untuk standard **AAA**, rasio minimal adalah **7:1**. Desain yang aksesibel mempermudah semua pengguna membaca konten Anda.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
