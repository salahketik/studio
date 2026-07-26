'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Key, Copy, RefreshCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PasswordGenPage() {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const generate = () => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = lower;
    if (useUpper) chars += upper;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    let res = '';
    const array = new Uint32Array(length[0]);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length[0]; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    toast({ title: "Tersalin!", description: "Password aman telah disalin." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Password Pro</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Secure Local Randomness Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl">
           <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Key className="w-4 h-4 text-accent" /> Security Logic</CardTitle></CardHeader>
           <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                 <div className="flex justify-between items-center"><Label className="text-[10px] font-bold uppercase">Length: {length[0]}</Label></div>
                 <Slider value={length} onValueChange={setLength} min={8} max={64} step={1} />
              </div>
              <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between"><Label className="text-[10px] font-bold uppercase">Uppercase (A-Z)</Label><Switch checked={useUpper} onCheckedChange={setUseUpper} /></div>
                 <div className="flex items-center justify-between"><Label className="text-[10px] font-bold uppercase">Numbers (0-9)</Label><Switch checked={useNumbers} onCheckedChange={setUseNumbers} /></div>
                 <div className="flex items-center justify-between"><Label className="text-[10px] font-bold uppercase">Symbols (!@#)</Label><Switch checked={useSymbols} onCheckedChange={setUseSymbols} /></div>
              </div>
              <Button onClick={generate} className="w-full h-12 bg-accent font-bold rounded-xl"><RefreshCcw className="w-4 h-4 mr-2" /> Generate Now</Button>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl bg-accent text-white p-8 flex flex-col justify-between min-h-[300px]">
           <div className="space-y-2">
              <ShieldCheck className="w-10 h-10 opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Your Secure Password</p>
           </div>
           <div className="bg-white/10 p-6 rounded-2xl border border-white/20 break-all font-mono text-xl font-bold tracking-tighter">
              {password || '••••••••••••••••'}
           </div>
           <Button onClick={copy} variant="secondary" className="w-full h-12 font-bold rounded-xl" disabled={!password}><Copy className="w-4 h-4 mr-2" /> Copy to Clipboard</Button>
        </Card>
      </div>
    </div>
  );
}