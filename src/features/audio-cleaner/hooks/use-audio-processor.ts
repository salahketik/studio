
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { AudioSettings } from '../types';

export function useAudioProcessor() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const loadAudio = useCallback(async (file: File) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const arrayBuffer = await file.arrayBuffer();
    const decodedBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
    setAudioBuffer(decodedBuffer);
    setProcessedBuffer(decodedBuffer);
    setDuration(decodedBuffer.duration);
  }, []);

  const processAudio = useCallback(async (settings: AudioSettings) => {
    if (!audioBuffer || !audioCtxRef.current) return;
    
    setIsProcessing(true);
    
    // Use OfflineAudioContext for faster-than-realtime processing
    const offlineCtx = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    // Source
    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;

    // High Pass Filter (Remove low rumble/noise)
    const hpFilter = offlineCtx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = settings.highPass;

    // Low Pass Filter (Remove high hiss)
    const lpFilter = offlineCtx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = settings.lowPass;

    // Compressor (Smooth out the voice)
    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, offlineCtx.currentTime);
    compressor.knee.setValueAtTime(40, offlineCtx.currentTime);
    compressor.ratio.setValueAtTime(settings.compression, offlineCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, offlineCtx.currentTime);
    compressor.release.setValueAtTime(0.25, offlineCtx.currentTime);

    // Gain
    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = settings.gain;

    // Connect
    source.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(compressor);
    compressor.connect(gainNode);
    gainNode.connect(offlineCtx.destination);

    source.start(0);
    
    const renderedBuffer = await offlineCtx.startRendering();
    setProcessedBuffer(renderedBuffer);
    setIsProcessing(false);
  }, [audioBuffer]);

  const exportAudio = useCallback((buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // Write WAV header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // format length
    setUint16(1); // sample format (raw)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < buffer.length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][pos]));
        sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
      pos++;
    }

    function setUint16(data: number) {
      view.setUint16(offset, data, true);
      offset += 2;
    }

    function setUint32(data: number) {
      view.setUint32(offset, data, true);
      offset += 4;
    }

    return new Blob([bufferArray], { type: 'audio/wav' });
  }, []);

  return { loadAudio, processAudio, exportAudio, audioBuffer, processedBuffer, isProcessing, duration };
}
