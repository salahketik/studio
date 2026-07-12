'use client';

import { useEffect, useRef, useState } from 'react';
import type { VisualizerMode } from '../types';
import { Button } from '@/components/ui/button';
import { Video, StopCircle, Download, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    if (!canvasRef.current || !audioStream) return;
    
    setIsRecording(true);
    setVideoBlob(null);
    chunksRef.current = [];

    const canvasStream = canvasRef.current.captureStream(60); // 60 FPS
    
    // Mix video and audio streams
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
    toast({ title: 'Mulai Merekam', description: 'Visualisasi sedang direkam ke format video.' });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const downloadVideo = () => {
    if (!videoBlob) return;
    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio_visualizer_${Date.now()}.webm`;
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

    // Background Clear
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, width, height);

    const accentColor = 'rgba(20, 255, 236, 1)'; // Neon Cyan

    if (mode === 'bars') {
      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.8;
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(20, 255, 236, 0.2)');
        gradient.addColorStop(1, accentColor);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    } else if (mode === 'circle') {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 4;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(20, 255, 236, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 0; i < bufferLength; i += 2) {
        const value = dataArray[i] / 255;
        const angle = (i / bufferLength) * 2 * Math.PI;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + value * 100);
        const y2 = centerY + Math.sin(angle) * (radius + value * 100);

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (mode === 'pulse') {
      const value = dataArray.reduce((a, b) => a + b) / bufferLength / 255;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) / 3;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * (1 + value * 0.5), 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(20, 255, 236, ${0.1 + value * 0.3})`;
      ctx.fill();
      
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 5 * value;
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
    if (isPlaying && analyser) {
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
        width={1920}
        height={1080}
        className="w-full h-full object-contain"
      />
      
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isRecording ? (
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-black/60 text-white hover:bg-red-600 border-none"
            onClick={startRecording}
            disabled={!isPlaying}
          >
            <Video className="w-4 h-4 mr-2" /> Rekam Video
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="destructive" 
            className="animate-pulse"
            onClick={stopRecording}
          >
            <StopCircle className="w-4 h-4 mr-2" /> Stop Rekam
          </Button>
        )}
        
        {videoBlob && (
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-accent text-white border-none"
            onClick={downloadVideo}
          >
            <Download className="w-4 h-4 mr-2" /> Unduh Video
          </Button>
        )}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="text-center space-y-2">
            <Monitor className="w-12 h-12 text-accent/40 mx-auto" />
            <p className="text-accent/60 font-mono text-sm tracking-widest uppercase">Visualizer Ready</p>
          </div>
        </div>
      )}
    </div>
  );
}
