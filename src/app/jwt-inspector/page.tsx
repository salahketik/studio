
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ShieldCheck, Copy, RefreshCcw, Lock, Eye } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function JwtInspectorPage() {
  const { toast } = useToast();
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<any>(null);
  const [payload, setPayload] = useState<any>(null);

  const decode = () => {
    if (!token) return;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT Format');
      
      setHeader(JSON.parse(atob(parts[0])));
      setPayload(JSON.parse(atob(parts[1])));
      toast({ title: "Token Decoded", description: "Header and Payload successfully extracted." });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Invalid JWT', description: 'Pastikan format token benar.' });
      setHeader(null);
      setPayload(null);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">JWT Inspector</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Local Auth Token Debugger</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
              <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Lock className="w-4 h-4 text-accent" /> Encoded Token</CardTitle>
                 <Button size="sm" onClick={decode} className="h-7 text-[9px] font-bold uppercase rounded-lg bg-accent">Decode</Button>
              </CardHeader>
              <Textarea 
                value={token} 
                onChange={(e) => setToken(e.target.value)} 
                placeholder="Paste your JWT here..." 
                className="min-h-[250px] font-mono text-[10px] p-6 border-none resize-none bg-muted/20 focus-visible:ring-0" 
              />
           </Card>
           <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex gap-3">
              <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">Decoding dilakukan 100% di browser Anda. Kami tidak pernah mengirim token Anda ke server.</p>
           </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
           <Card className="rounded-3xl border-none shadow-2xl overflow-hidden h-fit flex flex-col bg-card">
              <CardHeader className="bg-muted/30 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2"><Eye className="w-4 h-4" /> Decoded Payload</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-6">
                 {payload ? (
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase opacity-40">Header</Label>
                        <pre className="p-4 bg-muted/50 rounded-2xl font-mono text-[10px] overflow-auto text-red-500">{JSON.stringify(header, null, 2)}</pre>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase opacity-40">Payload</Label>
                        <pre className="p-4 bg-muted/50 rounded-2xl font-mono text-[10px] overflow-auto text-blue-500">{JSON.stringify(payload, null, 2)}</pre>
                      </div>
                   </div>
                 ) : (
                   <div className="h-[400px] flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                      <Lock className="w-16 h-16" />
                      <p className="font-black uppercase tracking-widest text-xs">Waiting for Input</p>
                   </div>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
