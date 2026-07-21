export type AudioStatus = 'idle' | 'loading' | 'playing' | 'processing' | 'ready';

export type VoiceProfileId = 
  | 'original' | 'studio' | 'podcast' | 'voice_enhance' | 'noise_reduction' 
  | 'radio' | 'telephone' | 'vintage_tv' | 'megaphone' | 'walkie_talkie' 
  | 'underwater' | 'cave' | 'robot' | 'vinyl' | 'cinema' | 'stadium' 
  | 'news' | 'retro_radio' | 'digital_glitch' | 'whisper' | 'mega_bass';

export type VisualizerMode = 'bars' | 'circle' | 'pulse' | 'wave';

export interface VoiceProfile {
  id: VoiceProfileId;
  label: string;
  description: string;
  icon: string;
}

export interface AudioSettings {
  highPass: number;
  lowPass: number;
  compression: number;
  gain: number;
  distortion: number;
  echo: number;
  profile: VoiceProfileId;
  visualMode: VisualizerMode;
  visualSensitivity: number;
  bgImageUrl?: string;
}

export const voiceProfiles: VoiceProfile[] = [
  { id: 'original', label: 'Asli', description: 'Suara asli tanpa efek tambahan.', icon: 'Mic2' },
  { id: 'voice_enhance', label: 'AI Voice Enhance', description: 'Memperjelas artikulasi dan menambah kehangatan vokal.', icon: 'Sparkles' },
  { id: 'noise_reduction', label: 'Reduce Noise', description: 'Menekan desis latar belakang dan gangguan statis.', icon: 'VolumeX' },
  { id: 'studio', label: 'Studio Pro', description: 'Vokal jernih, seimbang, dan profesional.', icon: 'Music' },
  { id: 'podcast', label: 'Podcast', description: 'Suara hangat dan intim dengan kompresi tinggi.', icon: 'Headphones' },
  { id: 'radio', label: 'Radio AM', description: 'Simulasi siaran radio dengan bass yang dalam.', icon: 'Radio' },
  { id: 'telephone', label: 'Telepon', description: 'Suara lo-fi sempit khas panggilan telepon.', icon: 'Phone' },
  { id: 'vintage_tv', label: 'TV Jadul', description: 'Tipis, berderak, dan fokus pada mid-range.', icon: 'Tv' },
  { id: 'megaphone', label: 'Megaphone', description: 'Keras, cempreng, dan memekakkan telinga.', icon: 'Volume2' },
  { id: 'walkie_talkie', label: 'Walkie Talkie', description: 'Radio lapangan dengan distorsi tajam.', icon: 'Zap' },
  { id: 'underwater', label: 'Dalam Air', description: 'Suara teredam seperti di bawah permukaan air.', icon: 'Waves' },
  { id: 'cave', label: 'Gua Reverb', description: 'Gema panjang dan dalam seperti di dalam gua.', icon: 'Mountain' },
  { id: 'robot', label: 'Robotik', description: 'Suara metallic cyborg dengan modulasi.', icon: 'Bot' },
  { id: 'vinyl', label: 'Piringan Hitam', description: 'Hangat dengan karakter analog vintage.', icon: 'Disc' },
  { id: 'cinema', label: 'Bioskop', description: 'Megah dengan dynamic range yang luas.', icon: 'Film' },
  { id: 'stadium', label: 'Stadion', description: 'Gema luas seperti di arena terbuka.', icon: 'Users' },
  { id: 'news', label: 'Pembaca Berita', description: 'Fokus pada kejernihan artikulasi vokal.', icon: 'Newspaper' },
  { id: 'retro_radio', label: 'Radio Klasik', description: 'Karakter suara tahun 1940-an.', icon: 'Mic' },
  { id: 'digital_glitch', label: 'Digital Error', description: 'Suara terdistorsi secara digital.', icon: 'Cpu' },
  { id: 'whisper', label: 'Bisikan', description: 'Sangat lembut dengan boost frekuensi tinggi.', icon: 'Wind' },
  { id: 'mega_bass', label: 'Super Bass', description: 'Ekstrim pada frekuensi rendah.', icon: 'Dumbbell' },
];

export const defaultAudioSettings: AudioSettings = {
  highPass: 80,
  lowPass: 16000,
  compression: 2,
  gain: 1.2,
  distortion: 0,
  echo: 0,
  profile: 'voice_enhance',
  visualMode: 'bars',
  visualSensitivity: 1.5,
};