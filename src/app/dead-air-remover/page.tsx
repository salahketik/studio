'use client';

import { useState } from 'react';
import { useDeadAirProcessor } from '@/features/dead-air-remover/hooks/use-dead-air-processor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { 
  TimerOff, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Download, 
  RefreshCcw, 
  VolumeX,
  Volume2,
  Clock,
  Scissors
} from 'lucide-react';
import { defaultDeadAirSettings, type DeadAirSettings } from '@/features/dead-air-remover/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function DeadAirRemoverPage() {
  const { toast } = useToast();
  const { loadAudio, processDeadAir, exportWav, isProcessing, audioBuffer, processedBuffer, stats } = useDeadAirProcessor();
  const [settings, setSettings] = useState<DeadAirSettings>(defaultDeadAirSettings);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      try {
        await loadAudio(file);
        toast({ title: 'Audio Berhasil Dimuat', description: 'Atur sensitivitas dan klik "Proses" untuk menghapus bagian diam.' });
      } catch (err) {
        toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat audio.' });
      }
    }
  };

  const handleProcess = async () => {
    if (!audioBuffer) return;
    await processDeadAir(audioBuffer, settings);
    toast({ title: 'Pembersihan Selesai', description: 'Jeda sunyi telah dihapus secara otomatis.' });
  };

  const handleDownload = () => {
    if (!processedBuffer || !audioFile) return;
    const blob = exportWav(processedBuffer);
    saveAs(blob, `trimmed_${audioFile.name}`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Hapus Bagian Diam</h1>
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-none uppercase text-[10px] px-2">Cerdas AI</Badge>
            </div>
            <p className="text-muted-foreground">Otomatiskan pengeditan podcast atau rekaman Anda dengan mendeteksi sunyi.</p>
          </div>
        </div>
      </div>

      {!audioBuffer ? (
        <Card className="border-2 border-dashed glass-panel">
          <CardContent className="flex flex-col items-center justify-center p-16 space-y-6 text-center">
            <div className="p-6 bg-yellow-500/10 rounded-full">
              <TimerOff className="w-12 h-12 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Unggah File Audio</h3>
              <p className="text-muted-foreground max-w-sm">Mendukung MP3, WAV, M4A. Kami akan menganalisis rekaman Anda secara instan.</p>
            </div>
            <input type="file" id="audio-upload" className="hidden" accept="audio/*" onChange={handleFileUpload} />
            <Button size="lg" className="rounded-full px-8 shadow-xl bg-yellow-600 hover:bg-yellow-700" onClick={() => document.getElementById('audio-upload')?.click()}>
              Pilih File Rekaman
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-none shadow-2xl glass-panel overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-yellow-600" />
                  Pratinjau Rekaman
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-2xl"><VolumeX className="w-6 h-6 text-yellow-600" /></div>
                    <div className="space-y-0.5">
                      <p className="font-bold">{audioFile?.name}</p>
                      <p className="text-xs text-muted-foreground">Original: {audioBuffer.duration.toFixed(2)} detik</p>
                    </div>
                  </div>
                  {stats && (
                    <div className="text-right">
                      <p className="text-2xl font-black text-yellow-600">-{ (stats.originalDuration - stats.newDuration).toFixed(2) }s</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Waktu yang dihemat</p>
                    </div>
                  )}
                </div>

                {stats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> Durasi Baru</div>
                      <div className="text-xl font-bold">{stats.newDuration.toFixed(2)}s</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-2xl space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Scissors className="w-3 h-3" /> Segmen Dihapus</div>
                      <div className="text-xl font-bold">{stats.segmentsRemoved}</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button size="lg" className="flex-1 h-14 rounded-2xl bg-yellow-600 hover:bg-yellow-700 font-bold" onClick={handleProcess} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menganalisis...</> : <><Sparkles className="mr-2 h-5 w-5" /> Proses Dead Air</>}
                  </Button>
                  {processedBuffer && (
                    <Button size="lg" variant="outline" className="h-14 rounded-2xl border-yellow-600/20" onClick={handleDownload}>
                      <Download className="mr-2 h-5 w-5" /> Simpan WAV
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-3xl flex gap-4 items-start">
              <Sparkles className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-yellow-700">Tips AI</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Gunakan "Toleransi" yang lebih rendah (misalnya -50dB) untuk rekaman studio yang sangat bersih, dan "Toleransi" lebih tinggi (-30dB) jika rekaman Anda memiliki kebisingan latar belakang yang cukup keras.
                </p>
              </div>
            </div>
          </div>

          <Card className="rounded-3xl border-none shadow-xl h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Parameter Deteksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Toleransi Sunyi</Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{settings.threshold}dB</span>
                </div>
                <Slider 
                  min={-60} max={-20} step={1} 
                  value={[settings.threshold]} 
                  onValueChange={(v) => setSettings({...settings, threshold: v[0]})}
                  className="py-4"
                />
                <p className="text-[10px] text-muted-foreground italic">Semakin ke kanan, semakin sensitif mendeteksi bagian diam.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Durasi Minimum</Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{settings.minSilenceDuration}ms</span>
                </div>
                <Slider 
                  min={100} max={2000} step={50} 
                  value={[settings.minSilenceDuration]} 
                  onValueChange={(v) => setSettings({...settings, minSilenceDuration: v[0]})}
                  className="py-4"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Padding Suara</Label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{settings.padding}ms</span>
                </div>
                <Slider 
                  min={0} max={500} step={10} 
                  value={[settings.padding]} 
                  onValueChange={(v) => setSettings({...settings, padding: v[0]})}
                  className="py-4"
                />
              </div>

              <Button variant="ghost" className="w-full text-xs" onClick={() => { setAudioBuffer(null); setProcessedBuffer(null); setStats(null); }}>
                <RefreshCcw className="mr-2 h-3 w-3" /> Ganti Rekaman
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
