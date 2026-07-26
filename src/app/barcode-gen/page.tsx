'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { ChevronLeft, Barcode, Download, RefreshCcw, Info } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BarcodeGenPage() {
  const { toast } = useToast();
  const [content, setContent] = useState('1234567890');
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);

  const generateBarcode = () => {
    if (!content) return;
    // Using bwip-js API for demo purposes as full library is heavy
    const url = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(content)}&scale=3&rotate=N&includetext`;
    setBarcodeUrl(url);
    toast({ title: "Barcode Dihasilkan", description: "Format Code128 telah dibuat secara visual." });
  };

  const handleDownload = async () => {
    if (!barcodeUrl) return;
    const response = await fetch(barcodeUrl);
    const blob = await response.blob();
    saveAs(blob, `barcode_${content}.png`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Barcode Maker</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Standard Retail Code128 Generator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-none shadow-xl glass-panel">
          <CardHeader className="bg-muted/50 border-b py-4"><CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Barcode className="w-4 h-4 text-accent" /> Data Input</CardTitle></CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Kode Produk / Teks</Label>
              <Input value={content} onChange={(e) => setContent(e.target.value)} className="h-12 rounded-xl" />
            </div>
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold" onClick={generateBarcode}>Generate Barcode</Button>
            <div className="p-4 bg-accent/5 rounded-2xl flex gap-3">
               <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
               <p className="text-[10px] text-muted-foreground leading-relaxed italic">Gunakan karakter alfanumerik standar. Barcode Code128 mendukung karakter ASCII secara luas.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-2xl bg-white p-8 flex flex-col items-center justify-center gap-6">
           {barcodeUrl ? (
             <>
               <img src={barcodeUrl} alt="Barcode" className="max-w-full" />
               <Button onClick={handleDownload} className="w-full bg-black text-white rounded-xl h-12"><Download className="mr-2 h-4 w-4" /> Download PNG</Button>
             </>
           ) : (
             <div className="text-center opacity-20"><Barcode className="w-20 h-20 mx-auto" /><p className="font-black uppercase text-[10px] mt-4">Awaiting Input</p></div>
           )}
        </Card>
      </div>
    </div>
  );
}