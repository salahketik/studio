
import { 
  FileImage, Crop, ArrowRight, Sparkles, Zap, 
  LayoutGrid, Maximize2, SlidersHorizontal, Pipette, Grid3X3, 
  ShieldAlert, Code2, ImageIcon, Palette, 
  Layers, Wind, Box, Split, Eye, 
  Type, Scaling, Ghost, Contrast, Aperture, Paintbrush2, Minimize2, 
  IterationCcw, Frame, Component, Focus, Sun, Filter,
  Music, TimerOff, Captions, Terminal, UserCircle,
  Hash, Binary, Search,
  Database, Activity,
  Wand2, Layers2, RefreshCcw, Flame, Coins,
  ImagePlus, Monitor,
  GlassWater, Camera, Cpu, Globe,
  Layout, Info, CheckCircle2, History, RotateCcw,
  Smartphone, Heart, Stars, Palette as PaletteIcon,
  Barcode, Key, FileJson, Link as LinkIcon, Ruler, Scan,
  MousePointer2, ShieldCheck, Mail, Lock, BrainCircuit,
  Settings2, Bot, Video, FileText, Languages, Stamp, FileCode,
  Shield, Scale, Trash2, Scissors, ListChecks, FileType, 
  FileSpreadsheet, Clock, SearchCode, Braces, Table, AlignLeft
} from 'lucide-react';

export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: any;
  category: string;
  useCase: string;
}

export const ALL_TOOLS: Tool[] = [
  // 0. AI Command Center
  { title: 'AI Image Analyst', description: 'Analisis mendalam, alt-text, dan palet warna otomatis.', href: '/ai-analyst', icon: BrainCircuit, category: 'ai', useCase: 'Smart' },
  { title: 'AI Background Gen', description: 'Hasilkan latar belakang artistik dari teks.', href: '/ai-background', icon: ImagePlus, category: 'ai', useCase: 'Creative' },
  { title: 'AI Audio Subtitle', description: 'Transkripsi otomatis suara menjadi file SRT.', href: '/voice-to-srt', icon: Captions, category: 'ai', useCase: 'Sync' },
  { title: 'AI PDF Assistant', description: 'Ekstraksi data cerdas dari dokumen PDF.', href: '/pdf-converter', icon: Bot, category: 'ai', useCase: 'Automate' },

  // 1. Berkas Core
  { title: 'Konverter Gambar', description: 'Konversi massal ke WebP, JPG, PNG secara lokal.', href: '/image-converter', icon: FileImage, category: 'core', useCase: 'Batch' },
  { title: 'Optimasi PNG', description: 'Kompresi aset PNG tanpa mengurangi kualitas.', href: '/png-opt', icon: Minimize2, category: 'core', useCase: 'Size' },
  { title: 'Suite PDF', description: 'Transformasi PDF ke Word, Excel, atau PPT.', href: '/pdf-converter', icon: FileText, category: 'core', useCase: 'Doc' },
  { title: 'Atur DPI', description: 'Ubah resolusi cetak metadata gambar.', href: '/dpi-adjuster', icon: Hash, category: 'core', useCase: 'Print' },
  { title: 'Hapus Metadata', description: 'Bersihkan data privasi EXIF secara permanen.', href: '/metadata-cleaner', icon: ShieldAlert, category: 'core', useCase: 'Privacy' },
  { title: 'Base64 Tool', description: 'Ubah gambar menjadi string data URI.', href: '/base64-tool', icon: Code2, category: 'core', useCase: 'Dev' },
  { title: 'Base64 Decoder', description: 'Ubah string Base64 kembali menjadi file asli.', href: '/base64-decode', icon: Database, category: 'core', useCase: 'Extract' },
  
  // 2. Kreator & Layout
  { title: 'Resizer Pro', description: 'Preset media sosial & kustom resolusi.', href: '/resizer', icon: Maximize2, category: 'social', useCase: 'Resize' },
  { title: 'Grid Splitter', description: 'Potong gambar untuk grid profil Instagram.', href: '/grid-splitter', icon: Grid3X3, category: 'social', useCase: 'IG Feed' },
  { title: 'Potong Cerdas', description: 'Hapus margin kosong secara otomatis.', href: '/trim', icon: Crop, category: 'social', useCase: 'Clean' },
  { title: 'Image Stitcher', description: 'Gabungkan banyak gambar secara vertikal.', href: '/stitcher', icon: Split, category: 'social', useCase: 'Layout' },
  { title: 'Generator Mockup', description: 'Presentasi produk dengan frame browser.', icon: Monitor, href: '/mockup', category: 'social', useCase: 'Showcase' },
  { title: 'Avatar Bulat', description: 'Potong foto menjadi profil lingkaran.', href: '/avatar-circle', icon: UserCircle, category: 'social', useCase: 'Profile' },
  { title: 'Corner Rounder', description: 'Bulatkan sudut gambar dengan presisi.', href: '/corners', icon: Frame, category: 'social', useCase: 'UI/UX' },
  { title: 'Canvas Text', description: 'Tambah teks caption pada kanvas gambar.', href: '/canvas-text', icon: Type, category: 'social', useCase: 'Text' },
  { title: 'Watermark Pro', description: 'Tambah logo/teks hak cipta pada gambar.', href: '/watermark', icon: Stamp, category: 'social', useCase: 'Copyright' },
  { title: 'Image Flipper', description: 'Putar balik gambar secara horisontal/vertikal.', href: '/image-flipper', icon: RotateCcw, category: 'social', useCase: 'Mirror' },

  // 3. Studio FX (Artistic)
  { title: 'Filter Studio', description: 'Edit pencahayaan, kontras, & suasana.', href: '/filters', icon: SlidersHorizontal, category: 'studio', useCase: 'Editor' },
  { title: 'Ekstrak Palet', description: 'Ambil kode HEX warna dari piksel foto.', href: '/palette-extractor', icon: Pipette, category: 'studio', useCase: 'Colors' },
  { title: 'Grayscale Pro', description: 'Kontrol monokrom kontras tinggi.', href: '/grayscale-pro', icon: ImageIcon, category: 'studio', useCase: 'B&W' },
  { title: 'Duotone Filter', description: 'Efek gradasi dua warna artistik.', href: '/duotone', icon: Sparkles, category: 'studio', useCase: 'Art' },
  { title: 'Vignette Studio', description: 'Efek gelap dramatis pada tepian gambar.', href: '/vignette', icon: Aperture, category: 'studio', useCase: 'Drama' },
  { title: 'Posterize Art', description: 'Pengurangan warna gaya Pop Art.', href: '/posterize', icon: Paintbrush2, category: 'studio', useCase: 'Retro' },
  { title: 'Film Grain', description: 'Tekstur grain vintage sinematik.', href: '/film-grain', icon: Wind, category: 'studio', useCase: 'Analog' },
  { title: 'Glitch Maker', description: 'Efek distorsi digital bergaya cyberpunk.', href: '/glitch', icon: IterationCcw, category: 'studio', useCase: 'Digital' },
  { title: 'ASCII Art Pro', description: 'Ubah gambar menjadi karakter teks unik.', href: '/ascii-art', icon: Terminal, category: 'studio', useCase: 'Retro' },
  { title: 'Kaleidoscope', description: 'Ciptakan geometri fraktal melingkar.', href: '/kaleido', icon: Focus, category: 'studio', useCase: 'Fractal' },
  { title: 'Pixelate Art', description: 'Ubah gambar menjadi gaya retro 8-bit.', href: '/pixelate', icon: Component, category: 'studio', useCase: 'Retro' },
  { title: 'Halftone Filter', description: 'Filter titik-titik koran retro klasik.', href: '/halftone', icon: Binary, category: 'studio', useCase: 'Print' },

  // 4. Editor Teknis (Precision)
  { title: 'Sharpen Pro', description: 'Tingkatkan ketajaman garis tepi gambar.', href: '/sharpen', icon: Wand2, category: 'advanced', useCase: 'Detail' },
  { title: 'Luminance Tool', description: 'Kontrol pencahayaan tingkat lanjut.', href: '/luminance', icon: Sun, category: 'advanced', useCase: 'Lighting' },
  { title: 'Opacity Pro', description: 'Kontrol saluran alfa transparansi.', href: '/opacity', icon: Ghost, category: 'advanced', useCase: 'Alpha' },
  { title: 'Shadow Studio', description: 'Tambah kedalaman bayangan (drop shadow).', href: '/shadow-studio', icon: Layers, category: 'advanced', useCase: 'Depth' },
  { title: 'Threshold B&W', description: 'Konversi biner hitam putih murni.', href: '/threshold', icon: Contrast, category: 'advanced', useCase: 'Binary' },
  { title: 'Color Balance', description: 'Keseimbangan warna RGB tingkat lanjut.', href: '/color-balance', icon: Palette, category: 'advanced', useCase: 'Grading' },
  { title: 'Edge Detection', description: 'Analisis kontur garis tepi Laplacian.', href: '/edge-detection', icon: Wand2, category: 'advanced', useCase: 'Analytic' },
  { title: 'Loji Mixer', description: 'Pencampuran warna logaritma.', href: '/loji-mix', icon: Camera, category: 'advanced', useCase: 'Tone' },
  { title: 'Color Mixer', description: 'Eksperimen RGB channel lab.', href: '/color-mixer', icon: Palette, category: 'advanced', useCase: 'Lab' },
  { title: 'Noise Studio', description: 'Analog grain texture studio.', href: '/noise', icon: Filter, category: 'advanced', useCase: 'Texture' },
  { title: 'Selective Gray', description: 'Isolasi warna tertentu dengan latar abu-abu.', href: '/selective-gray', icon: MousePointer2, category: 'advanced', useCase: 'Focus' },
  { title: 'Gamma Tuner', description: 'Koreksi pencahayaan mid-tone.', href: '/gamma', icon: Sun, category: 'advanced', useCase: 'Luma' },

  // 5. Studio Audio
  { title: 'Audio FX Studio', description: 'Edit suara dengan profil studio musik.', href: '/audio-cleaner', icon: Music, category: 'audio', useCase: 'Studio' },
  { title: 'Dead Air Remover', description: 'Hapus jeda sunyi secara otomatis.', href: '/dead-air-remover', icon: TimerOff, category: 'audio', useCase: 'Podcast' },
  { title: 'Subtitle Workstation', description: 'Workstation subtitle manual presisi.', href: '/voice-to-srt', icon: Captions, category: 'audio', useCase: 'Video' },

  // 6. Developer & Utility (Ekspansi Baru)
  { title: 'List Cleaner', description: 'Deduplikasi dan sortir daftar teks Anda.', href: '/list-cleaner', icon: ListChecks, category: 'dev', useCase: 'Text' },
  { title: 'Markdown Studio', description: 'Tulis dan pratinjau markdown secara real-time.', href: '/markdown-studio', icon: FileType, category: 'dev', useCase: 'Docs' },
  { title: 'JWT Inspector', description: 'Dekode token JWT secara lokal dan aman.', href: '/jwt-inspector', icon: ShieldCheck, category: 'dev', useCase: 'Auth' },
  { title: 'HTML Entities', description: 'Enkode dan dekode entitas HTML.', href: '/html-entities', icon: Code2, category: 'dev', useCase: 'HTML' },
  { title: 'Flexbox Studio', description: 'Generator tata letak CSS Flexbox visual.', href: '/flexbox-studio', icon: Layout, category: 'dev', useCase: 'CSS' },
  { title: 'JSON to YAML', description: 'Konversi JSON ke YAML secara instan.', href: '/json-yaml', icon: Braces, category: 'dev', useCase: 'Data' },
  { title: 'SQL Formatter', description: 'Rapikan kode SQL yang berantakan.', href: '/sql-formatter', icon: Database, category: 'dev', useCase: 'SQL' },
  { title: 'RegEx Lab', description: 'Uji ekspresi reguler secara langsung.', href: '/regex-lab', icon: SearchCode, category: 'dev', useCase: 'Logic' },
  { title: 'Color Contrast', description: 'Periksa rasio kontras warna aksesibilitas.', href: '/color-contrast', icon: Eye, category: 'dev', useCase: 'WCAG' },
  { title: 'CSV to JSON', description: 'Konversi data CSV ke format JSON.', href: '/csv-json', icon: Table, category: 'dev', useCase: 'Convert' },
  
  // 7. Utility Legacy
  { title: 'JSON Beautifier', description: 'Format dan rapikan kode JSON berantakan.', href: '/json-beautifier', icon: FileJson, category: 'dev', useCase: 'Code' },
  { title: 'Case Converter', description: 'Ubah teks ke UPPER, lower, camelCase.', href: '/case-converter', icon: Type, category: 'dev', useCase: 'Text' },
  { title: 'Hash Master', description: 'Generate hash SHA-256 secara lokal.', href: '/hash-master', icon: Lock, category: 'dev', useCase: 'Hash' },
  { title: 'URL Tool', description: 'Encode dan decode string URL dengan aman.', href: '/url-tool', icon: LinkIcon, category: 'dev', useCase: 'URL' },
  { title: 'PX to REM', description: 'Kalkulator konversi unit desain UI.', href: '/px-rem', icon: Ruler, category: 'dev', useCase: 'CSS' },
  { title: 'SVG Viewer', description: 'Inspeksi kode sumber file vektor SVG.', href: '/svg-view', icon: FileCode, category: 'dev', useCase: 'Vector' },
  { title: 'QR Generator', description: 'Generate kode QR statis instan.', href: '/qr-gen', icon: Binary, category: 'utility', useCase: 'Scan' },
  { title: 'Barcode Maker', description: 'Buat barcode standar untuk produk.', href: '/barcode-gen', icon: Barcode, category: 'utility', useCase: 'Retail' },
  { title: 'Password Pro', description: 'Generator kata sandi kuat dan aman.', href: '/password-gen', icon: Key, category: 'utility', useCase: 'Secure' },
  { title: 'Lorem Ipsum', description: 'Generator teks dummy untuk konten.', href: '/lorem-ipsum', icon: AlignLeft, category: 'utility', useCase: 'Draft' },
  { title: 'Aspect Ratio', description: 'Kalkulator rasio dimensi gambar.', href: '/aspect-calculator', icon: Hash, category: 'utility', useCase: 'Math' },
  { title: 'Favicon Gen', description: 'Buat ikon browser standar 32x32.', href: '/favicon-generator', icon: Box, category: 'utility', useCase: 'Web' },
];
