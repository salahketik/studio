
'use client';

import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  buffer: AudioBuffer | null;
  color?: string;
}

export function WaveformVisualizer({ buffer, color = 'hsl(var(--primary))' }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!buffer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.beginPath();

    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  }, [buffer, color]);

  return (
    <div className="w-full bg-muted/30 rounded-lg border h-48 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1000}
        height={200}
        className="w-full h-full"
      />
    </div>
  );
}
