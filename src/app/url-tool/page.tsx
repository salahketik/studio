'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Link as LinkIcon, Copy, RefreshCcw, Globe } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function UrlToolPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = (mode: 'encode' | 'decode') => {
    try {
      const res = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
      setOutput(res);
      toast({ title: "Selesai!", description: `URL telah di-${mode === 'encode' ? 'enkode' : 'dekode'}.` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memproses string URL.' });
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Tersalin!", description: "Hasil telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">URL Tool</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Safe String Transcoder</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Globe className="w-4 h-4 text-accent" /> Input Source</CardTitle></CardHeader>
           <CardContent className="p-6 space-y-4">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter URL or string here..." className="min-h-[120px] font-mono border-none bg-muted/20 rounded-2xl p-4" />
              <div className="flex gap-2">
                 <Button onClick={() => process('encode')} className="flex-1 h-12 bg-accent font-bold rounded-xl">Encode URL</Button>
                 <Button onClick={() => process('decode')} variant="outline" className="flex-1 h-12 font-bold rounded-xl">Decode URL</Button>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">Output</CardTitle>
              <Button size="icon" variant="ghost" onClick={copy} disabled={!output}><Copy className="w-4 h-4" /></Button>
           </CardHeader>
           <CardContent className="p-6">
              <div className="bg-muted/50 p-4 rounded-2xl font-mono text-sm break-all min-h-[100px]">
                 {output || '// Result will appear here...'}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}