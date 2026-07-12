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
  Info
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
      toast({ title: 'Audio Siap', description: 'Gunakan kontrol studio untuk membersihkan rekaman Anda.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: 'Format file tidak didukung.' });
    }
  };

  const handleProcess = async () => {
    await processAudio(settings);
    toast({ title: 'Proses Selesai', description: 'Filter DSP telah diterapkan secara real-time.' });
  };

  const handleDownload = () => {
    if (!processedBuffer || !audioFile) return;
    const blob = exportAudio(processedBuffer);
    saveAs(blob, `studio_clean_${audioFile.name}`);
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
            <Mic2 className="w-3.5 h-3.5 mr-2" />
            Audio Restoration Engine
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Audio Cleaner Studio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hapus noise latar belakang, perhalus vokal, dan tingkatkan kejernihan audio Anda dengan teknologi DSP tingkat profesional.
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
                          <Volume2 className="h-5 w-5 text-accent" />
                          Master Visualizer
                        </h3>
                        <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                            <span>Format: WAV / Lossless</span>
                            <span>{duration.toFixed(2)}s</span>
                        </div>
                      </div>
                      <WaveformVisualizer buffer={processedBuffer} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
                      <div className="flex items-center gap-3">
                        <Button size="lg" className="h-14 w-14 rounded-full shadow-xl" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </Button>
                        <div className="space-y-1">
                          <p className="font-bold text-sm">Pratinjau Hasil</p>
                          <p className="text-xs text-muted-foreground">Dengarkan perubahan secara instan</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl border-accent/20" onClick={() => window.location.reload()}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Ganti File
                        </Button>
                        <Button className="rounded-xl shadow-lg" onClick={handleDownload} disabled={!processedBuffer || isProcessing}>
                          <Download className="mr-2 h-4 w-4" />
                          Ekspor WAV
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 flex gap-5 items-start">
                <div className="bg-primary/20 p-2 rounded-lg">
                    <Info className="h-6 w-6 text-accent shrink-0" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-accent text-lg">Panduan Studio</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gunakan <strong>High-Pass</strong> untuk memotong gemuruh AC, <strong>Low-Pass</strong> untuk meredam desis listrik, dan <strong>Compression</strong> untuk menyeimbangkan vokal yang dinamis. Pastikan untuk menekan "Terapkan" setelah setiap perubahan pengaturan.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing} />
              <Button onClick={handleProcess} className="w-full h-16 text-xl font-bold shadow-2xl rounded-2xl group relative overflow-hidden" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Memproses...</>
                ) : (
                  <><Sparkles className="mr-3 h-6 w-6 group-hover:animate-pulse" /> Terapkan Master</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}