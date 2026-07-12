'use client';

import { useEffect, useRef, useState } from 'react';
import type { VisualizerMode } from '../types';
import { Button } from '@/components/ui/button';
import { Video, StopCircle, Download, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StudioVisualizerProps {
  analyser: AnalyserNode | null;
  mode: VisualizerMode;
  isPlaying: boolean;
  audioStream?: MediaStream;
}

export function StudioVisualizer({ analyser, mode, isPlaying, audioStream }: StudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const startRecording = () => {
    if (!canvasRef.current || !audioStream) {
      toast({ variant: 'destructive', title: 'Error', description: 'Putar audio terlebih dahulu untuk merekam visualisasi.' });
      return;
    }
    
    setIsRecording(true);
    setVideoBlob(null);
    chunksRef.current = [];

    // Capture visual stream from canvas
    const canvasStream = canvasRef.current.captureStream(60);
    
    // Combine with current audio stream for high-fidelity video
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ]);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoBlob(blob);
      setIsRecording(false);
      toast({ title: 'Perekaman Selesai', description: 'Video siap untuk diunduh.' });
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const downloadVideo = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative_visualizer_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const draw = () => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;

    // Stable background fade for tail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, width, height);

    const accentColor = 'rgba(20, 255, 236, 1)';

    if (mode === 'bars') {
      const barWidth = (width / (bufferLength * 0.4)) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength * 0.4; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.85;
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(20, 255, 236, 0.1)');
        gradient.addColorStop(1, accentColor);
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = accentColor;
        ctx.fillRect(x, height - barHeight, barWidth - 4, barHeight);
        ctx.shadowBlur = 0;
        x += barWidth;
      }
    } else if (mode === 'circle') {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 4.5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(20, 255, 236, 0.2)';
      ctx.stroke();

      for (let i = 0; i < bufferLength; i += 4) {
        const value = dataArray[i] / 255;
        const angle = (i / (bufferLength * 0.8)) * 2 * Math.PI;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + value * 280);
        const y2 = centerY + Math.sin(angle) * (radius + value * 280);

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2 + value * 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (mode === 'pulse') {
      const value = dataArray.reduce((a, b) => a + b) / bufferLength / 255;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) / 3.5;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * (1 + value * 0.8), 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(20, 255, 236, ${0.05 + value * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1 + 15 * value;
      ctx.stroke();
    } else if (mode === 'wave') {
      const waveArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(waveArray);
      
      ctx.lineWidth = 3;
      ctx.strokeStyle = accentColor;
      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = waveArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    // Only run draw loop if active
    if (isPlaying && analyser) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(draw);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, analyser, mode]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-accent/20 shadow-2xl group">
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute top-4 right-4 flex flex-wrap justify-end gap-2 z-10 pointer-events-auto">
        {!isRecording ? (
          <Button 
            size="sm" 
            variant="secondary" 
            className={cn(
              "bg-black/70 text-white border-none backdrop-blur-md transition-all hover:bg-red-600",
              !isPlaying && "opacity-50 cursor-not-allowed"
            )}
            onClick={startRecording}
            disabled={!isPlaying}
          >
            <Video className="w-4 h-4 mr-2" /> Rekam Visual
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="destructive" 
            className="animate-pulse shadow-lg shadow-red-500/50"
            onClick={stopRecording}
          >
            <StopCircle className="w-4 h-4 mr-2" /> Hentikan & Simpan
          </Button>
        )}
        
        {videoBlob && !isRecording && (
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-accent text-white border-none shadow-lg shadow-accent/50 animate-bounce"
            onClick={downloadVideo}
          >
            <Download className="w-4 h-4 mr-2" /> Unduh Video (.webm)
          </Button>
        )}
      </div>

      <div className="absolute top-4 left-4 pointer-events-none">
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-tighter animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span> Recording Live
          </div>
        )}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="text-center space-y-3 animate-in fade-in zoom-in duration-500">
            <div className="p-4 bg-accent/20 rounded-full inline-block border border-accent/30">
               <Monitor className="w-10 h-10 text-accent" />
            </div>
            <div>
              <p className="text-accent font-mono text-sm tracking-widest uppercase font-bold">Monitor Standby</p>
              <p className="text-muted-foreground text-[10px]">Klik Play untuk memulai visualisasi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
