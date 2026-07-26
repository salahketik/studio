
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ListChecks, Copy, RefreshCcw, SortAsc, Scissors } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function ListCleanerPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = (mode: 'dedupe' | 'sort' | 'clean') => {
    let lines = input.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    if (mode === 'dedupe') {
      lines = Array.from(new Set(lines));
      toast({ title: "Deduplikasi Selesai", description: "Baris duplikat telah dihapus." });
    } else if (mode === 'sort') {
      lines.sort((a, b) => a.localeCompare(b));
      toast({ title: "Sortir Selesai", description: "Daftar telah diurutkan A-Z." });
    } else if (mode === 'clean') {
      lines = lines.map(l => l.replace(/[^\w\s]/gi, ''));
      toast({ title: "Pembersihan Karakter", description: "Karakter non-alfanumerik telah dihapus." });
    }
    
    setOutput(lines.join('\n'));
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Tersalin!", description: "Daftar telah disalin ke papan klip." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">List Cleaner</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Advanced Line Processing Utility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <Card className="rounded-3xl border-none shadow-xl flex flex-col overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><ListChecks className="w-4 h-4 text-accent" /> Input Raw</CardTitle>
              <div className="flex gap-2">
                 <Button size="sm" variant="outline" className="h-7 text-[9px] font-bold uppercase rounded-lg" onClick={() => process('dedupe')}><Scissors className="w-3 h-3 mr-1" /> Dedupe</Button>
                 <Button size="sm" variant="outline" className="h-7 text-[9px] font-bold uppercase rounded-lg" onClick={() => process('sort')}><SortAsc className="w-3 h-3 mr-1" /> Sort A-Z</Button>
              </div>
           </CardHeader>
           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste your list here (one item per line)...' className="flex-grow font-mono text-[11px] p-6 border-none resize-none bg-muted/20" />
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">Output</CardTitle>
              {output && <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-[9px] font-bold uppercase"><Copy className="w-3 h-3 mr-1" /> Copy List</Button>}
           </CardHeader>
           <Textarea readOnly value={output} className="flex-grow font-mono text-[11px] p-6 border-none resize-none bg-black/5" />
           <div className="p-4 bg-muted/20 border-t flex justify-between items-center">
              <Badge variant="outline" className="text-[9px] uppercase font-black">Lines: {output.split('\n').filter(l => l).length}</Badge>
              <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase" onClick={() => { setInput(''); setOutput(''); }}><RefreshCcw className="w-3 h-3 mr-1" /> Clear</Button>
           </div>
        </Card>
      </div>
    </div>
  );
}
