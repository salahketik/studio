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
    setProcessedBuffer(null); // Reset processed when new audio loaded
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

    // Core Chain Nodes
    const hpFilter = offlineCtx.createBiquadFilter();
    const lpFilter = offlineCtx.createBiquadFilter();
    const presenceFilter = offlineCtx.createBiquadFilter();
    const warmthFilter = offlineCtx.createBiquadFilter();
    const compressor = offlineCtx.createDynamicsCompressor();
    const distortionNode = offlineCtx.createWaveShaper();
    const delayNode = offlineCtx.createDelay(1.0);
    const feedbackNode = offlineCtx.createGain();
    const outputGain = offlineCtx.createGain();

    // Reset Defaults
    hpFilter.type = 'highpass'; hpFilter.frequency.value = settings.highPass;
    lpFilter.type = 'lowpass'; lpFilter.frequency.value = settings.lowPass;
    presenceFilter.type = 'peaking'; presenceFilter.gain.value = 0;
    warmthFilter.type = 'lowshelf'; warmthFilter.gain.value = 0;
    
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    delayNode.delayTime.value = 0;
    feedbackNode.gain.value = 0;

    // Profile Specific Logic
    switch (settings.profile) {
      case 'voice_enhance':
        presenceFilter.frequency.value = 3500;
        presenceFilter.gain.value = 6;
        presenceFilter.Q.value = 1.2;
        warmthFilter.frequency.value = 200;
        warmthFilter.gain.value = 4;
        compressor.threshold.value = -18;
        compressor.ratio.value = 3;
        hpFilter.frequency.value = 90;
        break;
      case 'noise_reduction':
        hpFilter.frequency.value = 140;
        lpFilter.frequency.value = 8500;
        compressor.threshold.value = -35;
        compressor.ratio.value = 12;
        break;
      case 'studio':
        presenceFilter.frequency.value = 3000;
        presenceFilter.gain.value = 4;
        compressor.threshold.value = -20;
        break;
      case 'podcast':
        warmthFilter.frequency.value = 150;
        warmthFilter.gain.value = 8;
        compressor.threshold.value = -28;
        compressor.ratio.value = 8;
        break;
      case 'telephone':
        hpFilter.frequency.value = 450;
        lpFilter.frequency.value = 3200;
        outputGain.gain.value = 1.5;
        break;
      case 'vintage_tv':
        hpFilter.frequency.value = 400;
        lpFilter.frequency.value = 4000;
        distortionNode.curve = createDistortionCurve(30);
        break;
      case 'megaphone':
        hpFilter.frequency.value = 600;
        lpFilter.frequency.value = 2500;
        distortionNode.curve = createDistortionCurve(100);
        break;
      case 'cave':
        delayNode.delayTime.value = 0.3;
        feedbackNode.gain.value = 0.5;
        break;
      case 'mega_bass':
        warmthFilter.frequency.value = 80;
        warmthFilter.gain.value = 15;
        break;
      default:
        break;
    }

    // Manual Overrides if set
    if (settings.echo > 0) {
        delayNode.delayTime.value = settings.echo;
        feedbackNode.gain.value = 0.4;
    }

    // Connect Chain: Source -> HPF -> LPF -> Presence -> Warmth -> Distortion -> Compressor -> Delay/Gain -> Output
    source.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(presenceFilter);
    presenceFilter.connect(warmthFilter);
    warmthFilter.connect(distortionNode);
    distortionNode.connect(compressor);
    
    // Echo circuit
    compressor.connect(delayNode);
    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(outputGain);
    
    compressor.connect(outputGain); // Primary path
    outputGain.connect(offlineCtx.destination);

    outputGain.gain.value = settings.gain;
    if (settings.distortion > 0 && !distortionNode.curve) {
      distortionNode.curve = createDistortionCurve(settings.distortion);
    }

    source.start(0);
    
    try {
      const renderedBuffer = await offlineCtx.startRendering();
      setProcessedBuffer(renderedBuffer);
    } catch (e) {
      console.error('Rendering failed', e);
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
    let i, sample, offset = 0, pos = 0;

    const setUint32 = (d: number) => { view.setUint32(offset, d, true); offset += 4; };
    const setUint16 = (d: number) => { view.setUint16(offset, d, true); offset += 2; };

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
