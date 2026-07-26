'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Ruler, ArrowRightLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PxRemPage() {
  const [px, setPx] = useState<string>('16');
  const [rem, setRem] = useState<string>('1');
  const [base, setBase] = useState<string>('16');

  const handlePxChange = (val: string) => {
    setPx(val);
    if (!isNaN(parseFloat(val)) && parseFloat(base) !== 0) {
      setRem((parseFloat(val) / parseFloat(base)).toFixed(3));
    }
  };

  const handleRemChange = (val: string) => {
    setRem(val);
    if (!isNaN(parseFloat(val))) {
      setPx((parseFloat(val) * parseFloat(base)).toFixed(0));
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">PX to REM</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">UI Dimension Calculator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl glass-panel">
          <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Ruler className="w-4 h-4 text-accent" /> Base Config</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Base Font Size (Default 16px)</Label>
              <Input type="number" value={base} onChange={(e) => setBase(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <div className="p-4 bg-accent/5 rounded-2xl space-y-2 border border-accent/10">
               <div className="flex items-center gap-2 text-accent font-black text-[10px] uppercase"><Info className="w-3 h-3" /> Info</div>
               <p className="text-[11px] text-muted-foreground leading-relaxed italic">REM adalah unit relatif terhadap ukuran font root. Standar web biasanya menggunakan 16px sebagai basis.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-card p-6 space-y-8">
           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Pixels (PX)</Label>
                <div className="flex items-center gap-4">
                   <Input type="number" value={px} onChange={(e) => handlePxChange(e.target.value)} className="h-16 text-3xl font-black rounded-2xl bg-muted/30 border-none" />
                   <div className="p-3 bg-accent/10 rounded-full"><ArrowRightLeft className="w-6 h-6 text-accent" /></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Root EM (REM)</Label>
                <Input type="number" value={rem} onChange={(e) => handleRemChange(e.target.value)} className="h-16 text-3xl font-black rounded-2xl bg-accent/5 border border-accent/20 text-accent" />
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}