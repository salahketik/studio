'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileImage, Monitor, Crop, ArrowRight, Sparkles, Zap, ShieldCheck, 
  LayoutGrid, Maximize2, SlidersHorizontal, Pipette, Stamp, Grid3X3, 
  ShieldAlert, Code2, Search, Box, Image as ImageIcon, RotateCcw, 
  Palette, Calculator, Layers, Wind, Square, FileCode, Split, Eye, 
  Type, Scaling, Ghost, Contrast, Aperture, Paintbrush2, Minimize2, 
  IterationCcw, Frame, Component, Focus, Sun, Camera, Download, Filter,
  Music, Mic2, TimerOff, Captions, QrCode, Barcode, Terminal, UserCircle,
  Hash, Disc, Binary, Share2, ScanLine, Layers2, MousePointer2, Settings2,
  Tv2, Waves, Heart, Globe, SearchCode
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'Semua Alat', icon: LayoutGrid },
  { id: 'core', label: 'Core & Export', icon: Zap },
  { id: 'social', label: 'Social & Layout', icon: Grid3X3 },
  { id: 'studio', label: 'Studio & Filter', icon: Palette },
  { id: 'advanced', label: 'Pro Graphics', icon: Layers2 },
  { id: 'utility', label: 'Utility & Dev', icon: Code2 },
  { id: 'audio', label: 'Audio & Voice', icon: Music },
];

const visualTools = [
  // CORE & EXPORT (10)
  { title: 'Konverter Gambar', description: 'Konversi massal ke WebP, JPG, PNG.', href: '/image-converter', icon: FileImage, category: 'core', useCase: 'Batch' },
  { title: 'PNG Optimizer', description: 'Optimasi aset PNG tanpa kehilangan.', href: '/png-opt', icon: Minimize2, category: 'core', useCase: 'Size' },
  { title: 'Generator Mockup', description: 'Presentasi produk dengan frame browser.', href: '/mockup', icon: Monitor, category: 'core', useCase: 'Showcase' },
  { title: 'PDF Converter', description: 'Transformasi PDF ke Word/Excel/PPT.', href: '/pdf-converter', icon: Globe, category: 'core', useCase: 'Docs' },
  { title: 'DPI Adjuster', description: 'Atur resolusi cetak (DPI) gambar.', href: '/dpi-adjuster', icon: Hash, category: 'core', useCase: 'Print' },
  { title: 'WebP Tester', description: 'Bandingkan kualitas vs ukuran WebP.', href: '/webp-test', icon: SearchCode, category: 'core', useCase: 'Analyze' },
  { title: 'SVG Viewer', description: 'Inspeksi & pratinjau kode SVG.', href: '/svg-view', icon: FileCode, category: 'core', useCase: 'Vector' },
  { title: 'Favicon Maker', description: 'Buat file .ico standar web.', href: '/favicon-generator', icon: Box, category: 'core', useCase: 'Web Icon' },
  { title: 'Hapus Metadata', description: 'Bersihkan data privasi EXIF permanen.', href: '/metadata-cleaner', icon: ShieldAlert, category: 'core', useCase: 'Privacy' },
  { title: 'Base64 Tool', description: 'Ubah gambar ke string data URI.', href: '/base64-tool', icon: Code2, category: 'core', useCase: 'Dev' },

  // SOCIAL & LAYOUT (10)
  { title: 'Resizer Pro', description: 'Preset media sosial & kustom piksel.', href: '/resizer', icon: Maximize2, category: 'social', useCase: 'Resize' },
  { title: 'Grid Splitter', description: 'Potong gambar untuk grid Instagram.', href: '/grid-splitter', icon: Grid3X3, category: 'social', useCase: 'IG Feed' },
  { title: 'Potong Cerdas', description: 'Hapus margin kosong secara otomatis.', href: '/trim', icon: Crop, category: 'social', useCase: 'Cleanup' },
  { title: 'Image Stitcher', description: 'Gabungkan gambar secara vertikal.', href: '/stitcher', icon: Split, category: 'social', useCase: 'Layout' },
  { title: 'Circular Avatar', description: 'Potong gambar menjadi profil bulat.', href: '/avatar-circle', icon: UserCircle, category: 'social', useCase: 'Profile' },
  { title: 'Image Flipper', description: 'Putar balik gambar secara instan.', href: '/image-flipper', icon: RotateCcw, category: 'social', useCase: 'Flip' },
  { title: 'Corner Rounder', description: 'Bulatkan sudut gambar secara presisi.', href: '/corners', icon: Frame, category: 'social', useCase: 'UI/UX' },
  { title: 'Mirror Studio', description: 'Efek cermin reflektif horizontal.', href: '/mirror', icon: IterationCcw, category: 'social', useCase: 'Symmetry' },
  { title: 'Canvas Text', description: 'Tambahkan teks minimalis ke gambar.', href: '/canvas-text', icon: Type, category: 'social', useCase: 'Banner' },
  { title: 'Aspect Ratio', description: 'Kalkulator proporsi & dimensi.', href: '/aspect-calculator', icon: Calculator, category: 'social', useCase: 'Logic' },

  // STUDIO & FILTERS (20)
  { title: 'Filter Studio', description: 'Edit kecerahan, kontras, & mood.', href: '/filters', icon: SlidersHorizontal, category: 'studio', useCase: 'Editor' },
  { title: 'Ekstrak Palet', description: 'Ambil kode HEX warna dari gambar.', href: '/palette-extractor', icon: Pipette, category: 'studio', useCase: 'Colors' },
  { title: 'Grayscale Pro', description: 'Kontrol monokrom kontras tinggi.', href: '/grayscale-pro', icon: ImageIcon, category: 'studio', useCase: 'B&W' },
  { title: 'Duotone Filter', description: 'Efek gradasi dua warna modern.', href: '/duotone', icon: Sparkles, category: 'studio', useCase: 'Art' },
  { title: 'Film Grain', description: 'Tekstur vintage grain artistik.', href: '/film-grain', icon: Wind, category: 'studio', useCase: 'Texture' },
  { title: 'Vignette Studio', description: 'Efek fokus tepian gelap dramatis.', href: '/vignette', icon: Aperture, category: 'studio', useCase: 'Focus' },
  { title: 'Pixelate Art', description: 'Sensor atau efek retro pixelation.', href: '/pixelate', icon: Component, category: 'studio', useCase: 'Retro' },
  { title: 'Glitch Maker', description: 'Efek distorsi digital artistik.', href: '/glitch', icon: IterationCcw, category: 'studio', useCase: 'Digital' },
  { title: 'Noise Studio', description: 'Kurangi atau tambahkan noise visual.', href: '/noise', icon: Filter, category: 'studio', useCase: 'Grain' },
  { title: 'Threshold B&W', description: 'Ubah ke hitam putih murni (biner).', href: '/threshold', icon: Contrast, category: 'studio', useCase: 'Shape' },
  { title: 'Posterize Filter', description: 'Kurangi palet warna bergaya poster.', href: '/posterize', icon: Paintbrush2, category: 'studio', useCase: 'Art' },
  { title: 'Loji Mixer', description: 'Pencampuran warna logaritma murni.', href: '/loji-mix', icon: Camera, category: 'studio', useCase: 'Tone' },
  { title: 'Color Inverter', description: 'Balikkan warna gambar (negatif).', href: '/invert', icon: IterationCcw, category: 'studio', useCase: 'Logic' },
  { title: 'ASCII Art Pro', description: 'Ubah gambar menjadi karakter teks.', href: '/ascii-art', icon: Terminal, category: 'studio', useCase: 'Text' },
  { title: 'Halftone Filter', description: 'Efek titik cetak retro koran.', href: '/halftone', icon: Binary, category: 'studio', useCase: 'Print' },
  { title: 'Lomo Cam', description: 'Filter vintage saturasi tinggi.', href: '/lomo', icon: Disc, category: 'studio', useCase: 'Toy' },
  { title: 'Scanline FX', description: 'Efek garis monitor CRT lama.', href: '/scanline', icon: ScanLine, category: 'studio', useCase: 'TV' },
  { title: 'Solarize Art', description: 'Efek pembalikan warna artistik.', href: '/solarize', icon: Sun, category: 'studio', useCase: 'Neon' },
  { title: 'Emboss Effect', description: 'Ubah gambar menjadi tekstur 3D.', href: '/emboss', icon: MousePointer2, category: 'studio', useCase: 'Relief' },
  { title: 'Sharpen Tool', description: 'Perjelas detail dan tepian gambar.', href: '/sharpen', icon: Settings2, category: 'studio', useCase: 'Details' },

  // PRO GRAPHICS & LAYERS (10)
  { title: 'Watermark Pro', description: 'Tambahkan logo/teks hak cipta.', href: '/watermark', icon: Stamp, category: 'advanced', useCase: 'Protect' },
  { title: 'Shadow Studio', description: 'Drop-shadow lembut untuk aset PNG.', href: '/shadow-studio', icon: Layers, category: 'advanced', useCase: 'Depth' },
  { title: 'Border Master', description: 'Tambahkan bingkai artistik.', href: '/image-border', icon: Square, category: 'advanced', useCase: 'Frame' },
  { title: 'Image Overlay', description: 'Tumpuk gambar dengan blend mode.', href: '/overlay', icon: Layers, category: 'advanced', useCase: 'Composite' },
  { title: 'Blur Pro', description: 'Gaussian blur dengan radius kustom.', href: '/blur', icon: Ghost, category: 'advanced', useCase: 'Depth' },
  { title: 'Opacity Adjuster', description: 'Atur transparansi aset visual.', href: '/opacity', icon: Ghost, category: 'advanced', useCase: 'Alpha' },
  { title: 'Pattern Maker', description: 'Ubah gambar menjadi pola berulang.', href: '/pattern', icon: Scaling, category: 'advanced', useCase: 'Texture' },
  { title: 'Kaleidoscope', description: 'Efek geometri fraktal reaktif.', href: '/kaleido', icon: Focus, category: 'advanced', useCase: 'Fractal' },
  { title: 'Luminance Tool', description: 'Kontrol pencahayaan tingkat lanjut.', href: '/luminance', icon: Sun, category: 'advanced', useCase: 'Light' },
  { title: 'Perspective Warp', description: 'Ubah sudut pandang gambar (Skew).', href: '/perspective', icon: Share2, category: 'advanced', useCase: 'Transform' },

  // UTILITY & DEV (5)
  { title: 'QR Code Maker', description: 'Buat kode QR untuk link/teks.', href: '/qr-gen', icon: QrCode, category: 'utility', useCase: 'Contact' },
  { title: 'Barcode Studio', description: 'Generate barcode standar produk.', href: '/barcode-gen', icon: Barcode, category: 'utility', useCase: 'Retail' },
  { title: 'EXIF Inspector', description: 'Lihat metadata detail tanpa hapus.', href: '/exif-view', icon: Eye, category: 'utility', useCase: 'Metadata' },
  { title: 'Color Blind Sim', description: 'Simulasi penglihatan buta warna.', href: '/color-blind', icon: Heart, category: 'utility', useCase: 'A11y' },
  { title: 'CMYK Splitter', description: 'Visualisasi kanal warna cetak.', href: '/cmyk-split', icon: Palette, category: 'utility', useCase: 'Preview' },

  // AUDIO & VOICE (5)
  { title: 'Audio FX Studio', description: 'Edit suara dengan profil studio.', href: '/audio-cleaner', icon: Music, category: 'audio', useCase: 'Studio' },
  { title: 'Dead Air Remover', description: 'Hapus bagian diam secara otomatis.', href: '/dead-air-remover', icon: TimerOff, category: 'audio', useCase: 'Podcast' },
  { title: 'Voice to SRT', description: 'Workstation subtitle manual presisi.', href: '/voice-to-srt', icon: Captions, category: 'audio', useCase: 'Video' },
  { title: 'Voice Enhancer', description: 'Meningkatkan kejernihan vokal.', href: '/voice-boost', icon: Mic2, category: 'audio', useCase: 'Voice' },
  { title: 'Vintage Radio', description: 'Filter suara radio lama retro.', href: '/audio-vintage', icon: Tv2, category: 'audio', useCase: 'SFX' },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    return visualTools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.useCase.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-full hero-gradient pb-24 overflow-x-hidden workstation-content">
      <div className="container mx-auto px-4 sm:px-6 md:p-12 lg:px-24 space-y-12 sm:space-y-20">
        
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-10 sm:pt-6">
          <Badge variant="outline" className="px-5 py-1.5 text-[9px] sm:text-[10px] text-accent border-accent/20 bg-accent/5 rounded-full uppercase tracking-[0.25em] font-black">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-accent" />
            60-in-1 Ultimate Creative Workstation
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl">
            Solusi Kreatif <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary/80 to-accent animate-gradient-x">
              Tanpa Batas.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-[11px] sm:text-sm md:text-lg max-w-3xl mx-auto leading-relaxed px-8 opacity-80 uppercase tracking-widest font-medium">
            Ekosistem 60 alat modular untuk pengolahan visual, audio, dan utilitas digital. 
            <br className="hidden md:block" /> Berjalan instan secara lokal, menjamin privasi 100%.
          </p>
        </div>

        <div className="space-y-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 justify-between border-b pb-8 border-border/10">
            <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
              {categories.map((cat) => (
                <Button 
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    "rounded-full px-5 h-10 text-[10px] font-black uppercase tracking-widest transition-all",
                    activeCategory === cat.id ? "bg-accent text-white shadow-xl shadow-accent/20 scale-105" : "text-muted-foreground"
                  )}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <cat.icon className="w-3.5 h-3.5 mr-2" />
                  {cat.label}
                </Button>
              ))}
            </div>

            <div className="relative w-full lg:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari alat (cth: konversi, subtitle, qr)..." 
                className="pl-12 h-14 rounded-2xl bg-white/40 backdrop-blur-md border-accent/5 focus:border-accent/40 transition-all text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 animate-in fade-in duration-700">
            {filteredTools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <Card className="tool-card h-full flex flex-col border-border/5 bg-card/20 hover:bg-card/95 transition-all duration-500 rounded-[1.5rem]">
                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-sm",
                        tool.category === 'core' && 'bg-blue-500/10 text-blue-600',
                        tool.category === 'social' && 'bg-orange-500/10 text-orange-600',
                        tool.category === 'studio' && 'bg-pink-500/10 text-pink-600',
                        tool.category === 'advanced' && 'bg-purple-500/10 text-purple-600',
                        tool.category === 'utility' && 'bg-slate-500/10 text-slate-600',
                        tool.category === 'audio' && 'bg-emerald-500/10 text-emerald-600',
                      )}>
                        <tool.icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-[7px] uppercase tracking-widest font-black opacity-40 group-hover:opacity-100 transition-opacity">
                        {tool.useCase}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xs font-black tracking-tight uppercase leading-tight">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-[10px] leading-snug text-muted-foreground/70 pt-1 line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto pt-3 p-5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Open Module</span>
                    <div className="flex items-center text-[9px] font-black text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="py-24 text-center space-y-4 glass-panel rounded-[2rem] border-dashed border-muted-foreground/10">
               <Search className="w-12 h-12 text-muted-foreground/20 mx-auto" />
               <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Alat tidak ditemukan</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-70">
            {[
              { label: 'On-Demand Processor', icon: ShieldCheck, desc: 'Instan & Ringan' },
              { label: 'Privacy First', icon: Zap, desc: 'Tanpa Cloud Upload' },
              { label: 'High Fidelity', icon: Download, desc: 'Ekspor Berkualitas' },
              { label: '60 Modular Units', icon: Component, desc: 'Ekosistem Lengkap' }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:bg-white/60 transition-colors">
                  <stat.icon className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">{stat.label}</p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase">{stat.desc}</p>
                  </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
