
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Code2, Copy, RefreshCcw, Braces } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function HtmlEntitiesPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const process = (mode: 'encode' | 'decode') => {
    if (mode === 'encode') {
      const el = document.createElement('div');
      el.innerText = input;
      setOutput(el.innerHTML);
      toast({ title: "Encoded", description: "HTML Entities have been generated." });
    } else {
      const el = document.createElement('div');
      el.innerHTML = input;
      setOutput(el.innerText);
      toast({ title: "Decoded", description: "Original text restored." });
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Tersalin!", description: "Hasil telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">HTML Entities</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Text Transcoder for Web Dev</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Code2 className="w-4 h-4 text-accent" /> Source</CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-6">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste content here..." className="min-h-[150px] font-mono border-none bg-muted/20 rounded-2xl p-6" />
              <div className="flex gap-4">
                 <Button onClick={() => process('encode')} className="flex-1 h-12 bg-accent font-bold rounded-xl">Encode Entities</Button>
                 <Button onClick={() => process('decode')} variant="outline" className="flex-1 h-12 font-bold rounded-xl">Decode Entities</Button>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2"><Braces className="w-4 h-4" /> Result</CardTitle>
              {output && <Button size="icon" variant="ghost" onClick={copy}><Copy className="w-4 h-4" /></Button>}
           </CardHeader>
           <div className="p-8 font-mono text-sm break-all leading-relaxed min-h-[100px] bg-black/5">
              {output || 'Result will appear here...'}
           </div>
        </Card>
      </div>
    </div>
  );
}
