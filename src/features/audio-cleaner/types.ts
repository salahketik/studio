
export type AudioStatus = 'idle' | 'loading' | 'playing' | 'processing' | 'ready';

export interface AudioSettings {
  noiseGate: number; // threshold in dB
  highPass: number;  // frequency in Hz
  lowPass: number;   // frequency in Hz
  compression: number; // ratio
  gain: number;      // output gain
}

export const defaultAudioSettings: AudioSettings = {
  noiseGate: -40,
  highPass: 80,
  lowPass: 12000,
  compression: 2,
  gain: 1,
};
