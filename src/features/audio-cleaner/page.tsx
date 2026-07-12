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
  Music4,
  Layers,
  Layout
} from 'lucide-react';
import { defaultAudioSettings, type AudioSettings, type VisualizerMode } from '@/features/audio-cleaner/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AudioCleanerPage() {
  const { toast } = useToast();
  const { loadAudio, processAudio, exportAudio, audioBuffer, processedBuffer, isProcessing, duration } = useAudioProcessor();
  
  const [settings, setSettings] = useState<AudioSettings>(defaultAudioSettings);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleUpload = async (file: File) => {
    setAudioFile(file);
    try {
      await loadAudio(file);
      toast({ title: 'Audio Siap', description: 'Gunakan preset studio dan visualizer untuk memproses audio Anda.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: 'Format file tidak didukung.' });
    }
  };

  const handleProcess = async () => {
    await processAudio(settings);
    toast({ title: 'Proses Selesai', description: 'Efek suara dan visualisasi telah diperbarui.' });
  };

  const handleDownload = () => {
    if (!processedBuffer || !audioFile) return;
    const blob = exportAudio(processedBuffer);
    saveAs(blob, `fx_studio_${audioFile.name}`);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioSource?.stop();
      setIsPlaying(false);
    } else {
      if (!processedBuffer) return;
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const nodeAnalyser = ctx.createAnalyser();
      nodeAnalyser.fftSize = 256;
      
      const source = ctx.createBufferSource();
      source.buffer = processedBuffer;
      
      const dest = ctx.createMediaStreamDestination();
      
      source.connect(nodeAnalyser);
      nodeAnalyser.connect(ctx.destination);
      nodeAnalyser.connect(dest);
      
      source.onended = () => setIsPlaying(false);
      source.start(0);
      
      setAudioCtx(ctx);
      setAnalyser(nodeAnalyser);
      setAudioSource(source);
      setAudioStream(dest.stream);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      audioSource?.stop();
    };
  }, [audioSource]);

  return (
    <div className="min-h-full bg-background/50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 px-4 py-1">
            <Settings2 className="w-3.5 h-3.5 mr-2" />
            Voice FX & Video Visualizer Studio
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Advanced Audio FX</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transformasi audio Anda, bersihkan noise, dan buat video visualisasi reaktif profesional secara instan.
          </p>
        </div>

        {!audioBuffer ? (
          <div className="max-w-3xl mx-auto">
            <AudioUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in fade-in duration-700">
            <div className="xl:col-span-3 space-y-6">
              <Card className="glass-panel border-none overflow-hidden shadow-2xl">
                <CardContent className="p-0">
                  <StudioVisualizer 
                    analyser={analyser} 
                    mode={settings.visualMode} 
                    isPlaying={isPlaying}
                    audioStream={audioStream || undefined}
                  />
                  
                  <div className="p-8 space-y-8">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <Button size="lg" className="h-20 w-20 rounded-full shadow-2xl bg-accent hover:bg-accent/90 transition-transform active:scale-95" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="h-9 w-9 ml-1" />}
                        </Button>
                        <div className="space-y-1">
                          <p className="font-bold text-xl">Playback Control</p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-muted-foreground">{duration.toFixed(2)}s</span>
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-none uppercase text-[10px] tracking-widest">
                              {settings.profile.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-muted p-1 rounded-xl flex gap-1 mr-4">
                          {(['bars', 'circle', 'pulse', 'wave'] as VisualizerMode[]).map((mode) => (
                            <Button
                              key={mode}
                              variant={settings.visualMode === mode ? 'secondary' : 'ghost'}
                              size="sm"
                              className={cn(
                                "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                settings.visualMode === mode && "bg-white shadow-sm text-accent"
                              )}
                              onClick={() => setSettings({ ...settings, visualMode: mode })}
                            >
                              {mode}
                            </Button>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="rounded-xl border-accent/20 h-12" onClick={() => window.location.reload()}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Ganti
                        </Button>
                        <Button className="rounded-xl shadow-xl h-12 px-6" onClick={handleDownload} disabled={!processedBuffer || isProcessing}>
                          <Download className="mr-2 h-4 w-4" />
                          Simpan WAV
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-accent/20 rounded-full"><Layout className="w-6 h-6 text-accent" /></div>
                  <h4 className="font-bold text-accent">Video Render</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Klik <strong>Rekam Video</strong> saat memutar audio untuk mengunduh visualisasi sebagai file video (.webm).
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-full"><Layers className="w-6 h-6 text-primary" /></div>
                  <h4 className="font-bold text-primary">Multi-FX Chain</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Preset menggunakan rantai DSP kompleks: HPF > LPF > Distortion > Comp > Delay > Gain.
                  </p>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-full"><Music4 className="w-6 h-6 text-orange-600" /></div>
                  <h4 className="font-bold text-orange-600">Audio Fidelity</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Pemrosesan 16-bit 44.1kHz memastikan hasil ekspor tetap berkualitas tinggi tanpa artefak digital.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing} />
              <Button onClick={handleProcess} className="w-full h-16 text-xl font-bold shadow-2xl rounded-2xl group relative overflow-hidden bg-accent hover:bg-accent/90" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Rendering FX...</>
                ) : (
                  <><Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" /> Terapkan Studio FX</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
