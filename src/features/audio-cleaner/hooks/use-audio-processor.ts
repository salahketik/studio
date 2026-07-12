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
    const k = amount;
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

    // Standard Filters
    const hpFilter = offlineCtx.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = settings.highPass;

    const lpFilter = offlineCtx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = settings.lowPass;

    // Dynamic Nodes for Profiles
    const profileFilter = offlineCtx.createBiquadFilter();
    const distortionNode = offlineCtx.createWaveShaper();
    const compressor = offlineCtx.createDynamicsCompressor();
    const delayNode = offlineCtx.createDelay();
    const feedback = offlineCtx.createGain();
    const delayGain = offlineCtx.createGain();
    const gainNode = offlineCtx.createGain();

    // Default Profile Values
    let distAmount = settings.distortion;
    let echoVal = settings.echo;
    profileFilter.type = 'peaking';
    profileFilter.gain.value = 0;
    compressor.ratio.value = 4;

    // Advanced 20 Profile Logic
    switch (settings.profile) {
      case 'studio':
        hpFilter.frequency.value = 80;
        profileFilter.frequency.value = 3500;
        profileFilter.gain.value = 3;
        compressor.threshold.value = -18;
        break;
      case 'podcast':
        hpFilter.frequency.value = 120;
        profileFilter.frequency.value = 250;
        profileFilter.gain.value = 6;
        compressor.threshold.value = -24;
        compressor.ratio.value = 12;
        break;
      case 'telephone':
        hpFilter.frequency.value = 400;
        lpFilter.frequency.value = 3500;
        distAmount += 15;
        break;
      case 'vintage_tv':
        hpFilter.frequency.value = 500;
        lpFilter.frequency.value = 2500;
        profileFilter.type = 'notch';
        profileFilter.frequency.value = 1000;
        distAmount += 25;
        break;
      case 'megaphone':
        profileFilter.frequency.value = 2000;
        profileFilter.gain.value = 18;
        distAmount += 45;
        break;
      case 'robot':
        profileFilter.type = 'allpass';
        profileFilter.frequency.value = 1000;
        distAmount += 60;
        break;
      case 'underwater':
        lpFilter.frequency.value = 500;
        echoVal = 0.4;
        break;
      case 'cave':
        echoVal = 0.7;
        profileFilter.type = 'highshelf';
        profileFilter.gain.value = -10;
        break;
      case 'mega_bass':
        profileFilter.type = 'lowshelf';
        profileFilter.frequency.value = 150;
        profileFilter.gain.value = 25;
        break;
      case 'whisper':
        hpFilter.frequency.value = 4000;
        compressor.threshold.value = -40;
        break;
      case 'cinema':
        profileFilter.type = 'lowshelf';
        profileFilter.gain.value = 8;
        compressor.threshold.value = -30;
        compressor.ratio.value = 20;
        break;
      case 'radio':
        hpFilter.frequency.value = 150;
        profileFilter.frequency.value = 5000;
        profileFilter.gain.value = 10;
        distAmount += 5;
        break;
      case 'walkie_talkie':
        hpFilter.frequency.value = 800;
        lpFilter.frequency.value = 3000;
        distAmount += 40;
        break;
      case 'stadium':
        echoVal = 0.9;
        profileFilter.frequency.value = 3000;
        profileFilter.gain.value = -15;
        break;
      case 'vinyl':
        hpFilter.frequency.value = 300;
        distAmount += 10;
        profileFilter.frequency.value = 10000;
        profileFilter.gain.value = -20;
        break;
      case 'digital_glitch':
        distAmount += 90;
        profileFilter.type = 'bandpass';
        profileFilter.frequency.value = 800;
        break;
    }

    // Apply Distortion
    if (distAmount > 0) {
      distortionNode.curve = createDistortionCurve(distAmount);
      distortionNode.oversample = '4x';
    }

    // Apply Echo
    if (echoVal > 0) {
      delayNode.delayTime.value = Math.min(echoVal, 1.0);
      feedback.gain.value = 0.45;
      delayGain.gain.value = 0.45;
      delayNode.connect(feedback);
      feedback.connect(delayNode);
    } else {
      delayGain.gain.value = 0;
    }

    gainNode.gain.value = settings.gain;

    // Chain: Source -> HPF -> LPF -> ProfileFilter -> Distortion -> Compressor -> Delay (Split) -> Gain -> Dest
    source.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(profileFilter);
    profileFilter.connect(distortionNode);
    distortionNode.connect(compressor);
    
    // Echo Split
    compressor.connect(delayNode);
    delayNode.connect(delayGain);
    
    compressor.connect(gainNode);
    delayGain.connect(gainNode);
    
    gainNode.connect(offlineCtx.destination);

    source.start(0);
    
    try {
      const renderedBuffer = await offlineCtx.startRendering();
      setProcessedBuffer(renderedBuffer);
    } catch (e) {
      console.error("DSP Processing Error:", e);
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
