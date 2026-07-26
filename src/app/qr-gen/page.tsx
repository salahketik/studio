'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, QrCode, Download, RefreshCcw, Loader2, Link2, Info } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function QrGeneratorPage() {
  const { toast } = useToast();
  const [content, setContent] = useState('https://visual-suite.com');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const generateQr = () => {
    if (!content) return;
    setIsProcessing(true);
    
    // Using an open API for demo purposes as a pure client-side QR lib is large
    // In a production app, we would use 'qrcode' npm package
    const encoded = encodeURIComponent(content);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}`;
    
    setQrUrl(url);
    setIsProcessing(false);
    toast({ title: "Kode QR Dihasilkan", description: "Anda dapat mengunduh gambar sekarang." });
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    saveAs(blob, 'qrcode.png');
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">QR Code Maker</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Standard Contact & Link Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
          <CardHeader className="bg-muted/50 border-b py-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Link2 className="w-4 h-4 text-accent" /> Input Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">URL atau Teks</Label>
              <Input 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="https://..."
                className="h-12 rounded-xl"
              />
            </div>
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={generateQr} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <QrCode className="mr-2" />} Generate QR Code
            </Button>
            <div className="p-4 bg-accent/5 rounded-2xl flex gap-3">
               <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                 QR Code yang dihasilkan adalah tipe statis. Jika Anda memasukkan link, pastikan link tersebut permanen.
               </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-white">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-center">Output Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center gap-6">
            <div className="aspect-square w-full max-w-[250px] bg-muted/20 rounded-2xl flex items-center justify-center border-4 border-dashed">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-full h-full" />
              ) : (
                <QrCode className="w-16 h-16 opacity-10" />
              )}
            </div>
            {qrUrl && (
              <Button onClick={handleDownload} className="w-full bg-black text-white rounded-xl h-12">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
