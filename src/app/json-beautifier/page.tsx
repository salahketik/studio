'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, FileJson, Copy, RefreshCcw, AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function JsonBeautifierPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = (mode: 'beautify' | 'minify') => {
    try {
      const obj = JSON.parse(input);
      const res = mode === 'beautify' ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
      setOutput(res);
      toast({ title: "Selesai!", description: `JSON telah di-${mode === 'beautify' ? 'rapikan' : 'kompres'}.` });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Pastikan format input benar.' });
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Tersalin!", description: "Kode JSON telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">JSON Beautifier</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Code Formatting Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <Card className="rounded-3xl border-none shadow-xl flex flex-col overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><AlignLeft className="w-4 h-4" /> Input Raw</CardTitle>
              <div className="flex gap-2">
                 <Button size="sm" variant="outline" className="h-7 text-[9px] font-bold uppercase rounded-lg" onClick={() => process('minify')}>Minify</Button>
                 <Button size="sm" className="h-7 text-[9px] font-bold uppercase rounded-lg bg-accent" onClick={() => process('beautify')}>Beautify</Button>
              </div>
           </CardHeader>
           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here...' className="flex-grow font-mono text-[11px] p-6 border-none resize-none bg-muted/20" />
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-[#11121d]">
           <CardHeader className="bg-white/5 border-b border-white/5 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-accent"><FileJson className="w-4 h-4" /> Formatted Output</CardTitle>
              <Button size="sm" variant="ghost" className="h-7 text-[9px] font-bold uppercase text-white/60 hover:text-white" onClick={copy} disabled={!output}><Copy className="w-3 h-3 mr-1" /> Copy</Button>
           </CardHeader>
           <pre className="flex-grow font-mono text-[11px] p-6 overflow-auto text-green-500 whitespace-pre">
              {output || '// Output will appear here...'}
           </pre>
        </Card>
      </div>
    </div>
  );
}