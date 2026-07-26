
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, FileType, Copy, RefreshCcw, Eye, Code2 } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MarkdownStudioPage() {
  const { toast } = useToast();
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite your **markdown** here.');

  const copy = () => {
    navigator.clipboard.writeText(markdown);
    toast({ title: "Tersalin!", description: "Markdown telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Markdown Studio</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Local Documentation Editor</p>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto rounded-xl h-12 bg-muted/50 p-1 mb-8">
           <TabsTrigger value="editor" className="gap-2 font-bold uppercase text-[10px] tracking-widest"><Code2 className="w-4 h-4" /> Editor</TabsTrigger>
           <TabsTrigger value="preview" className="gap-2 font-bold uppercase text-[10px] tracking-widest"><Eye className="w-4 h-4" /> Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="animate-in fade-in duration-300">
           <Card className="rounded-3xl border-none shadow-xl overflow-hidden h-[600px] flex flex-col">
              <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><FileType className="w-4 h-4 text-accent" /> Markdown Input</CardTitle>
                 <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={copy} className="h-7 text-[9px] font-bold uppercase"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
                    <Button size="sm" variant="ghost" onClick={() => setMarkdown('')} className="h-7 text-[9px] font-bold uppercase"><RefreshCcw className="w-3 h-3 mr-1" /> Reset</Button>
                 </div>
              </CardHeader>
              <Textarea 
                value={markdown} 
                onChange={(e) => setMarkdown(e.target.value)} 
                placeholder="Type markdown here..." 
                className="flex-grow font-mono text-[12px] p-8 border-none resize-none bg-muted/20 focus-visible:ring-0" 
              />
           </Card>
        </TabsContent>

        <TabsContent value="preview" className="animate-in fade-in duration-300">
           <Card className="rounded-3xl border-none shadow-2xl overflow-hidden h-[600px] flex flex-col bg-card">
              <CardHeader className="bg-muted/30 border-b py-4">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">Rendered Output</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-10 overflow-auto prose prose-sm dark:prose-invert max-w-none">
                 {/* Simple manual rendering for MVP without external libs */}
                 <div className="space-y-4">
                    {markdown.split('\n\n').map((block, i) => {
                       if (block.startsWith('# ')) return <h1 key={i} className="text-4xl font-black border-b pb-2">{block.replace('# ', '')}</h1>;
                       if (block.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold">{block.replace('## ', '')}</h2>;
                       if (block.startsWith('- ')) return <ul key={i} className="list-disc pl-5">{block.split('\n').map((l, j) => <li key={j}>{l.replace('- ', '')}</li>)}</ul>;
                       return <p key={i} className="text-muted-foreground leading-relaxed">{block}</p>;
                    })}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
