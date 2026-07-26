
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Database, Copy, RefreshCcw, AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function SqlFormatterPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    if (!input) return;
    // Simple rule-based formatter for MVP
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'INSERT INTO', 'UPDATE', 'DELETE', 'SET'];
    let formatted = input.replace(/\s+/g, ' ');
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${kw}`);
    });
    setOutput(formatted.trim());
    toast({ title: "SQL Formatted", description: "Query has been cleaned up." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">SQL Formatter</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Query Beautification Utility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4 text-accent" /> SQL Query</CardTitle>
              <Button size="sm" onClick={format} className="h-7 text-[9px] font-bold uppercase rounded-lg bg-accent">Beautify</Button>
           </CardHeader>
           <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="SELECT * FROM users WHERE id = 1..." className="min-h-[200px] font-mono text-[11px] p-6 border-none resize-none bg-muted/20" />
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-black text-green-500">
           <CardHeader className="bg-white/5 border-b border-white/5 py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-accent"><AlignLeft className="w-4 h-4" /> Formatted Result</CardTitle>
              {output && <Button size="icon" variant="ghost" className="text-green-500" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Tersalin!" }); }}><Copy className="w-4 h-4" /></Button>}
           </CardHeader>
           <pre className="p-8 font-mono text-[11px] whitespace-pre-wrap overflow-auto h-[250px]">
              {output || '-- Output will appear here...'}
           </pre>
        </Card>
      </div>
    </div>
  );
}
