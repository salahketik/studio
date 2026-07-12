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
  MousePointer2,
  MonitorPlay,
  Share2
} from 'lucide-react';
import { defaultAudioSettings, type AudioSettings, type VisualizerMode } from '@/features/audio-cleaner/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AudioCleanerPage() {
  const { toast } = useToast();
  const { loadAudio, processAudio, exportAudio, reset, audioBuffer, processedBuffer, isProcessing, duration } = useAudioProcessor();
  
  const [settings, setSettings] = useState<AudioSettings>(defaultAudioSettings);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleUpload = async (file: File) => {
    setAudioFile(file);
    try {
      await loadAudio(file);
      toast({ title: 'Audio Siap', description: 'Gunakan profil studio untuk memproses suara Anda.' });
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
    toast({ title: 'Proses Selesai', description: 'Efek studio telah diterapkan.' });
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
      if (!processedBuffer) {
        toast({ title: "Belum Diproses", description: "Klik 'Terapkan Efek Studio' terlebih dahulu." });
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
      nodeAnalyser.smoothingTimeConstant = 0.82;
      
      const source = ctx.createBufferSource();
      source.buffer = processedBuffer;
      
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
    <div className="min-h-full bg-background/50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-4 w-full justify-start mb-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
            </Button>
            <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 px-4 py-1 rounded-full">
              <Settings2 className="w-3.5 h-3.5 mr-2" />
              Advanced Music Video Studio
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Audio FX & Visual Studio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transformasi suara dan buat video musik visual reaktif berkualitas tinggi dalam hitungan detik.
          </p>
        </div>

        {!audioBuffer ? (
          <div className="max-w-3xl mx-auto">
            <AudioUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="xl:col-span-3 space-y-8">
              <Card className="glass-panel border-none overflow-hidden shadow-2xl rounded-3xl">
                <CardContent className="p-0">
                  <StudioVisualizer 
                    analyser={analyser} 
                    mode={settings.visualMode} 
                    isPlaying={isPlaying}
                    audioStream={audioStream || undefined}
                    sensitivity={settings.visualSensitivity}
                    bgImageUrl={settings.bgImageUrl}
                  />
                  
                  <div className="p-8 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <Button 
                          size="lg" 
                          className={cn(
                            "h-20 w-20 md:h-24 md:w-24 rounded-full shadow-2xl transition-all active:scale-90 border-4 border-white/20",
                            processedBuffer ? "bg-accent hover:bg-accent/90" : "bg-muted"
                          )} 
                          onClick={togglePlay}
                          disabled={isProcessing}
                        >
                          {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
                        </Button>
                        <div className="space-y-1.5">
                          <p className="font-extrabold text-xl md:text-2xl tracking-tight">Master Playback</p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{duration.toFixed(2)}s</span>
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-none uppercase text-[10px] tracking-widest px-3 font-bold">
                              {settings.profile.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-2 rounded-3xl border border-white/10">
                        <div className="flex gap-1">
                          {(['bars', 'circle', 'pulse', 'wave'] as VisualizerMode[]).map((mode) => (
                            <Button
                              key={mode}
                              variant={settings.visualMode === mode ? 'secondary' : 'ghost'}
                              size="sm"
                              className={cn(
                                "h-10 px-4 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all",
                                settings.visualMode === mode && "bg-background shadow-lg text-accent"
                              )}
                              onClick={() => setSettings({ ...settings, visualMode: mode })}
                            >
                              {mode}
                            </Button>
                          ))}
                        </div>
                        
                        <div className="w-px h-8 bg-border/50 mx-2 hidden md:block"></div>
                        
                        <Button variant="outline" className="rounded-2xl border-accent/20 h-10 px-4 hover:bg-accent/5" onClick={() => { audioSource?.stop(); reset(); setAudioFile(null); setIsPlaying(false); }}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Ganti
                        </Button>
                        <Button className="rounded-2xl shadow-xl h-10 px-6 bg-accent hover:bg-accent/90" onClick={handleDownload} disabled={!processedBuffer || isProcessing}>
                          <Download className="mr-2 h-4 w-4" />
                          Simpan WAV
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4 bg-accent/20 rounded-2xl shrink-0 shadow-inner"><MonitorPlay className="w-8 h-8 text-accent" /></div>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-lg text-accent">Music Video AI</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Rekam visualisasi HD dengan audio yang sudah diproses untuk konten sosial media Anda.</p>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4 bg-primary/20 rounded-2xl shrink-0 shadow-inner"><Share2 className="w-8 h-8 text-primary" /></div>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-lg text-primary">Custom Background</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Unggah gambar brand Anda sebagai latar belakang visualizer untuk branding yang konsisten.</p>
                  </div>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-3xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4 bg-orange-500/20 rounded-2xl shrink-0 shadow-inner"><Sparkles className="w-8 h-8 text-orange-600" /></div>
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-lg text-orange-600">Reactive Motion</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Mesin visual kami menganalisis spektrum audio secara real-time untuk pergerakan yang mulus.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing} />
              <Button onClick={handleProcess} className="w-full h-20 text-xl font-extrabold shadow-2xl rounded-3xl group relative overflow-hidden bg-accent hover:bg-accent/90 transition-all hover:scale-[1.02]" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-3 h-8 w-8 animate-spin" /> Rendering Project...</>
                ) : (
                  <><Sparkles className="mr-3 h-8 w-8 group-hover:rotate-12 transition-transform" /> Terapkan Efek Studio</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
