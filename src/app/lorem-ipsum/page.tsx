'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Type, Copy, RefreshCcw, AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoremIpsumPage() {
  const { toast } = useToast();
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    let res = '';
    for (let i = 0; i < paragraphs; i++) {
      res += text + "\n\n";
    }
    setOutput(res.trim());
    toast({ title: "Teks Dihasilkan", description: "Lorem Ipsum siap digunakan." });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Tersalin!", description: "Teks dummy telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Lorem Ipsum Pro</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Dummy Content Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl glass-panel h-fit">
           <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><AlignLeft className="w-4 h-4" /> Parameters</CardTitle></CardHeader>
           <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                 <Label className="text-[10px] font-bold uppercase">Paragraphs</Label>
                 <Input type="number" value={paragraphs} onChange={(e) => setParagraphs(parseInt(e.target.value))} min={1} max={20} className="h-12 rounded-xl" />
              </div>
              <Button onClick={generate} className="w-full h-12 bg-accent font-bold rounded-xl"><RefreshCcw className="w-4 h-4 mr-2" /> Generate Text</Button>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col min-h-[400px] overflow-hidden">
           <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">Output</CardTitle>
              <Button size="icon" variant="ghost" onClick={copy} disabled={!output}><Copy className="w-4 h-4" /></Button>
           </CardHeader>
           <CardContent className="p-8 overflow-auto text-sm leading-relaxed text-muted-foreground italic">
              {output || 'Klik generate untuk memulainya...'}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}