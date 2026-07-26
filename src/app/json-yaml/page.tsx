
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Braces, Copy, RefreshCcw, ArrowRightLeft } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function JsonYamlPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      // Simple manual YAML conversion for MVP (only handles flat objects/arrays)
      let yaml = '';
      const stringify = (val: any, indent = 0) => {
        const space = ' '.repeat(indent);
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
            val.forEach(item => {
              yaml += `${space}- `;
              stringify(item, indent + 2);
            });
          } else {
            Object.entries(val).forEach(([k, v]) => {
              yaml += `${space}${k}: `;
              if (typeof v === 'object') {
                yaml += '\n';
                stringify(v, indent + 2);
              } else {
                yaml += `${v}\n`;
              }
            });
          }
        } else {
          yaml += `${val}\n`;
        }
      };
      stringify(obj);
      setOutput(yaml);
      toast({ title: "Converted!", description: "JSON transformed to YAML format." });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Pastikan format input benar.' });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">JSON to YAML</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Data Format Interoperability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <Card className="rounded-3xl border-none shadow-xl flex flex-col overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Braces className="w-4 h-4 text-accent" /> JSON Input</CardTitle>
              <Button size="sm" onClick={convert} className="h-7 text-[9px] font-bold uppercase rounded-lg bg-accent">Convert <ArrowRightLeft className="w-3 h-3 ml-1" /></Button>
           </CardHeader>
           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here...' className="flex-grow font-mono text-[11px] p-6 border-none resize-none bg-muted/20 focus-visible:ring-0" />
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">YAML Output</CardTitle>
              {output && <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Tersalin!" }); }}><Copy className="w-4 h-4" /></Button>}
           </CardHeader>
           <Textarea readOnly value={output} className="flex-grow font-mono text-[11px] p-6 border-none resize-none bg-black/5" />
        </Card>
      </div>
    </div>
  );
}
