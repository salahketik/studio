'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Activity, RefreshCcw, FileImage, Info } from 'lucide-react';
import Link from 'next/link';
import { ImageUploader } from '@/features/image-converter/components/image-uploader';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function HistogramPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      analyzeHistogram(URL.createObjectURL(file));
    }
  };

  const analyzeHistogram = (url: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const rHist = new Array(256).fill(0);
      const gHist = new Array(256).fill(0);
      const bHist = new Array(256).fill(0);

      for (let i = 0; i < imageData.length; i += 4) {
        rHist[imageData[i]]++;
        gHist[imageData[i + 1]]++;
        bHist[imageData[i + 2]]++;
      }

      const chartData = Array.from({ length: 256 }, (_, i) => ({
        value: i,
        red: rHist[i],
        green: gHist[i],
        blue: bHist[i]
      }));

      setData(chartData);
      setIsProcessing(false);
      toast({ title: "Analisis Selesai", description: "Data histogram warna telah dihasilkan." });
    };
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full"><Link href="/"><ChevronLeft className="h-6 w-6" /></Link></Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Histogram Tonal</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Image Color Distribution Analytics</p>
        </div>
      </div>

      {!originalImage ? (
        <ImageUploader onUpload={handleUpload} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl glass-panel overflow-hidden">
              <CardHeader className="bg-muted/50 border-b py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><FileImage className="w-4 h-4 text-accent" /> Sumber Citra</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                 <img src={originalImage.url} alt="Source" className="max-h-60 mx-auto rounded-xl shadow-lg mb-6" />
                 <Button variant="ghost" className="w-full text-xs" onClick={() => setOriginalImage(null)}><RefreshCcw className="mr-2 h-3 w-3" /> Ganti Gambar</Button>
              </CardContent>
            </Card>
            <div className="p-6 bg-accent/5 rounded-3xl border border-accent/20 flex gap-4">
               <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
               <p className="text-[11px] text-muted-foreground leading-relaxed italic">Histogram menunjukkan distribusi piksel dari 0 (gelap) hingga 255 (terang) untuk setiap saluran warna primer.</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
             <Card className="rounded-3xl border-none shadow-2xl overflow-hidden bg-card">
                <CardHeader className="bg-muted/30 border-b py-4">
                   <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-accent"><Activity className="w-4 h-4" /> Distribusi RGB</CardTitle>
                </CardHeader>
                <CardContent className="p-6 h-[500px]">
                   {isProcessing ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-20">
                         <RefreshCcw className="w-10 h-10 animate-spin mb-4" />
                         <p className="font-black uppercase text-xs">Menganalisis Node...</p>
                      </div>
                   ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="value" hide />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="red" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="green" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="blue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                   )}
                </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}