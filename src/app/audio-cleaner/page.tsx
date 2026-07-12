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
  MousePointer2
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

  // Persistent Audio Context to prevent instability
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
    if (!audioBuffer) {
      toast({ variant: 'destructive', title: 'Belum Ada Audio', description: 'Silakan unggah file audio terlebih dahulu.' });
      return;
    }
    // Stop playback if processing new effects
    if (isPlaying) {
      audioSource?.stop();
      setIsPlaying(false);
    }
    await processAudio(settings);
    toast({ title: 'Proses Selesai', description: 'Efek studio telah diterapkan pada audio.' });
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
      
      // Initialize or resume AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Create stable routing: Source -> Analyser -> (Destination & MediaStream)
      const nodeAnalyser = ctx.createAnalyser();
      nodeAnalyser.fftSize = 512;
      nodeAnalyser.smoothingTimeConstant = 0.82; // Balanced smoothing
      
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
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
            </Button>
            <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 px-4 py-1">
              <Settings2 className="w-3.5 h-3.5 mr-2" />
              Advanced Voice FX Studio
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Audio FX Workstation</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ubah karakter suara dan buat visualisasi video reaktif profesional secara instan.
          </p>
        </div>

        {!audioBuffer ? (
          <div className="max-w-3xl mx-auto">
            <AudioUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="xl:col-span-3 space-y-6">
              <Card className="glass-panel border-none overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <StudioVisualizer 
                    analyser={analyser} 
                    mode={settings.visualMode} 
                    isPlaying={isPlaying}
                    audioStream={audioStream || undefined}
                  />
                  
                  <div className="p-6 md:p-8 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <Button 
                          size="lg" 
                          className={cn(
                            "h-16 w-16 md:h-20 md:w-20 rounded-full shadow-2xl transition-all active:scale-95",
                            processedBuffer ? "bg-accent hover:bg-accent/90" : "bg-muted cursor-not-allowed"
                          )} 
                          onClick={togglePlay}
                          disabled={isProcessing}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                        </Button>
                        <div className="space-y-1">
                          <p className="font-bold text-lg md:text-xl">Monitor Kontrol</p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-muted-foreground">{duration.toFixed(2)}s</span>
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-none uppercase text-[10px] tracking-widest px-2">
                              {settings.profile.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-muted p-1 rounded-xl flex gap-1">
                          {(['bars', 'circle', 'pulse', 'wave'] as VisualizerMode[]).map((mode) => (
                            <Button
                              key={mode}
                              variant={settings.visualMode === mode ? 'secondary' : 'ghost'}
                              size="sm"
                              className={cn(
                                "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                settings.visualMode === mode && "bg-background shadow-sm text-accent"
                              )}
                              onClick={() => setSettings({ ...settings, visualMode: mode })}
                            >
                              {mode}
                            </Button>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="rounded-xl border-accent/20 h-10 px-4" onClick={() => { audioSource?.stop(); reset(); setAudioFile(null); setIsPlaying(false); }}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Ganti
                        </Button>
                        <Button className="rounded-xl shadow-xl h-10 px-6" onClick={handleDownload} disabled={!processedBuffer || isProcessing}>
                          <Download className="mr-2 h-4 w-4" />
                          Unduh WAV
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2.5 bg-accent/20 rounded-xl shrink-0"><MousePointer2 className="w-5 h-5 text-accent" /></div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">Langkah 1</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Pilih profil suara di panel kanan, lalu klik "Terapkan Efek Studio".</p>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2.5 bg-primary/20 rounded-xl shrink-0"><Play className="w-5 h-5 text-primary" /></div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">Langkah 2</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Klik tombol Play besar di monitor untuk mulai memutar dan melihat visualizer.</p>
                  </div>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2.5 bg-orange-500/20 rounded-xl shrink-0"><Download className="w-5 h-5 text-orange-600" /></div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">Langkah 3</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Klik "Rekam Visual" di monitor saat memutar untuk mengunduh video visualisasi.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing} />
              <Button onClick={handleProcess} className="w-full h-16 text-xl font-bold shadow-2xl rounded-2xl group relative overflow-hidden bg-accent hover:bg-accent/90" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" /> Terapkan Efek Studio</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
