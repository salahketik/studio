'use client';

import { useState, useCallback } from 'react';
import type { DeadAirSettings, AudioStats } from '../types';

export function useDeadAirProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null);
  const [stats, setStats] = useState<AudioStats | null>(null);

  const loadAudio = async (file: File): Promise<AudioBuffer> => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);
    setAudioBuffer(buffer);
    setProcessedBuffer(null);
    setStats(null);
    return buffer;
  };

  const processDeadAir = useCallback(async (buffer: AudioBuffer, settings: DeadAirSettings) => {
    setIsProcessing(true);
    
    // Algorithm:
    // 1. Divide buffer into small blocks (e.g., 20ms)
    // 2. Calculate RMS for each block
    // 3. Identify silent regions based on threshold and duration
    // 4. Concatenate non-silent regions with padding

    const sampleRate = buffer.sampleRate;
    const channels = buffer.numberOfChannels;
    const data = buffer.getChannelData(0); // Analyze first channel
    
    const blockSize = Math.floor(sampleRate * 0.02); // 20ms blocks
    const threshold = Math.pow(10, settings.threshold / 20); // convert dB to linear
    const minSilenceBlocks = Math.ceil((settings.minSilenceDuration / 1000) * sampleRate / blockSize);
    const paddingBlocks = Math.ceil((settings.padding / 1000) * sampleRate / blockSize);

    const nonSilentRanges: { start: number; end: number }[] = [];
    let isCurrentlySilent = false;
    let silentBlockCount = 0;
    let currentStart = 0;

    for (let i = 0; i < data.length; i += blockSize) {
      let sum = 0;
      const actualBlockSize = Math.min(blockSize, data.length - i);
      for (let j = 0; j < actualBlockSize; j++) {
        sum += data[i + j] * data[i + j];
      }
      const rms = Math.sqrt(sum / actualBlockSize);

      if (rms < threshold) {
        if (!isCurrentlySilent) {
          isCurrentlySilent = true;
          silentBlockCount = 1;
        } else {
          silentBlockCount++;
        }
      } else {
        if (isCurrentlySilent) {
          if (silentBlockCount >= minSilenceBlocks) {
            // Gap found! End current range
            const gapStart = i - (silentBlockCount * blockSize);
            nonSilentRanges.push({ 
              start: currentStart, 
              end: Math.max(0, gapStart + (paddingBlocks * blockSize)) 
            });
            currentStart = Math.max(0, i - (paddingBlocks * blockSize));
          }
          isCurrentlySilent = false;
          silentBlockCount = 0;
        }
      }
    }
    // Add final range
    nonSilentRanges.push({ start: currentStart, end: data.length });

    // Create new buffer
    const totalLength = nonSilentRanges.reduce((acc, range) => acc + (range.end - range.start), 0);
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const newBuffer = audioCtx.createBuffer(channels, totalLength, sampleRate);

    for (let c = 0; c < channels; c++) {
      const oldData = buffer.getChannelData(c);
      const newData = newBuffer.getChannelData(c);
      let offset = 0;
      for (const range of nonSilentRanges) {
        const length = range.end - range.start;
        if (length > 0) {
          newData.set(oldData.subarray(range.start, range.end), offset);
          offset += length;
        }
      }
    }

    setProcessedBuffer(newBuffer);
    setStats({
      originalDuration: buffer.duration,
      newDuration: newBuffer.duration,
      segmentsRemoved: nonSilentRanges.length - 1
    });
    setIsProcessing(false);
  }, []);

  const exportWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let i, sample, offset = 0, pos = 0;

    const setUint16 = (d: number) => { view.setUint16(offset, d, true); offset += 2; };
    const setUint32 = (d: number) => { view.setUint32(offset, d, true); offset += 4; };

    setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
    setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
    setUint32(buffer.sampleRate); setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164);
    setUint32(length - offset - 4);

    for (i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));
    while (pos < buffer.length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][pos]));
        sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
      pos++;
    }
    return new Blob([bufferArray], { type: 'audio/wav' });
  };

  return { loadAudio, processDeadAir, exportWav, isProcessing, audioBuffer, processedBuffer, stats };
}
