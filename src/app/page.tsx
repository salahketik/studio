'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
  GlassWater, Camera, Cpu, Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const allTools = [
  // 1. Berkas Core
  { title: 'Konverter Gambar', description: 'Konversi massal ke WebP, JPG, PNG secara lokal.', href: '/image-converter', icon: FileImage, category: 'core', useCase: 'Batch' },
  { title: 'Optimasi PNG', description: 'Kompresi aset PNG tanpa mengurangi kualitas.', href: '/png-opt', icon: Minimize2, category: 'core', useCase: 'Size' },
  { title: 'Suite PDF', description: 'Transformasi PDF ke Word, Excel, atau PPT.', href: '/pdf-converter', icon: ShieldAlert, category: 'core', useCase: 'Doc' },
  { title: 'Atur DPI', description: 'Ubah resolusi cetak metadata gambar.', href: '/dpi-adjuster', icon: Hash, category: 'core', useCase: 'Print' },
  { title: 'Hapus Metadata', description: 'Bersihkan data privasi EXIF secara permanen.', href: '/metadata-cleaner', icon: ShieldAlert, category: 'core', useCase: 'Privacy' },
  { title: 'Base64 Tool', description: 'Ubah gambar menjadi string data URI.', href: '/base64-tool', icon: Code2, category: 'core', useCase: 'Dev' },
  
  // 2. Kreator & Layout
  { title: 'Resizer Pro', description: 'Preset media sosial & kustom resolusi.', href: '/resizer', icon: Maximize2, category: 'social', useCase: 'Resize' },
  { title: 'Grid Splitter', description: 'Potong gambar untuk grid profil Instagram.', href: '/grid-splitter', icon: Grid3X3, category: 'social', useCase: 'IG Feed' },
  { title: 'Potong Cerdas', description: 'Hapus margin kosong secara otomatis.', href: '/trim', icon: Crop, category: 'social', useCase: 'Clean' },
  { title: 'Image Stitcher', description: 'Gabungkan banyak gambar secara vertikal.', href: '/stitcher', icon: Split, category: 'social', useCase: 'Layout' },
  { title: 'Generator Mockup', description: 'Presentasi produk dengan frame browser.', icon: Monitor, href: '/mockup', category: 'social', useCase: 'Showcase' },
  { title: 'Avatar Bulat', description: 'Potong foto menjadi profil lingkaran.', href: '/avatar-circle', icon: UserCircle, category: 'social', useCase: 'Profile' },
  { title: 'Corner Rounder', description: 'Bulatkan sudut gambar dengan presisi.', href: '/corners', icon: Frame, category: 'social', useCase: 'UI/UX' },
  { title: 'Canvas Text', description: 'Tambah teks caption pada kanvas gambar.', href: '/canvas-text', icon: Type, category: 'social', useCase: 'Text' },
  { title: 'Watermark Pro', description: 'Tambah logo/teks hak cipta pada gambar.', href: '/watermark', icon: ImagePlus, category: 'social', useCase: 'Copyright' },
  { title: 'Image Flipper', description: 'Putar balik gambar secara horisontal/vertikal.', href: '/image-flipper', icon: RefreshCcw, category: 'social', useCase: 'Mirror' },

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
  { title: 'Mirror Studio', description: 'Efek cermin reflektif horizontal.', href: '/mirror', icon: IterationCcw, category: 'advanced', useCase: 'Symmetry' },
  { title: 'Luminance Tool', description: 'Kontrol pencahayaan tingkat lanjut.', href: '/luminance', icon: Sun, category: 'advanced', useCase: 'Lighting' },
  { title: 'Opacity Pro', description: 'Kontrol saluran alfa transparansi.', href: '/opacity', icon: Ghost, category: 'advanced', useCase: 'Alpha' },
  { title: 'Shadow Studio', description: 'Tambah kedalaman bayangan (drop shadow).', href: '/shadow-studio', icon: Layers, category: 'advanced', useCase: 'Depth' },
  { title: 'Threshold B&W', description: 'Konversi biner hitam putih murni.', href: '/threshold', icon: Contrast, category: 'advanced', useCase: 'Binary' },
  { title: 'Color Mixer', description: 'Eksperimen RGB channel lab.', href: '/color-mixer', icon: Palette, category: 'advanced', useCase: 'Lab' },
  { title: 'Loji Mixer', description: 'Pencampuran warna logaritma.', href: '/loji-mix', icon: Camera, category: 'advanced', useCase: 'Tone' },
  { title: 'Color Balance', description: 'Keseimbangan warna RGB tingkat lanjut.', href: '/color-balance', icon: Palette, category: 'advanced', useCase: 'Grading' },
  { title: 'Edge Detection', description: 'Analisis kontur garis tepi Laplacian.', href: '/edge-detection', icon: Wand2, category: 'advanced', useCase: 'Analytic' },

  // 5. Studio Audio
  { title: 'Audio FX Studio', description: 'Edit suara dengan profil studio musik.', href: '/audio-cleaner', icon: Music, category: 'audio', useCase: 'Studio' },
  { title: 'Dead Air Remover', description: 'Hapus jeda sunyi secara otomatis.', href: '/dead-air-remover', icon: TimerOff, category: 'audio', useCase: 'Podcast' },
  { title: 'Subtitle Workstation', description: 'Workstation subtitle manual presisi.', href: '/voice-to-srt', icon: Captions, category: 'audio', useCase: 'Video' },

  // 6. Utilitas Dev & Desain
  { title: 'Gradient Studio', description: 'Generator gradien linear & radial.', href: '/gradient-gen', icon: Palette, category: 'utility', useCase: 'CSS' },
  { title: 'Glassmorphism', description: 'Generator efek kaca transparan CSS.', href: '/glassmorphism', icon: GlassWater, category: 'utility', useCase: 'UI' },
  { title: 'Tilt-Shift FX', description: 'Efek miniatur dengan blur lensa.', icon: Focus, href: '/tilt-shift', category: 'utility', useCase: 'Focus' },
  { title: 'Lomo Camera', description: 'Filter saturasi tinggi & vignette klasik.', icon: Camera, href: '/lomo', category: 'utility', useCase: 'Vintage' },
  { title: 'Polaroid Frame', description: 'Bingkai foto instan gaya retro.', href: '/polaroid', icon: Box, category: 'utility', useCase: 'Instant' },
  { title: 'QR Generator', description: 'Generate kode QR statis instan.', href: '/qr-gen', icon: Binary, category: 'utility', useCase: 'Scan' },
  { title: 'Favicon Gen', description: 'Buat ikon situs web .ico standar.', href: '/favicon-generator', icon: Box, category: 'utility', useCase: 'Web' },
  { title: 'Kalkulator Aspek', description: 'Hitung proporsi dimensi gambar.', href: '/aspect-calculator', icon: Hash, category: 'utility', useCase: 'Design' },
  { title: 'Inspektur EXIF', description: 'Baca atribut data biner asli foto.', href: '/exif-view', icon: Eye, category: 'utility', useCase: 'Metadata' },
  { title: 'Pola Berulang', description: 'Buat pratinjau pola ubin mulus.', href: '/pattern', icon: Scaling, category: 'utility', useCase: 'Texture' },
  { title: 'Heatmap Visual', description: 'Analisis densitas warna piksel.', href: '/heatmap', icon: Flame, category: 'utility', useCase: 'Analytics' },
  { title: 'Image Border', description: 'Tambah bingkai artistik pada gambar.', href: '/image-border', icon: Frame, category: 'utility', useCase: 'Frame' },
  { title: 'Blur Pro', description: 'Filter blur Gaussian presisi tinggi.', href: '/blur', icon: Ghost, category: 'utility', useCase: 'Depth' },
  { title: 'Noise Studio', description: 'Tekstur grain analog kustom.', href: '/noise', icon: Filter, category: 'utility', useCase: 'Analog' },
  { title: 'Overlay Studio', description: 'Gabungkan dua gambar dengan transparansi.', href: '/overlay', icon: Layers, category: 'utility', useCase: 'Merge' },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.useCase.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-full pb-20 bg-background text-foreground">
      <div className="container mx-auto px-6 lg:px-10 py-10 space-y-12">
        
        {/* Header Ribbon */}
        <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Dasbor Utama</h1>
            <div className="flex items-center justify-between flex-wrap gap-4">
               <p className="text-muted-foreground text-xs font-medium opacity-60">
                 Workstation aktif. {allTools.length}+ modul operasional siap digunakan 100% lokal.
               </p>
               <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                 <div className="w-1.5 h-1.2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-primary tracking-widest">Node Stabil v4.5</span>
               </div>
            </div>
        </div>

        {/* Horizontal Stat Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Modul Aktif', value: `${allTools.length}+`, sub: 'Total Terintegrasi', icon: Cpu, color: 'text-primary' },
            { label: 'Latensi Node', value: '0ms', sub: 'Pemrosesan Lokal', icon: Zap, color: 'text-orange-500' },
            { label: 'Cache Buffer', value: '1.2 GB', sub: 'Optimasi RAM', icon: Database, color: 'text-cyan-500' },
            { label: 'Status Region', value: 'ID', sub: 'Bahasa Terpasang', icon: Globe, color: 'text-green-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/40 border-border/50 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{stat.label}</p>
                      <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/50">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                  <ArrowRight className="w-2.5 h-2.5" /> {stat.sub}
                </div>
            </Card>
          ))}
        </div>

        {/* Search Hub */}
        <div className="relative group max-w-3xl mx-auto">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity" />
           <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul visual (cth: konverter, filter, srt)..." 
            className="h-16 pl-14 pr-8 rounded-2xl bg-card/80 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 text-sm font-bold tracking-tight shadow-xl"
           />
        </div>

        {/* Tools Catalog */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
             <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Katalog Modul</h2>
             </div>
             <Badge variant="secondary" className="bg-primary/5 text-primary text-[8px] uppercase font-black px-4 py-0.5 border-none rounded-full">
                {filteredTools.length} Unit
             </Badge>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <Link key={tool.title} href={tool.href} className="group">
                  <Card className="tool-card h-full flex flex-col rounded-2xl">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-border/50",
                          tool.category === 'core' && 'bg-blue-500/10 text-blue-500',
                          tool.category === 'social' && 'bg-orange-500/10 text-orange-500',
                          tool.category === 'studio' && 'bg-pink-500/10 text-pink-500',
                          tool.category === 'advanced' && 'bg-purple-500/10 text-purple-500',
                          tool.category === 'utility' && 'bg-slate-500/10 text-slate-500',
                          tool.category === 'audio' && 'bg-emerald-500/10 text-emerald-500',
                        )}>
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="text-[8px] uppercase font-black opacity-30 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-full">
                          {tool.useCase}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-black tracking-tight uppercase leading-tight">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-[10px] leading-relaxed line-clamp-2 opacity-60">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4 p-6 flex items-center justify-between border-t border-border/5 bg-muted/5">
                      <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest group-hover:text-primary transition-colors">Buka Alat</span>
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-muted/20 rounded-3xl border border-dashed border-border/50">
               <Search className="w-10 h-10 text-muted-foreground opacity-10 mx-auto" />
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Modul tidak ditemukan</p>
               <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="rounded-full px-6 text-[10px] font-bold uppercase tracking-widest">
                 Reset
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}