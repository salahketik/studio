'use client';

import { useState, useRef, useCallback } from 'react';
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

  const createDistortionCurve = (amount: number) => {
    const k = amount > 0 ? amount : 0;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const processAudio = useCallback(async (settings: AudioSettings) => {
    if (!audioBuffer) return;
    
    setIsProcessing(true);
    
    const sampleRate = audioBuffer.sampleRate;
    const offlineCtx = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;

    // --- DSP CHAIN ---
    const hpFilter = offlineCtx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = settings.highPass;

    const profileFilter = offlineCtx.createBiquadFilter();
    const profileFilter2 = offlineCtx.createBiquadFilter();
    profileFilter.type = 'peaking';
    profileFilter2.type = 'peaking';

    let distortionAmount = settings.distortion;
    let echoAmount = settings.echo;
    let compressionRatio = settings.compression || 12;

    // Advanced Profile Effects Mapping
    switch (settings.profile) {
      case 'studio':
        hpFilter.frequency.value = 80;
        profileFilter.type = 'peaking';
        profileFilter.frequency.value = 3000;
        profileFilter.gain.value = 3;
        compressionRatio = 4;
        break;
      case 'podcast':
        hpFilter.frequency.value = 100;
        profileFilter.type = 'peaking';
        profileFilter.frequency.value = 200;
        profileFilter.gain.value = 5;
        compressionRatio = 18;
        break;
      case 'telephone':
        hpFilter.frequency.value = 400;
        profileFilter.type = 'lowpass';
        profileFilter.frequency.value = 3500;
        distortionAmount += 10;
        break;
      case 'vintage_tv':
        hpFilter.frequency.value = 600;
        profileFilter.type = 'bandpass';
        profileFilter.frequency.value = 1500;
        profileFilter.Q.value = 1;
        distortionAmount += 20;
        break;
      case 'megaphone':
        profileFilter.type = 'peaking';
        profileFilter.frequency.value = 2000;
        profileFilter.gain.value = 15;
        distortionAmount += 40;
        break;
      case 'underwater':
        profileFilter.type = 'lowpass';
        profileFilter.frequency.value = 600;
        echoAmount = 0.3;
        break;
      case 'robot':
        profileFilter.type = 'peaking';
        profileFilter.frequency.value = 1000;
        profileFilter.Q.value = 20;
        profileFilter.gain.value = 20;
        distortionAmount += 50;
        break;
      case 'cave':
        echoAmount = 0.6;
        profileFilter.type = 'allpass';
        break;
      case 'mega_bass':
        profileFilter.type = 'lowshelf';
        profileFilter.frequency.value = 200;
        profileFilter.gain.value = 20;
        break;
      case 'whisper':
        hpFilter.frequency.value = 5000;
        compressionRatio = 20;
        break;
      case 'radio':
        hpFilter.frequency.value = 200;
        profileFilter.type = 'highshelf';
        profileFilter.frequency.value = 4000;
        profileFilter.gain.value = -10;
        distortionAmount += 5;
        break;
    }

    const distortionNode = offlineCtx.createWaveShaper();
    if (distortionAmount > 0) {
      distortionNode.curve = createDistortionCurve(distortionAmount);
      distortionNode.oversample = '4x';
    }

    const compressor = offlineCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, offlineCtx.currentTime);
    compressor.ratio.setValueAtTime(compressionRatio, offlineCtx.currentTime);

    const delayNode = offlineCtx.createDelay();
    const feedback = offlineCtx.createGain();
    const delayGain = offlineCtx.createGain();

    if (echoAmount > 0) {
      delayNode.delayTime.value = echoAmount > 1 ? 0.5 : echoAmount * 0.5; // Max 0.5s for echo
      feedback.gain.value = 0.4;
      delayGain.gain.value = 0.4;
      delayNode.connect(feedback);
      feedback.connect(delayNode);
    } else {
      delayGain.gain.value = 0;
    }

    const lpFilter = offlineCtx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = settings.lowPass;

    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = settings.gain;

    // Connect nodes
    source.connect(hpFilter);
    hpFilter.connect(profileFilter);
    profileFilter.connect(profileFilter2);
    profileFilter2.connect(distortionNode);
    distortionNode.connect(compressor);
    
    compressor.connect(delayNode);
    delayNode.connect(delayGain);
    
    compressor.connect(lpFilter);
    delayGain.connect(lpFilter);
    
    lpFilter.connect(gainNode);
    gainNode.connect(offlineCtx.destination);

    source.start(0);
    
    try {
      const renderedBuffer = await offlineCtx.startRendering();
      setProcessedBuffer(renderedBuffer);
    } catch (e) {
      console.error("Rendering failed", e);
    } finally {
      setIsProcessing(false);
    }
  }, [audioBuffer]);

  const reset = useCallback(() => {
    setAudioBuffer(null);
    setProcessedBuffer(null);
    setDuration(0);
  }, []);

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

    const setUint16 = (data: number) => { view.setUint16(offset, data, true); offset += 2; };
    const setUint32 = (data: number) => { view.setUint32(offset, data, true); offset += 4; };

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
  }, []);

  return { loadAudio, processAudio, exportAudio, reset, audioBuffer, processedBuffer, isProcessing, duration };
}