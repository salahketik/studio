'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Type, Copy, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function CaseConverterPage() {
  const { toast } = useToast();
  const [text, setText] = useState('');

  const convert = (mode: 'upper' | 'lower' | 'camel' | 'snake' | 'kebab') => {
    let res = text;
    if (mode === 'upper') res = text.toUpperCase();
    if (mode === 'lower') res = text.toLowerCase();
    if (mode === 'camel') res = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
    if (mode === 'snake') res = text.toLowerCase().replace(/\s+/g, '_');
    if (mode === 'kebab') res = text.toLowerCase().replace(/\s+/g, '-');
    setText(res);
    toast({ title: "Dikonversi!", description: `Teks telah diubah ke format ${mode}.` });
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    toast({ title: "Tersalin!", description: "Teks telah disalin ke papan klip." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Case Converter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Text Transformation Utility</p>
        </div>
      </div>

      <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
         <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Type className="w-4 h-4 text-accent" /> Editor Rack</CardTitle>
            <Button size="sm" variant="ghost" onClick={copy} disabled={!text} className="text-[9px] font-black uppercase"><Copy className="w-3 h-3 mr-1" /> Copy Text</Button>
         </CardHeader>
         <CardContent className="p-6 space-y-6">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter your text here..." className="min-h-[250px] font-mono text-lg border-none bg-muted/20 rounded-2xl p-6 focus-visible:ring-1" />
            <div className="flex flex-wrap gap-2">
               <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase" onClick={() => convert('upper')}>UPPERCASE</Button>
               <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase" onClick={() => convert('lower')}>lowercase</Button>
               <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase" onClick={() => convert('camel')}>camelCase</Button>
               <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase" onClick={() => convert('snake')}>snake_case</Button>
               <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-bold uppercase" onClick={() => convert('kebab')}>kebab-case</Button>
               <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-bold uppercase ml-auto" onClick={() => setText('')}><RefreshCcw className="w-3 h-3 mr-1" /> Clear</Button>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}