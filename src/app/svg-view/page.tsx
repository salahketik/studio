'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, FileCode, Copy, RefreshCcw, Loader2, Code2 } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function SvgViewPage() {
  const { toast } = useToast();
  const [svgContent, setSvgContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'image/svg+xml') {
        toast({ variant: 'destructive', title: 'Invalid File', description: 'Please upload a .svg file.' });
        return;
      }
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSvgContent(ev.target?.result as string);
        setIsProcessing(false);
      };
      reader.readAsText(file);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(svgContent);
    toast({ title: "Copied!", description: "SVG source code copied to clipboard." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">SVG Viewer</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Vector Source Inspector</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
             <CardHeader className="bg-muted/50 border-b py-4">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <FileCode className="w-4 h-4 text-accent" /> Upload Vector
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <input id="svg-up" type="file" className="hidden" accept=".svg" onChange={handleUpload} />
                <Button variant="outline" className="w-full h-14 border-dashed rounded-xl" onClick={() => document.getElementById('svg-up')?.click()}>
                  {isProcessing ? <Loader2 className="animate-spin" /> : "Select SVG File"}
                </Button>
                
                {svgContent && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-muted-foreground">Source Code</span>
                       <Button size="sm" variant="ghost" onClick={copyCode} className="h-7 text-[9px] font-bold uppercase"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
                    </div>
                    <Textarea 
                      readOnly 
                      value={svgContent} 
                      className="min-h-[300px] font-mono text-[10px] leading-relaxed bg-muted/20 border-none resize-none p-4 rounded-xl" 
                    />
                  </div>
                )}
             </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-7">
           <Card className="rounded-3xl border-none shadow-2xl glass-panel min-h-[500px] flex items-center justify-center p-12 bg-[url('https://placehold.co/10x10/eee/ddd')] bg-repeat">
              {svgContent ? (
                <div 
                  className="max-w-full max-h-full"
                  dangerouslySetInnerHTML={{ __html: svgContent }} 
                />
              ) : (
                <div className="text-center opacity-20"><Code2 className="w-20 h-20 mx-auto mb-4" /><p className="font-black tracking-widest uppercase">Awaiting Vector</p></div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}