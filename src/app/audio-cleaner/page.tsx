
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
  ChevronLeft,
  Volume2
} from 'lucide-react';
import { defaultAudioSettings, type AudioSettings } from '@/features/audio-cleaner/types';
import { Card, CardContent } from '@/components/ui/card';

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
      toast({ title: 'Audio Berhasil Dimuat', description: 'Gunakan panel kontrol untuk membersihkan audio.' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Gagal Memuat', description: 'Format file tidak didukung.' });
    }
  };

  const handleProcess = async () => {
    await processAudio(settings);
    toast({ title: 'Audio Berhasil Diproses', description: 'Perubahan telah diterapkan pada gelombang suara.' });
  };

  const handleDownload = () => {
    if (!processedBuffer || !audioFile) return;
    const blob = exportAudio(processedBuffer);
    saveAs(blob, `cleaned_${audioFile.name}`);
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
    <div className="container mx-auto p-4 sm:p-6 md:p-8 h-full">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Audio Cleaner</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Gunakan teknologi DSP profesional untuk menghilangkan noise dan memperhalus suara rekaman Anda.
          </p>
        </div>

        {!audioBuffer ? (
          <AudioUploader onUpload={handleUpload} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Pratinjau Waveform
                      </h3>
                      <WaveformVisualizer buffer={processedBuffer} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <span className="text-sm font-mono text-muted-foreground">
                          {duration.toFixed(2)} detik
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setAudioBuffer(null); setAudioFile(null); }}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Ganti File
                        </Button>
                        <Button onClick={handleDownload} disabled={!processedBuffer || isProcessing}>
                          <Download className="mr-2 h-4 w-4" />
                          Unduh WAV
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-4 items-start">
                <Sparkles className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-primary">Tips Pembersihan</h4>
                  <p className="text-sm text-primary/80">
                    High-Pass membantu menghilangkan dengung frekuensi rendah, sedangkan Low-Pass membantu menghilangkan desis frekuensi tinggi. Gunakan "Smooth Voice" untuk menstabilkan volume vokal.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AudioControls settings={settings} onSettingsChange={setSettings} disabled={isProcessing} />
              <Button onClick={handleProcess} className="w-full h-12 text-lg shadow-lg" disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Terapkan Pembersihan</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
