'use client';

import { useEffect, useRef, useState } from 'react';
import type { VisualizerMode } from '../types';
import { Button } from '@/components/ui/button';
import { Video, StopCircle, Download, Monitor, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StudioVisualizerProps {
  analyser: AnalyserNode | null;
  mode: VisualizerMode;
  isPlaying: boolean;
  audioStream?: MediaStream;
  sensitivity: number;
  bgImageUrl?: string;
}

export function StudioVisualizer({ analyser, mode, isPlaying, audioStream, sensitivity, bgImageUrl }: StudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (bgImageUrl) {
        const img = new Image();
        img.src = bgImageUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            bgImgRef.current = img;
        };
    } else {
        bgImgRef.current = null;
    }
  }, [bgImageUrl]);

  const startRecording = () => {
    if (!canvasRef.current || !audioStream) {
      toast({ variant: 'destructive', title: 'Error', description: 'Putar audio terlebih dahulu untuk merekam visualisasi.' });
      return;
    }
    
    setIsRecording(true);
    setVideoBlob(null);
    chunksRef.current = [];

    const canvasStream = canvasRef.current.captureStream(60);
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
      toast({ title: 'Rekaman Siap', description: 'Klik tombol unduh untuk menyimpan video.' });
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
    a.download = `music_video_${Date.now()}.webm`;
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

    // Draw Background
    if (bgImgRef.current) {
        ctx.drawImage(bgImgRef.current, 0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.fillStyle = 'rgba(10, 10, 12, 1)';
        ctx.fillRect(0, 0, width, height);
    }

    const accentColor = 'rgba(20, 255, 236, 1)';
    const sens = sensitivity || 1.5;

    if (mode === 'bars') {
      const barWidth = (width / (bufferLength * 0.4)) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength * 0.4; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.8 * sens;
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(20, 255, 236, 0.1)');
        gradient.addColorStop(1, accentColor);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 4, barHeight);
        x += barWidth;
      }
    } else if (mode === 'circle') {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 4.5;

      for (let i = 0; i < bufferLength; i += 4) {
        const value = (dataArray[i] / 255) * sens;
        const angle = (i / (bufferLength * 0.8)) * 2 * Math.PI;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + value * 300);
        const y2 = centerY + Math.sin(angle) * (radius + value * 300);

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3 + value * 6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (mode === 'pulse') {
      const avg = dataArray.reduce((a, b) => a + b) / bufferLength / 255;
      const value = avg * sens;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) / 3.5;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * (1 + value * 1.2), 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(20, 255, 236, ${0.1 + value * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2 + 30 * value;
      ctx.stroke();
    } else if (mode === 'wave') {
      const waveArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(waveArray);
      
      ctx.lineWidth = 5;
      ctx.strokeStyle = accentColor;
      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = (waveArray[i] / 128.0 - 1) * sens + 1;
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
    if (isPlaying && analyser) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(draw);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      // Fill background if not playing
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
         ctx.fillStyle = 'rgba(10, 10, 12, 1)';
         ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, analyser, mode, sensitivity]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-b-none overflow-hidden group">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute top-6 right-6 flex flex-wrap justify-end gap-3 z-20">
        {!isRecording ? (
          <Button 
            size="lg" 
            variant="secondary" 
            className={cn(
              "bg-black/80 text-white border-none backdrop-blur-xl hover:bg-accent transition-all rounded-2xl shadow-2xl",
              !isPlaying && "opacity-50"
            )}
            onClick={startRecording}
            disabled={!isPlaying}
          >
            <Video className="w-5 h-5 mr-3" /> Rekam Musik Video
          </Button>
        ) : (
          <Button 
            size="lg" 
            variant="destructive" 
            className="animate-pulse shadow-2xl shadow-red-500/50 rounded-2xl"
            onClick={stopRecording}
          >
            <StopCircle className="w-5 h-5 mr-3" /> Berhenti Rekam
          </Button>
        )}
        
        {videoBlob && !isRecording && (
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-accent text-white border-none shadow-2xl animate-bounce rounded-2xl"
            onClick={downloadVideo}
          >
            <Download className="w-5 h-5 mr-3" /> Unduh Video (.webm)
          </Button>
        )}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
           <div className="p-8 bg-accent/10 border border-accent/20 rounded-3xl space-y-4 text-center">
              <div className="p-4 bg-accent/20 rounded-full inline-block">
                <Monitor className="w-12 h-12 text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-accent font-black text-xl uppercase tracking-tighter">Studio Monitor Ready</p>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Putar audio untuk memulai visualisasi</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
