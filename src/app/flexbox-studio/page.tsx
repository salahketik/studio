
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Layout, Copy, RefreshCcw, Box, AlignCenter } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FlexboxStudioPage() {
  const { toast } = useToast();
  const [direction, setDirection] = useState('row');
  const [justify, setJustify] = useState('center');
  const [align, setAlign] = useState('center');
  const [gap, setGap] = useState('1rem');

  const cssCode = `display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
gap: ${gap};`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode);
    toast({ title: "Copied!", description: "CSS Flexbox code copied to clipboard." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Flexbox Studio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Visual CSS Layout Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
           <Card className="rounded-3xl border-none shadow-xl">
             <CardHeader className="bg-muted/50 border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><AlignCenter className="w-4 h-4 text-accent" /> Controls</CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase opacity-50">Flex Direction</Label>
                   <Select value={direction} onValueChange={setDirection}>
                      <SelectTrigger className="h-10 rounded-xl">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="row">Row (Horiz)</SelectItem>
                         <SelectItem value="column">Column (Vert)</SelectItem>
                         <SelectItem value="row-reverse">Row Reverse</SelectItem>
                         <SelectItem value="column-reverse">Column Reverse</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase opacity-50">Justify Content</Label>
                   <Select value={justify} onValueChange={setJustify}>
                      <SelectTrigger className="h-10 rounded-xl">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="flex-start">Flex Start</SelectItem>
                         <SelectItem value="center">Center</SelectItem>
                         <SelectItem value="flex-end">Flex End</SelectItem>
                         <SelectItem value="space-between">Space Between</SelectItem>
                         <SelectItem value="space-around">Space Around</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[9px] font-black uppercase opacity-50">Align Items</Label>
                   <Select value={align} onValueChange={setAlign}>
                      <SelectTrigger className="h-10 rounded-xl">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="flex-start">Flex Start</SelectItem>
                         <SelectItem value="center">Center</SelectItem>
                         <SelectItem value="flex-end">Flex End</SelectItem>
                         <SelectItem value="stretch">Stretch</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="pt-4 space-y-3">
                   <pre className="p-4 bg-muted/50 rounded-2xl font-mono text-[9px] leading-relaxed">{cssCode}</pre>
                   <Button onClick={copy} className="w-full h-11 bg-accent font-bold rounded-xl"><Copy className="w-4 h-4 mr-2" /> Copy CSS</Button>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
           <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-muted/10 h-[500px] flex items-center justify-center p-8">
              <div 
                className="w-full h-full border-2 border-dashed border-accent/20 rounded-[2rem] p-4 transition-all duration-300"
                style={{ display: 'flex', flexDirection: direction as any, justifyContent: justify, alignItems: align, gap }}
              >
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-20 h-20 bg-accent/20 border-2 border-accent rounded-2xl flex items-center justify-center">
                      <Box className="w-6 h-6 text-accent" />
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
