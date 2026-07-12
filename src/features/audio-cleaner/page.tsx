'use client';

import { useState, useEffect } from 'react';
import { useAudioProcessor } from '@/features/audio-cleaner/hooks/use-audio-processor';
import { AudioUploader } from '@/features/audio-cleaner/components/audio-uploader';
import { WaveformVisualizer } from '@/features/audio-cleaner/components/waveform-visualizer';
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
  Volume2,
  Mic2,
  Settings2,
  Music4
} from 'lucide-react';
import { defaultAudioSettings, type AudioSettings } from '@/features/audio-cleaner/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AudioCleanerPage() {
  const { toast } = useToast();
  const { loadAudio, processAudio, exportAudio, audioBuffer, processedBuffer, isProcessing, duration } = useAudioProcessor();
  
  const [settings, setSettings] = useState<AudioSettings>(defaultAudioSettings);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleUpload = async (file: File) => {
    setAudioFile(file);
    try {
      await loadAudio(file);
      toast({ title: 'Audio Siap', description: 'Gunakan preset studio atau kontrol manual untuk memproses audio Anda.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: 'Format file tidak didukung.' });
    }
  };

  const handleProcess = async () => {
    await processAudio(settings);
    toast({ title: 'Proses Selesai', description: 'Efek suara dan pembersihan telah diterapkan.' });
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
      const source = ctx.createBufferSource();
      source.buffer = processedBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
      setAudioSource(source);
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
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5 px-4 py-1">
            <Settings2 className="w-3.5 h-3.5 mr-2" />
            Voice FX & Studio Processor
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Audio FX Studio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transformasi vokal Anda dengan 20 profil suara unik atau bersihkan audio dengan kontrol DSP presisi tinggi.
          </p>
        </div>

        {!audioBuffer ? (
          <div className="max-w-3xl mx-auto">
            <AudioUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-panel border-none overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Music4 className="h-5 w-5 text-accent" />
                          Studio Monitoring
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                            <span>{duration.toFixed(2)}s</span>
                            <Badge variant="secondary" className="bg-accent/10 text-accent border-none">
                              {settings.profile.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                      </div>
                      <WaveformVisualizer buffer={processedBuffer} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
                      <div className="flex items-center gap-4">
                        <Button size="lg" className="h-16 w-16 rounded-full shadow-2xl bg-accent hover:bg-accent/90" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                        </Button>
                        <div className="space-y-1">
                          <p className="font-bold text-base">Playback Monitor</p>
                          <p className="text-sm text-muted-foreground">Dengar profil suara yang dipilih</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
                  <h4 className="font-bold text-accent mb-2">Tips Profil</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Setiap profil menggunakan kombinasi EQ, Distorsi, dan Kompresi unik. <strong>Robot</strong> menggunakan modulasi Q tinggi, sementara <strong>Underwater</strong> memotong semua frekuensi tinggi.
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h4 className="font-bold text-primary mb-2">Kontrol Manual</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pindah ke tab <strong>Manual</strong> untuk mengatur detail suara sendiri. <strong>Distortion</strong> memberikan karakter grit, sementara <strong>Echo</strong> memberikan ruang.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing} />
              <Button onClick={handleProcess} className="w-full h-16 text-xl font-bold shadow-2xl rounded-2xl group relative overflow-hidden bg-accent hover:bg-accent/90" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Rendering...</>
                ) : (
                  <><Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" /> Render Suara</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
