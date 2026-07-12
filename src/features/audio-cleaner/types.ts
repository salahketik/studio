export type AudioStatus = 'idle' | 'loading' | 'playing' | 'processing' | 'ready';

export type VoiceProfileId = 
  | 'original' | 'studio' | 'podcast' | 'radio' | 'telephone' 
  | 'vintage_tv' | 'megaphone' | 'walkie_talkie' | 'underwater' | 'cave' 
  | 'robot' | 'intercom' | 'vinyl' | 'cinema' | 'stadium' 
  | 'small_room' | 'news' | 'retro_radio' | 'digital_glitch' | 'whisper' | 'mega_bass';

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
}

export const voiceProfiles: VoiceProfile[] = [
  { id: 'original', label: 'Asli', description: 'Suara asli tanpa efek tambahan.', icon: 'Mic2' },
  { id: 'studio', label: 'Studio Pro', description: 'Vokal jernih, seimbang, dan profesional.', icon: 'Music' },
  { id: 'podcast', label: 'Podcast', description: 'Suara hangat dan intim dengan kompresi tinggi.', icon: 'Headphones' },
  { id: 'radio', label: 'Radio AM', description: 'Simulasi siaran radio dengan bass yang dalam.', icon: 'Radio' },
  { id: 'telephone', label: 'Telepon', description: 'Suara lo-fi sempit khas panggilan telepon.', icon: 'Phone' },
  { id: 'vintage_tv', label: 'TV Jadul', description: 'Tipis, berderak, dan fokus pada mid-range.', icon: 'Tv' },
  { id: 'megaphone', label: 'Megaphone', description: 'Keras, cempreng, dan memekakkan telinga.', icon: 'VolumeX' },
  { id: 'walkie_talkie', label: 'Walkie Talkie', description: 'Radio lapangan dengan distorsi tajam.', icon: 'Zap' },
  { id: 'underwater', label: 'Dalam Air', description: 'Suara teredam seperti di bawah permukaan air.', icon: 'Waves' },
  { id: 'cave', label: 'Gua Reverb', description: 'Gema panjang dan dalam seperti di dalam gua.', icon: 'Mountain' },
  { id: 'robot', label: 'Robotik', description: 'Suara metallic cyborg dengan modulasi.', icon: 'Bot' },
  { id: 'intercom', label: 'Interkom', description: 'Suara pengumuman gedung yang boxy.', icon: 'Speaker' },
  { id: 'vinyl', label: 'Piringan Hitam', description: 'Hangat dengan karakter analog vintage.', icon: 'Disc' },
  { id: 'cinema', label: 'Bioskop', description: 'Megah dengan dynamic range yang luas.', icon: 'Film' },
  { id: 'stadium', label: 'Stadion', description: 'Gema luas seperti di arena terbuka.', icon: 'Users' },
  { id: 'small_room', label: 'Ruang Kecil', description: 'Gema pendek dan padat.', icon: 'Home' },
  { id: 'news', label: 'Pembaca Berita', description: 'Fokus pada kejernihan artikulasi vokal.', icon: 'Newspaper' },
  { id: 'retro_radio', label: 'Radio Klasik', description: 'Karakter suara tahun 1940-an.', icon: 'Mic' },
  { id: 'digital_glitch', label: 'Digital Error', description: 'Suara terdistorsi secara digital.', icon: 'Cpu' },
  { id: 'whisper', label: 'Bisikan', description: 'Sangat lembut dengan boost frekuensi tinggi.', icon: 'Wind' },
  { id: 'mega_bass', label: 'Super Bass', description: 'Ekstrim pada frekuensi rendah.', icon: 'Dumbbell' },
];

export const defaultAudioSettings: AudioSettings = {
  highPass: 80,
  lowPass: 12000,
  compression: 2,
  gain: 1.2,
  distortion: 0,
  echo: 0,
  profile: 'studio',
};
