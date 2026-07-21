
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  FileCode,
  Play,
  Pause,
  Plus,
  Trash2,
  Clock,
  Settings2,
  Keyboard,
  History
} from 'lucide-react';
import { runVoiceToSrtTranscription } from '@/app/actions';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface SubtitleBlock {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

export default function VoiceToSrtPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [srtData, setSrtData] = useState<{ srtContent: string, transcript: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  // Manual Editor State
  const [manualBlocks, setManualBlocks] = useState<SubtitleBlock[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      setAudioUrl(URL.createObjectURL(file));
      setSrtData(null);
      setManualBlocks([{ id: '1', start: 0, end: 5, text: '' }]);
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
      toast({ variant: 'destructive', title: 'Error AI', description: err instanceof Error ? err.message : 'Gagal memproses audio.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual Studio Logic
  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return date.toISOString().substr(11, 8) + ',' + ms;
  };

  const addBlock = () => {
    const lastBlock = manualBlocks[manualBlocks.length - 1];
    const startTime = lastBlock ? lastBlock.end + 0.5 : 0;
    const newBlock: SubtitleBlock = {
      id: Date.now().toString(),
      start: startTime,
      end: startTime + 3,
      text: ''
    };
    setManualBlocks([...manualBlocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<SubtitleBlock>) => {
    setManualBlocks(manualBlocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    if (manualBlocks.length <= 1) return;
    setManualBlocks(manualBlocks.filter(b => b.id !== id));
  };

  const generateManualSrt = () => {
    const content = manualBlocks
      .sort((a, b) => a.start - b.start)
      .map((b, i) => `${i + 1}\n${formatTime(b.start)} --> ${formatTime(b.end)}\n${b.text}\n`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, (audioFile?.name.replace(/\.[^/.]+$/, "") || "subtitle") + ".srt");
    toast({ title: 'Berhasil', description: 'File SRT manual telah disimpan.' });
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const setStartToCurrent = (id: string) => {
    updateBlock(id, { start: currentTime });
  };

  const setEndToCurrent = (id: string) => {
    updateBlock(id, { end: currentTime });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-7xl space-y-10 min-h-full bg-background/50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Subtitle Workstation</h1>
              <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 px-4 py-1 rounded-full">
                <Settings2 className="w-3 h-3 mr-2" />
                Advanced Editing
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">Otomatiskan dengan AI atau buat subtitle secara manual dengan presisi studio.</p>
          </div>
        </div>
      </div>

      {!audioFile ? (
        <Card className="border-2 border-dashed glass-panel">
          <CardContent className="flex flex-col items-center justify-center p-20 space-y-6 text-center">
            <div className="p-8 bg-accent/10 rounded-full animate-pulse">
              <Captions className="w-16 h-16 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Unggah Materi Media</h3>
              <p className="text-muted-foreground max-w-sm text-sm">Siapkan audio/video Anda. Pilih mode AI untuk kecepatan atau Manual untuk akurasi mutlak.</p>
            </div>
            <input type="file" id="audio-upload" className="hidden" accept="audio/*,video/*" onChange={handleFileUpload} />
            <Button size="lg" className="rounded-2xl px-10 shadow-2xl bg-accent hover:bg-accent/90 font-bold" onClick={() => document.getElementById('audio-upload')?.click()}>
              Pilih File Sekarang
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
          
          {/* Main Workspace */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="glass-panel border-none shadow-2xl rounded-3xl overflow-hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <div className="px-6 pt-6 border-b bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
                  <TabsList className="bg-muted/50 p-1 rounded-xl h-12">
                    <TabsTrigger value="ai" className="rounded-lg font-bold px-6 gap-2">
                      <Sparkles className="w-4 h-4" /> AI Auto
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="rounded-lg font-bold px-6 gap-2">
                      <Keyboard className="w-4 h-4" /> Manual Studio
                    </TabsTrigger>
                  </TabsList>
                  
                  {activeTab === 'manual' && (
                    <div className="flex items-center gap-2">
                      <Button onClick={addBlock} variant="outline" className="rounded-xl border-accent/30 text-accent font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Baris Baru
                      </Button>
                      <Button onClick={generateManualSrt} className="rounded-xl bg-accent hover:bg-accent/90 font-bold shadow-lg">
                        <Download className="w-4 h-4 mr-2" /> Ekspor SRT
                      </Button>
                    </div>
                  )}
                </div>

                <TabsContent value="ai" className="m-0">
                  <ScrollArea className="h-[600px] w-full p-8">
                    {!srtData && !isProcessing && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 opacity-40">
                        <Sparkles className="w-16 h-16" />
                        <div className="space-y-2">
                          <p className="text-xl font-black uppercase tracking-widest">AI Standby</p>
                          <p className="max-w-xs mx-auto text-xs">Klik "Mulai Transkripsi AI" di panel samping untuk memproses suara secara otomatis.</p>
                        </div>
                      </div>
                    )}
                    {isProcessing && (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-accent" />
                        <div className="space-y-2">
                          <p className="text-xl font-black text-accent animate-pulse uppercase tracking-widest">AI Menganalisis...</p>
                          <p className="text-xs text-muted-foreground">Gemini sedang mendengarkan dan menuliskan subtitle untuk Anda.</p>
                        </div>
                      </div>
                    )}
                    {srtData && (
                      <div className="space-y-8 animate-in slide-in-from-bottom-4">
                         <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                           <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                             <Type className="w-4 h-4" /> Teks Naratif
                           </h4>
                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{srtData.transcript}</p>
                         </div>
                         <div className="p-6 bg-black/5 rounded-2xl font-mono text-[11px]">
                           <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                             <FileCode className="w-4 h-4" /> Format SRT Mentah
                           </h4>
                           <pre className="text-accent dark:text-accent-foreground/70">{srtData.srtContent}</pre>
                         </div>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="manual" className="m-0">
                  <div className="flex flex-col h-[600px]">
                    <div className="p-4 bg-accent/5 border-b flex items-center justify-center gap-6">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-14 w-14 rounded-full bg-accent text-white shadow-xl hover:scale-105 transition-transform"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                      </Button>
                      <div className="text-center">
                        <p className="text-3xl font-black font-mono tracking-tighter text-accent">{formatTime(currentTime)}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Waktu Sekarang</p>
                      </div>
                      <audio 
                        ref={audioRef} 
                        src={audioUrl || ''} 
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                    </div>
                    
                    <ScrollArea className="flex-grow p-6">
                      <div className="space-y-4 pb-20">
                        {manualBlocks.map((block, index) => (
                          <div key={block.id} className="group relative bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-accent/30">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold border">
                              {index + 1}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              <div className="md:col-span-4 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Mulai</Label>
                                  <div className="flex gap-1">
                                    <Input 
                                      type="number" 
                                      step="0.1"
                                      value={block.start} 
                                      onChange={(e) => updateBlock(block.id, { start: parseFloat(e.target.value) })}
                                      className="h-9 text-xs font-mono"
                                    />
                                    <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => setStartToCurrent(block.id)} title="Gunakan waktu sekarang">
                                      <Clock className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Selesai</Label>
                                  <div className="flex gap-1">
                                    <Input 
                                      type="number" 
                                      step="0.1"
                                      value={block.end} 
                                      onChange={(e) => updateBlock(block.id, { end: parseFloat(e.target.value) })}
                                      className="h-9 text-xs font-mono"
                                    />
                                    <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => setEndToCurrent(block.id)} title="Gunakan waktu sekarang">
                                      <Clock className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="md:col-span-7 space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Isi Subtitle</Label>
                                <Textarea 
                                  placeholder="Ketik apa yang terdengar..." 
                                  value={block.text}
                                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                                  className="min-h-[82px] text-sm leading-relaxed resize-none rounded-xl"
                                />
                              </div>
                              <div className="md:col-span-1 pt-6 flex justify-end">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-destructive hover:bg-destructive/10 rounded-full"
                                  onClick={() => removeBlock(block.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileAudio className="h-4 w-4 text-accent" />
                  Media Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-accent/20 rounded-xl text-accent">
                    <FileAudio className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{audioFile.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {audioFile.type.split('/')[1].toUpperCase()}</p>
                  </div>
                </div>

                {activeTab === 'ai' ? (
                  <div className="space-y-4">
                    <Button 
                      className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/90 font-bold text-lg shadow-xl" 
                      onClick={handleTranscribe} 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Menganalisis...</>
                      ) : (
                        <><Sparkles className="mr-2 h-6 w-6" /> Auto AI Transcribe</>
                      )}
                    </Button>
                    {srtData && (
                       <Button variant="outline" className="w-full h-12 rounded-xl border-accent/20" onClick={() => {
                          const blob = new Blob([srtData.srtContent], { type: 'text/plain;charset=utf-8' });
                          saveAs(blob, audioFile.name.replace(/\.[^/.]+$/, "") + ".srt");
                       }}>
                         <Download className="mr-2 h-4 w-4" /> Simpan Hasil AI
                       </Button>
                    )}
                  </div>
                ) : (
                  <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl space-y-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                        <Keyboard className="w-3 h-3" /> Manual Shortcuts
                     </h4>
                     <ul className="space-y-2">
                        <li className="flex justify-between text-[10px]">
                           <span className="text-muted-foreground">Tambah Baris</span>
                           <span className="font-mono bg-muted px-1.5 rounded">Enter (di teks)</span>
                        </li>
                        <li className="flex justify-between text-[10px]">
                           <span className="text-muted-foreground">Putar/Jeda</span>
                           <span className="font-mono bg-muted px-1.5 rounded">Space</span>
                        </li>
                     </ul>
                     <p className="text-[10px] text-muted-foreground leading-relaxed italic border-t pt-3">
                       Tips: Gunakan tombol jam (icon clock) untuk menangkap waktu saat Anda mendengar suara tertentu agar timing lebih akurat.
                     </p>
                  </div>
                )}

                <Button 
                  variant="ghost" 
                  className="w-full text-xs text-muted-foreground" 
                  onClick={() => { setAudioFile(null); setSrtData(null); setAudioUrl(null); }}
                  disabled={isProcessing}
                >
                  <UploadCloud className="mr-2 h-3 w-3" /> Ganti Materi Media
                </Button>
              </CardContent>
            </Card>

            {/* AI Logs / History */}
            <Card className="rounded-3xl border-none shadow-lg">
               <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <History className="w-3 h-3" /> Alur Kerja
                  </CardTitle>
               </CardHeader>
               <CardContent className="text-[10px] text-muted-foreground space-y-3">
                  <div className="flex gap-3">
                     <div className="w-1 bg-accent/20 rounded-full" />
                     <p>Browser melakukan buffering media lokal untuk akses instan.</p>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-1 bg-accent/20 rounded-full" />
                     <p>Pemrosesan SRT mengikuti standar ITU-R BT.1771.</p>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-1 bg-accent/20 rounded-full" />
                     <p>Format output kompatibel dengan YouTube, Premiere, dan VLC.</p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
