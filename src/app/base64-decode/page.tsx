'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Database, Download, RefreshCcw, FileImage } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export default function Base64DecodePage() {
  const { toast } = useToast();
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const decode = () => {
    if (!base64) return;
    try {
      // Check if it's a valid data URI
      if (base64.startsWith('data:')) {
        setPreview(base64);
      } else {
        // Assume it's raw base64 and might be an image
        setPreview(`data:image/png;base64,${base64}`);
      }
      toast({ title: "Decoded!", description: "Pratinjau visual telah dimuat." });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal men-decode Base64.' });
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    saveAs(preview, `decoded_file_${Date.now()}.png`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Base64 Decoder</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">String to Media Converter</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        <Card className="rounded-3xl border-none shadow-xl flex flex-col overflow-hidden">
           <CardHeader className="bg-muted/50 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4" /> Input String</CardTitle>
              <Button size="sm" className="h-7 text-[9px] font-bold uppercase rounded-lg bg-accent" onClick={decode}>Decode</Button>
           </CardHeader>
           <Textarea value={base64} onChange={(e) => setBase64(e.target.value)} placeholder='Paste Base64 or Data URI here...' className="flex-grow font-mono text-[10px] p-6 border-none resize-none bg-muted/20" />
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden bg-card">
           <CardHeader className="bg-muted/30 border-b py-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-accent"><FileImage className="w-4 h-4" /> Visual Preview</CardTitle>
              {preview && <Button size="sm" variant="outline" className="h-7 text-[9px] font-bold uppercase" onClick={handleDownload}><Download className="w-3 h-3 mr-1" /> Download</Button>}
           </CardHeader>
           <CardContent className="flex-grow flex items-center justify-center p-8 bg-[url('https://placehold.co/10x10/eee/ddd')] bg-repeat">
              {preview ? (
                <img src={preview} alt="Decoded" className="max-w-full max-h-full object-contain shadow-2xl" />
              ) : (
                <div className="text-center opacity-20"><Database className="w-16 h-16 mx-auto mb-2" /><p className="font-black uppercase text-[10px]">Awaiting Data</p></div>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}