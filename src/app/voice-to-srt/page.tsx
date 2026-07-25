'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  Captions, 
  ChevronLeft, 
  Download, 
  UploadCloud, 
  FileAudio,
  Type,
  Play,
  Pause,
  Plus,
  Trash2,
  Clock,
  Settings2,
  Keyboard,
  Info,
  History,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SubtitleBlock {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

export default function VoiceToSrtPage() {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Subtitle Workstation State
  const [manualBlocks, setManualBlocks] = useState<SubtitleBlock[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
        toast({ variant: 'destructive', title: 'File tidak valid', description: 'Harap unggah file audio atau video.' });
        return;
      }
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setManualBlocks([{ id: '1', start: 0, end: 5, text: '' }]);
      
      toast({ 
        title: 'Materi Dimuat', 
        description: 'Mulai putar audio dan tambahkan baris subtitle sesuai kebutuhan.' 
      });
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return date.toISOString().substr(11, 8) + ',' + ms;
  };

  const addBlock = () => {
    const lastBlock = manualBlocks[manualBlocks.length - 1];
    const startTime = lastBlock ? lastBlock.end + 0.1 : 0;
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
    if (manualBlocks.length <= 1) {
      toast({ variant: 'destructive', title: 'Minimal 1 baris', description: 'Anda tidak bisa menghapus semua baris subtitle.' });
      return;
    }
    setManualBlocks(manualBlocks.filter(b => b.id !== id));
  };

  const generateManualSrt = () => {
    if (manualBlocks.some(b => !b.text.trim())) {
      toast({ variant: 'destructive', title: 'Teks Kosong', description: 'Pastikan semua baris subtitle memiliki teks.' });
      return;
    }

    const content = manualBlocks
      .sort((a, b) => a.start - b.start)
      .map((b, i) => `${i + 1}\n${formatTime(b.start)} --> ${formatTime(b.end)}\n${b.text}\n`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, (audioFile?.name.replace(/\.[^/.]+$/, "") || "subtitle") + ".srt");
    toast({ title: 'Berhasil Ekspor', description: 'File SRT telah berhasil diunduh.' });
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

  // Cleanup effect for URL
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div className="min-h-full bg-background/50 py-6 px-4 sm:py-10 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
              <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
            </Button>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Subtitle Workstation</h1>
                <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 px-4 py-1 rounded-full">
                  <Settings2 className="w-3 h-3 mr-2" />
                  Manual Mode (No AI)
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">Buat subtitle secara manual dengan presisi stempel waktu milidetik.</p>
            </div>
          </div>
        </div>

        {!audioFile ? (
          <Card className="border-2 border-dashed glass-panel">
            <CardContent className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-6 text-center">
              <div className="p-6 sm:p-8 bg-accent/10 rounded-full animate-pulse">
                <Captions className="w-12 h-12 sm:w-16 sm:h-16 text-accent" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Mulai Project Subtitle</h3>
                <p className="text-muted-foreground max-w-sm text-xs sm:text-sm">Unggah file audio atau video untuk mulai membuat subtitle secara manual. Semua proses dilakukan lokal di browser Anda.</p>
              </div>
              <input type="file" id="audio-upload" className="hidden" accept="audio/*,video/*" onChange={handleFileUpload} />
              <Button size="lg" className="rounded-2xl px-8 sm:px-10 shadow-2xl bg-accent hover:bg-accent/90 font-bold" onClick={() => document.getElementById('audio-upload')?.click()}>
                <UploadCloud className="mr-2 h-5 w-5" /> Pilih Materi Media
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
            
            {/* Main Editing Area */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="glass-panel border-none shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[650px] sm:h-[750px]">
                <div className="px-4 sm:px-6 pt-6 border-b bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg"><Keyboard className="w-5 h-5 text-accent" /></div>
                    <h2 className="font-bold">Subtitle Editor Studio</h2>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button onClick={addBlock} variant="outline" className="flex-1 sm:flex-none rounded-xl border-accent/30 text-accent font-bold h-10">
                      <Plus className="w-4 h-4 sm:mr-2" /> Baris Baru
                    </Button>
                    <Button onClick={generateManualSrt} className="flex-1 sm:flex-none rounded-xl bg-accent hover:bg-accent/90 font-bold shadow-lg h-10">
                      <Download className="w-4 h-4 sm:mr-2" /> Ekspor SRT
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-accent/5 border-b flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 py-6">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-accent text-white shadow-xl hover:scale-105 transition-transform shrink-0"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="h-6 w-6 sm:h-8 sm:w-8" /> : <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-1" />}
                  </Button>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-black font-mono tracking-tighter text-accent leading-none">{formatTime(currentTime)}</p>
                    <p className="text-[10px] sm:text-[11px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Playback Timer</p>
                  </div>
                  <audio 
                    ref={audioRef} 
                    src={audioUrl || ''} 
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
                
                <ScrollArea className="flex-grow p-4 sm:p-8">
                  <div className="space-y-6 pb-20">
                    {manualBlocks.map((block, index) => (
                      <div key={block.id} className="group relative bg-card border rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-accent/40">
                        <div className="absolute -left-2 sm:-left-3 top-6 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          <div className="md:col-span-4 grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                                <Timer className="w-3 h-3" /> Waktu Mulai
                              </Label>
                              <div className="flex gap-2">
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  value={block.start} 
                                  onChange={(e) => updateBlock(block.id, { start: parseFloat(e.target.value) })}
                                  className="h-10 text-xs font-mono rounded-xl"
                                />
                                <Button size="icon" variant="secondary" className="h-10 w-10 shrink-0 rounded-xl" onClick={() => setStartToCurrent(block.id)} title="Gunakan waktu sekarang">
                                  <Clock className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                                <Timer className="w-3 h-3" /> Waktu Selesai
                              </Label>
                              <div className="flex gap-2">
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  value={block.end} 
                                  onChange={(e) => updateBlock(block.id, { end: parseFloat(e.target.value) })}
                                  className="h-10 text-xs font-mono rounded-xl"
                                />
                                <Button size="icon" variant="secondary" className="h-10 w-10 shrink-0 rounded-xl" onClick={() => setEndToCurrent(block.id)} title="Gunakan waktu sekarang">
                                  <Clock className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-7 space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                              <Type className="w-3 h-3" /> Teks Subtitle
                            </Label>
                            <Textarea 
                              placeholder="Masukkan narasi yang terdengar..." 
                              value={block.text}
                              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                              className="min-h-[120px] text-sm leading-relaxed resize-none rounded-xl p-4"
                            />
                          </div>
                          <div className="md:col-span-1 pt-8 flex justify-end">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-destructive hover:bg-destructive/10 rounded-full h-10 w-10"
                              onClick={() => removeBlock(block.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>

            {/* Sidebar Support Area */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b py-4">
                  <CardTitle className="text-xs sm:text-sm font-bold flex items-center gap-2">
                    <FileAudio className="h-4 w-4 text-accent" />
                    Detail File Lokal
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

                  <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl space-y-4">
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" /> Panduan Manual
                     </h4>
                     <ul className="space-y-3">
                        <li className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
                           <span className="text-accent font-bold">1.</span>
                           Klik tombol jam (<Clock className="w-3 h-3 inline" />) untuk mengisi waktu otomatis berdasarkan posisi pemutaran audio.
                        </li>
                        <li className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
                           <span className="text-accent font-bold">2.</span>
                           Pastikan waktu mulai lebih kecil dari waktu selesai agar SRT valid.
                        </li>
                        <li className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
                           <span className="text-accent font-bold">3.</span>
                           Gunakan tombol "Baris Baru" untuk menambahkan transkrip selanjutnya.
                        </li>
                     </ul>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full text-xs text-muted-foreground h-11 rounded-xl" 
                    onClick={() => { setAudioFile(null); setAudioUrl(null); }}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" /> Ganti Materi Media
                  </Button>
                </CardContent>
              </Card>

              {/* Technical Logs */}
              <Card className="rounded-3xl border-none shadow-lg">
                 <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                       <History className="w-3.5 h-3.5" /> Log Aktivitas
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="text-[11px] text-muted-foreground space-y-3 pb-6">
                    <div className="flex gap-3">
                       <div className="w-1 bg-accent/30 rounded-full" />
                       <p>Pemrosesan lokal aktif. Tidak ada data yang dikirim ke AI Cloud.</p>
                    </div>
                    <div className="flex gap-3">
                       <div className="w-1 bg-accent/30 rounded-full" />
                       <p>Sinkronisasi waktu presisi hingga 2 digit desimal (milidetik).</p>
                    </div>
                    <div className="flex gap-3">
                       <div className="w-1 bg-accent/30 rounded-full" />
                       <p>Format output UTF-8 standar (.srt).</p>
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
