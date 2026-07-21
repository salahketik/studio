'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  Captions, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Download, 
  UploadCloud, 
  FileAudio,
  Type,
  ScrollText,
  FileCode
} from 'lucide-react';
import { runVoiceToSrtTranscription } from '@/app/actions';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function VoiceToSrtPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [srtData, setSrtData] = useState<{ srtContent: string, transcript: string } | null>(null);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
        toast({ variant: 'destructive', title: 'File tidak valid', description: 'Harap unggah file audio atau video.' });
        return;
      }
      setAudioFile(file);
      setSrtData(null);
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) return;
    setIsProcessing(true);
    
    try {
      const audioDataUri = await fileToDataUri(audioFile);
      const result = await runVoiceToSrtTranscription({ audioDataUri });
      
      if (result.error) throw new Error(result.error);
      
      if (result.srtContent && result.transcript) {
        setSrtData({ srtContent: result.srtContent, transcript: result.transcript });
        toast({ title: 'Transkripsi Selesai', description: 'Subtitle SRT telah berhasil dibuat oleh AI.' });
      }
    } catch (err) {
      toast({ 
        variant: 'destructive', 
        title: 'Error AI', 
        description: err instanceof Error ? err.message : 'Gagal memproses audio.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!srtData || !audioFile) return;
    const blob = new Blob([srtData.srtContent], { type: 'text/plain;charset=utf-8' });
    const fileName = audioFile.name.replace(/\.[^/.]+$/, "") + ".srt";
    saveAs(blob, fileName);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Voice to Subtitle (SRT)</h1>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-none uppercase text-[10px] px-2 font-bold">Powered by Gemini AI</Badge>
            </div>
            <p className="text-muted-foreground text-sm">Transkripsikan rekaman audio Anda menjadi file subtitle secara otomatis.</p>
          </div>
        </div>
      </div>

      {!audioFile ? (
        <Card className="border-2 border-dashed glass-panel">
          <CardContent className="flex flex-col items-center justify-center p-16 space-y-6 text-center">
            <div className="p-6 bg-purple-500/10 rounded-full">
              <Captions className="w-12 h-12 text-purple-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Unggah Audio Anda</h3>
              <p className="text-muted-foreground max-w-sm">Mendukung MP3, WAV, M4A, atau file Video. AI akan mendengarkan dan menuliskan subtitle untuk Anda.</p>
            </div>
            <input type="file" id="audio-upload" className="hidden" accept="audio/*,video/*" onChange={handleFileUpload} />
            <Button size="lg" className="rounded-2xl px-8 shadow-xl bg-purple-600 hover:bg-purple-700 font-bold" onClick={() => document.getElementById('audio-upload')?.click()}>
              Pilih File Media
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileAudio className="h-4 w-4 text-purple-600" />
                  File Terpilih
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-600">
                    <FileAudio className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{audioFile.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 font-bold shadow-lg" 
                    onClick={handleTranscribe} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menganalisis...</>
                    ) : (
                      <><Sparkles className="mr-2 h-5 w-5" /> Mulai Transkripsi AI</>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground" 
                    onClick={() => { setAudioFile(null); setSrtData(null); }}
                    disabled={isProcessing}
                  >
                    <UploadCloud className="mr-2 h-3 w-3" /> Ganti File
                  </Button>
                </div>

                <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-2xl space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-600">Info AI</h4>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">
                     Proses ini memakan waktu beberapa detik tergantung durasi audio. Gemini AI akan berusaha memberikan stempel waktu yang paling akurat.
                   </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden h-full flex flex-col min-h-[500px]">
              <Tabs defaultValue="preview" className="w-full flex flex-col flex-grow">
                <CardHeader className="border-b bg-muted/30 pb-0 pt-4 px-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-sm font-bold">Hasil Transkripsi</CardTitle>
                    {srtData && (
                      <Button size="sm" className="h-9 px-4 rounded-xl bg-accent hover:bg-accent/90" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" /> Simpan .SRT
                      </Button>
                    )}
                  </div>
                  <TabsList className="bg-transparent border-b-0 gap-6 h-10 p-0">
                    <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent shadow-none font-bold text-xs gap-2">
                      <Type className="w-3.5 h-3.5" /> Teks Narasi
                    </TabsTrigger>
                    <TabsTrigger value="srt" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent shadow-none font-bold text-xs gap-2">
                      <FileCode className="w-3.5 h-3.5" /> Format SRT
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="preview" className="flex-grow m-0 p-0">
                  <ScrollArea className="h-[400px] w-full p-6">
                    {!srtData && !isProcessing && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 opacity-40">
                        <ScrollText className="w-12 h-12" />
                        <p className="text-sm font-medium">Klik tombol "Mulai Transkripsi AI" untuk melihat hasilnya di sini.</p>
                      </div>
                    )}
                    {isProcessing && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                        <p className="text-sm font-bold text-purple-600 animate-pulse">AI sedang mendengarkan audio Anda...</p>
                      </div>
                    )}
                    {srtData && (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="leading-relaxed whitespace-pre-wrap">{srtData.transcript}</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="srt" className="flex-grow m-0 p-0">
                  <ScrollArea className="h-[400px] w-full bg-black/5 dark:bg-black/40 p-6 font-mono text-[11px]">
                    {!srtData && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                        <FileCode className="w-12 h-12 mb-4" />
                        <p>Kode stempel waktu SRT akan muncul di sini.</p>
                      </div>
                    )}
                    {srtData && (
                      <pre className="whitespace-pre-wrap text-purple-600 dark:text-purple-400">
                        {srtData.srtContent}
                      </pre>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
