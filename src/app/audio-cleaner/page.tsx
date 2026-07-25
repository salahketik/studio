'use client';

import { useState, useEffect, useRef } from 'react';
import { useAudioProcessor } from '@/features/audio-cleaner/hooks/use-audio-processor';
import { AudioUploader } from '@/features/audio-cleaner/components/audio-uploader';
import { StudioVisualizer } from '@/features/audio-cleaner/components/studio-visualizer';
import { AudioControls } from '@/features/audio-cleaner/components/audio-controls';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  Download, 
  Play, 
  Pause, 
  RefreshCcw, 
  Sparkles, 
  Loader2, 
  Settings2,
  ChevronLeft,
  Music,
  Video,
  CheckCircle2,
  Info,
  Waves
} from 'lucide-react';
import { defaultAudioSettings, type AudioSettings, type VisualizerMode } from '@/features/audio-cleaner/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AudioCleanerPage() {
  const { toast } = useToast();
  const { loadAudio, processAudio, exportAudio, reset, audioBuffer, processedBuffer, isProcessing, isLoading, duration } = useAudioProcessor();
  
  const [settings, setSettings] = useState<AudioSettings>(defaultAudioSettings);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'visualizer'>('editor');

  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleUpload = async (file: File) => {
    setAudioFile(file);
    try {
      await loadAudio(file);
      toast({ title: 'Audio Siap', description: 'Atur efek suara di tab Editor.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: 'Gagal memuat file audio.' });
    }
  };

  const handleProcess = async () => {
    if (!audioBuffer) return;
    if (isPlaying) {
      audioSource?.stop();
      setIsPlaying(false);
    }
    await processAudio(settings);
    toast({ title: 'Proses Selesai', description: 'Efek suara telah diperbarui.' });
  };

  const handleDownload = () => {
    if (!processedBuffer || !audioFile) return;
    const blob = exportAudio(processedBuffer);
    saveAs(blob, `studio_fx_${audioFile.name}`);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      audioSource?.stop();
      setIsPlaying(false);
    } else {
      const bufferToPlay = processedBuffer || audioBuffer;
      if (!bufferToPlay) {
        toast({ variant: 'destructive', title: "Audio Belum Siap", description: "Unggah file audio terlebih dahulu." });
        return;
      }
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const nodeAnalyser = ctx.createAnalyser();
      nodeAnalyser.fftSize = 512;
      
      const source = ctx.createBufferSource();
      source.buffer = bufferToPlay;
      
      const dest = ctx.createMediaStreamDestination();
      
      source.connect(nodeAnalyser);
      nodeAnalyser.connect(ctx.destination);
      nodeAnalyser.connect(dest);
      
      source.onended = () => {
        setIsPlaying(false);
        setAudioSource(null);
      };

      source.start(0);
      
      setAnalyser(nodeAnalyser);
      setAudioSource(source);
      setAudioStream(dest.stream);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      audioSource?.stop();
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, [audioSource]);

  return (
    <div className="min-h-full bg-background/50 py-6 px-4 sm:py-12 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-4 w-full justify-start mb-2 sm:mb-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
                <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
            </Button>
            <Badge variant="outline" className="text-xs text-accent border-accent/20 bg-accent/5 px-4 py-1 rounded-full">
              <Settings2 className="w-3.5 h-3.5 mr-2" />
              Advanced Audio Studio
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">Audio FX & Music Studio</h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Edit suara dengan profil studio dan buat visualisasi video reaktif berkualitas tinggi.
          </p>
        </div>

        {!audioBuffer && !isLoading ? (
          <div className="max-w-3xl mx-auto">
            <AudioUploader onUpload={handleUpload} />
          </div>
        ) : isLoading ? (
          <Card className="max-w-3xl mx-auto border-2 border-dashed border-accent/20 animate-pulse bg-accent/5">
            <CardContent className="flex flex-col items-center justify-center p-12 sm:p-20 space-y-6 text-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 sm:h-16 sm:h-16 text-accent animate-spin" />
                <Waves className="h-5 w-5 sm:h-6 sm:h-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-accent">Menganalisis Audio...</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">Harap tunggu sebentar, sistem sedang melakukan decoding waveform digital.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="xl:col-span-3">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="editor" className="rounded-xl font-bold gap-2 text-xs sm:text-sm">
                    <Music className="w-4 h-4" /> <span className="hidden sm:inline">Editor Suara</span><span className="sm:hidden">Editor</span>
                  </TabsTrigger>
                  <TabsTrigger value="visualizer" className="rounded-xl font-bold gap-2 text-xs sm:text-sm">
                    <Video className="w-4 h-4" /> <span className="hidden sm:inline">Visual Studio</span><span className="sm:hidden">Visual</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="mt-0 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
                  <Card className="glass-panel border-none shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-6 sm:p-10 space-y-6 sm:space-y-10">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                          <Button 
                            size="lg" 
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full shadow-2xl transition-all active:scale-90 border-4 border-white/20 bg-accent hover:bg-accent/90 shrink-0" 
                            onClick={togglePlay}
                            disabled={isProcessing || isLoading}
                          >
                            {isPlaying ? <Pause className="h-8 w-8 sm:h-10 sm:w-10" /> : <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1" />}
                          </Button>
                          <div className="space-y-1.5">
                            <p className="font-extrabold text-xl sm:text-2xl tracking-tight">Pratinjau Suara</p>
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{duration.toFixed(2)}s</span>
                              <Badge variant="secondary" className="bg-accent/10 text-accent border-none uppercase text-[9px] sm:text-[10px] tracking-widest px-3 font-bold">
                                {processedBuffer ? 'Teraplikasikan' : 'Original'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 bg-muted/30 p-2 rounded-3xl border border-white/10 w-full md:w-auto">
                          <Button variant="outline" className="flex-1 sm:flex-none rounded-2xl border-accent/20 h-11 sm:h-12 px-4 sm:px-6 hover:bg-accent/5 text-xs sm:text-sm" onClick={() => { audioSource?.stop(); reset(); setAudioFile(null); setIsPlaying(false); }}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Ganti File
                          </Button>
                          <Button className="flex-1 sm:flex-none rounded-2xl shadow-xl h-11 sm:h-12 px-4 sm:px-8 bg-accent hover:bg-accent/90 text-xs sm:text-sm" onClick={handleDownload} disabled={!processedBuffer || isProcessing}>
                            <Download className="mr-2 h-4 w-4" />
                            Simpan Audio
                          </Button>
                        </div>
                      </div>

                      <div className="bg-accent/5 border border-accent/20 p-4 sm:p-6 rounded-2xl flex gap-4">
                        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-bold text-accent">Tips Editor</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                            Pilih profil suara di panel sebelah kanan, lalu klik "Terapkan Efek Studio". Setelah terproses, Anda bisa memindahkan tab ke <strong>Visual Studio</strong> untuk merekam video musik.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="visualizer" className="mt-0 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
                  <Card className="glass-panel border-none shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <StudioVisualizer 
                        analyser={analyser} 
                        mode={settings.visualMode} 
                        isPlaying={isPlaying}
                        audioStream={audioStream || undefined}
                        sensitivity={settings.visualSensitivity}
                        bgImageUrl={settings.bgImageUrl}
                      />
                      <div className="p-4 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t bg-muted/10">
                         <div className="flex items-center gap-4 sm:gap-6">
                            <Button 
                              size="icon" 
                              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-accent shrink-0" 
                              onClick={togglePlay}
                              disabled={isProcessing || isLoading}
                            >
                              {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5" />}
                            </Button>
                            <div className="space-y-0.5">
                               <p className="text-xs sm:text-sm font-bold">Visual Studio Mode</p>
                               <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">Audio: {settings.profile}</p>
                            </div>
                         </div>
                         <div className="flex flex-wrap justify-center gap-2">
                            {(['bars', 'circle', 'pulse', 'wave'] as VisualizerMode[]).map((mode) => (
                              <Button
                                key={mode}
                                variant={settings.visualMode === mode ? 'secondary' : 'ghost'}
                                size="sm"
                                className={cn(
                                  "h-9 px-3 sm:px-4 rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
                                  settings.visualMode === mode && "bg-background shadow-lg text-accent"
                                )}
                                onClick={() => setSettings({ ...settings, visualMode: mode })}
                              >
                                {mode}
                              </Button>
                            ))}
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing || isLoading} />
              <Button onClick={handleProcess} className="w-full h-16 sm:h-20 text-lg sm:text-xl font-extrabold shadow-2xl rounded-3xl group relative overflow-hidden bg-accent hover:bg-accent/90 transition-all hover:scale-[1.02]" disabled={isProcessing || isLoading}>
                {isProcessing ? (
                  <><Loader2 className="mr-3 h-6 w-6 sm:h-8 sm:w-8 animate-spin" /> Rendering...</>
                ) : (
                  <><Sparkles className="mr-3 h-6 w-6 sm:h-8 sm:w-8 group-hover:rotate-12 transition-transform" /> Terapkan Efek</>
                )}
              </Button>
              {processedBuffer && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-[10px] sm:text-xs font-bold text-green-700">Efek Berhasil Diterapkan!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

