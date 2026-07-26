
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, SearchCode, Copy, RefreshCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function RegexLabPage() {
  const [pattern, setPattern] = useState('[a-z]+');
  const [testString, setTestString] = useState('example text');
  const [matches, setMatches] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    try {
      const regex = new RegExp(pattern, 'g');
      const results = testString.match(regex);
      setMatches(results || []);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
      setMatches([]);
    }
  }, [pattern, testString]);

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-5xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">RegEx Lab</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Regular Expression Playground</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><SearchCode className="w-4 h-4 text-accent" /> Expression</CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                 <Label className="text-[9px] font-black uppercase opacity-50">Pattern</Label>
                 <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                    <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className={cn("h-12 pl-6 pr-6 font-mono rounded-xl", !isValid && "border-destructive")} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/g</span>
                 </div>
                 {!isValid && <p className="text-[10px] text-destructive font-bold">Invalid Regular Expression</p>}
              </div>
           </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="rounded-3xl border-none shadow-xl overflow-hidden flex flex-col">
              <CardHeader className="bg-muted/30 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-50">Test String</CardTitle></CardHeader>
              <Textarea value={testString} onChange={(e) => setTestString(e.target.value)} className="flex-grow min-h-[200px] p-6 font-mono text-sm border-none bg-muted/20" />
           </Card>

           <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-card">
              <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">Matches ({matches.length})</CardTitle>
                 {matches.length > 0 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-muted-foreground opacity-30" />}
              </CardHeader>
              <CardContent className="p-6 overflow-auto max-h-[300px]">
                 <div className="flex flex-wrap gap-2">
                    {matches.map((m, i) => (
                      <Badge key={i} variant="secondary" className="bg-accent/10 text-accent border-accent/20 px-3 py-1 font-mono">{m}</Badge>
                    ))}
                    {matches.length === 0 && <p className="text-xs text-muted-foreground italic">No matches found.</p>}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
