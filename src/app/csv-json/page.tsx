
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Table, Copy, RefreshCcw, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function CsvJsonPage() {
  const { toast } = useToast();
  const [csv, setCsv] = useState('name,age,city\nJohn,30,New York\nJane,25,Paris');
  const [json, setJson] = useState('');

  const convert = () => {
    try {
      const lines = csv.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((h, i) => {
          obj[h] = values[i];
        });
        return obj;
      });
      setJson(JSON.stringify(result, null, 2));
      toast({ title: "Converted!", description: "CSV has been transformed to JSON array." });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal memproses data CSV.' });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">CSV to JSON</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Data Transformation Utility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <Card className="rounded-3xl border-none shadow-xl flex flex-col overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Table className="w-4 h-4 text-accent" /> CSV Raw</CardTitle>
              <Button size="sm" onClick={convert} className="h-7 text-[9px] font-bold uppercase rounded-lg bg-accent">Convert <ArrowRightLeft className="w-3 h-3 ml-1" /></Button>
           </CardHeader>
           <Textarea value={csv} onChange={(e) => setCsv(e.target.value)} className="flex-grow font-mono text-[11px] p-6 border-none resize-none bg-muted/20 focus-visible:ring-0" />
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-[#11121d]">
           <CardHeader className="bg-white/5 border-b border-white/5 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">JSON Output</CardTitle>
              {json && <Button size="icon" variant="ghost" className="text-white/60 hover:text-white" onClick={() => { navigator.clipboard.writeText(json); toast({ title: "Tersalin!" }); }}><Copy className="w-4 h-4" /></Button>}
           </CardHeader>
           <pre className="flex-grow font-mono text-[11px] p-6 overflow-auto text-green-500 whitespace-pre">
              {json || '// Output will appear here...'}
           </pre>
        </Card>
      </div>
    </div>
  );
}
