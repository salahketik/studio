
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  Copy, 
  RefreshCcw, 
  FileImage, 
  Loader2,
  Terminal,
  Braces
} from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { Textarea } from '@/components/ui/textarea';

export default function Base64ToolPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setOriginalImage({ file, url });
      
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64String(reader.result as string);
        setIsProcessing(false);
        toast({ title: "Konversi Selesai", description: "String Base64 telah dihasilkan." });
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    if (!base64String) return;
    navigator.clipboard.writeText(base64String);
    toast({ title: "Tersalin!", description: "String Base64 telah disalin ke papan klip." });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight uppercase">Base64 Tool</h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Image to Data URI Converter</p>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl overflow-hidden glass-panel">
              <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-accent" /> Pratinjau
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="aspect-square relative rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center p-4">
                  <img src={originalImage.url} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-2xl space-y-2">
                   <p className="text-[10px] font-black text-accent uppercase tracking-widest">Detail File</p>
                   <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-muted-foreground">Ukuran:</span>
                      <span>{(originalImage.file.size / 1024).toFixed(2)} KB</span>
                   </div>
                </div>
              </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest text-muted-foreground" onClick={() => { setOriginalImage(null); setBase64String(''); }}>
              <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar
            </Button>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden h-full flex flex-col">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
                  <div className="flex items-center gap-2"><Braces className="w-4 h-4 text-accent" /> Base64 Data URI</div>
                  <Button size="sm" variant="outline" className="h-8 rounded-xl text-[9px] font-black uppercase tracking-widest" onClick={copyToClipboard}>
                     <Copy className="w-3 h-3 mr-2" /> Salin Kode
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-accent" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Encoding Assets...</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col gap-4">
                    <Textarea 
                      readOnly 
                      value={base64String}
                      className="flex-grow font-mono text-[10px] leading-relaxed bg-black/5 border-none resize-none p-6 rounded-2xl h-[450px]"
                    />
                    <div className="p-4 bg-muted/50 rounded-2xl border flex items-center gap-3">
                       <Terminal className="w-4 h-4 text-muted-foreground" />
                       <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                         String ini dapat digunakan langsung dalam atribut src pada tag img atau dalam CSS background-image.
                       </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
