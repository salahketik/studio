'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Lock, Copy, Fingerprint, Search } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function HashMasterPage() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [sha256, setSha256] = useState('');

  const generateHash = async () => {
    if (!input) return;
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setSha256(hashHex);
    toast({ title: "Hash Generated", description: "SHA-256 fingerprint has been calculated." });
  };

  const copy = () => {
    navigator.clipboard.writeText(sha256);
    toast({ title: "Copied!", description: "Hash value copied to clipboard." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Hash Master</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Cryptographic Fingerprint Tool</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-3xl border-none shadow-xl glass-panel">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Lock className="w-4 h-4 text-accent" /> Input Data</CardTitle>
           </CardHeader>
           <CardContent className="p-6 space-y-6">
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste data to hash..." className="min-h-[150px] font-mono border-none bg-muted/20 rounded-2xl p-6" />
              <Button onClick={generateHash} className="w-full h-12 bg-accent font-bold rounded-xl"><Fingerprint className="w-4 h-4 mr-2" /> Calculate SHA-256</Button>
           </CardContent>
        </Card>

        {sha256 && (
          <Card className="rounded-3xl border-none shadow-2xl bg-black text-green-500 p-8 space-y-4 animate-in slide-in-from-bottom-4">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">SHA-256 Hash Output</p>
                <Button size="icon" variant="ghost" className="text-green-500 hover:bg-green-500/10" onClick={copy}><Copy className="w-4 h-4" /></Button>
             </div>
             <p className="font-mono text-lg break-all leading-tight">{sha256}</p>
          </Card>
        )}
      </div>
    </div>
  );
}