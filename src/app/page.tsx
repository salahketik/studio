
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
  Database, Activity, Cpu, HardDrive,
  Wand2, Layers2, Scan, RefreshCcw, Flame, Droplets, Coins, Puzzle,
  Camera, MousePointer2, BoxSelect, Eraser, Move3d,
  CircleDashed, ImagePlus, Monitor as Screen,
  GlassWater, Focus as FocusIcon, Layers as LayersIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const allTools = [
  // 1. Berkas Core
  { title: 'Konverter Gambar', description: 'Konversi massal ke WebP, JPG, PNG secara lokal.', href: '/image-converter', icon: FileImage, category: 'core', useCase: 'Batch' },
  { title: 'Optimasi PNG', description: 'Kompresi aset PNG tanpa mengurangi kualitas.', href: '/png-opt', icon: Minimize2, category: 'core', useCase: 'Ukuran' },
  { title: 'Suite PDF', description: 'Transformasi PDF ke Word, Excel, atau PPT.', href: '/pdf-converter', icon: ShieldAlert, category: 'core', useCase: 'Dokumen' },
  { title: 'Atur DPI', description: 'Ubah resolusi cetak metadata gambar.', href: '/dpi-adjuster', icon: Hash, category: 'core', useCase: 'Cetak' },
  { title: 'Hapus Metadata', description: 'Bersihkan data privasi EXIF secara permanen.', href: '/metadata-cleaner', icon: ShieldAlert, category: 'core', useCase: 'Privasi' },
  { title: 'Base64 Tool', description: 'Ubah gambar menjadi string data URI.', href: '/base64-tool', icon: Code2, category: 'core', useCase: 'Dev' },
  
  // 2. Kreator & Layout
  { title: 'Resizer Pro', description: 'Preset media sosial & kustom resolusi.', href: '/resizer', icon: Maximize2, category: 'social', useCase: 'Resize' },
  { title: 'Grid Splitter', description: 'Potong gambar untuk grid profil Instagram.', href: '/grid-splitter', icon: Grid3X3, category: 'social', useCase: 'IG Feed' },
  { title: 'Potong Cerdas', description: 'Hapus margin kosong secara otomatis.', href: '/trim', icon: Crop, category: 'social', useCase: 'Bersih' },
  { title: 'Image Stitcher', description: 'Gabungkan banyak gambar secara vertikal.', href: '/stitcher', icon: Split, category: 'social', useCase: 'Layout' },
  { title: 'Generator Mockup', description: 'Presentasi produk dengan frame browser.', href: '/mockup', icon: Screen, category: 'social', useCase: 'Showcase' },
  { title: 'Avatar Bulat', description: 'Potong foto menjadi profil lingkaran.', href: '/avatar-circle', icon: UserCircle, category: 'social', useCase: 'Profil' },
  { title: 'Corner Rounder', description: 'Bulatkan sudut gambar dengan presisi.', href: '/corners', icon: Frame, category: 'social', useCase: 'UI/UX' },
  { title: 'Canvas Text', description: 'Tambah teks caption pada kanvas gambar.', href: '/canvas-text', icon: Type, category: 'social', useCase: 'Teks' },
  { title: 'Watermark Pro', description: 'Tambah logo/teks hak cipta pada gambar.', href: '/watermark', icon: ImagePlus, category: 'social', useCase: 'Copyright' },

  // 3. Studio FX (Artistic)
  { title: 'Filter Studio', description: 'Edit pencahayaan, kontras, & suasana.', href: '/filters', icon: SlidersHorizontal, category: 'studio', useCase: 'Editor' },
  { title: 'Ekstrak Palet', description: 'Ambil kode HEX warna dari piksel foto.', href: '/palette-extractor', icon: Pipette, category: 'studio', useCase: 'Warna' },
  { title: 'Grayscale Pro', description: 'Kontrol monokrom kontras tinggi.', href: '/grayscale-pro', icon: ImageIcon, category: 'studio', useCase: 'Hitam Putih' },
  { title: 'Duotone Filter', description: 'Efek gradasi dua warna artistik.', href: '/duotone', icon: Sparkles, category: 'studio', useCase: 'Seni' },
  { title: 'Vignette Studio', description: 'Efek gelap dramatis pada tepian gambar.', href: '/vignette', icon: Aperture, category: 'studio', useCase: 'Drama' },
  { title: 'Posterize Art', description: 'Pengurangan warna gaya Pop Art.', href: '/posterize', icon: Paintbrush2, category: 'studio', useCase: 'Retro' },
  { title: 'Film Grain', description: 'Tekstur grain vintage sinematik.', href: '/film-grain', icon: Wind, category: 'studio', useCase: 'Analog' },
  { title: 'Glitch Maker', description: 'Efek distorsi digital bergaya cyberpunk.', href: '/glitch', icon: IterationCcw, category: 'studio', useCase: 'Digital' },
  { title: 'ASCII Art Pro', description: 'Ubah gambar menjadi karakter teks unik.', href: '/ascii-art', icon: Terminal, category: 'studio', useCase: 'Retro' },
  { title: 'Kaleidoscope', description: 'Ciptakan geometri fraktal melingkar.', href: '/kaleido', icon: Focus, category: 'studio', useCase: 'Fraktal' },
  { title: 'Pixelate Art', description: 'Ubah gambar menjadi gaya retro 8-bit.', href: '/pixelate', icon: Component, category: 'studio', useCase: 'Retro' },

  // 4. Editor Teknis (Precision)
  { title: 'Sharpen Pro', description: 'Tingkatkan ketajaman garis tepi gambar.', href: '/sharpen', icon: Wand2, category: 'advanced', useCase: 'Detail' },
  { title: 'Mirror Studio', description: 'Efek cermin reflektif horizontal.', href: '/mirror', icon: IterationCcw, category: 'advanced', useCase: 'Simetri' },
  { title: 'Luminance Tool', description: 'Kontrol pencahayaan tingkat lanjut.', href: '/luminance', icon: Sun, category: 'advanced', useCase: 'Cahaya' },
  { title: 'Opacity Pro', description: 'Kontrol saluran alfa transparansi.', href: '/opacity', icon: Ghost, category: 'advanced', useCase: 'Alpha' },
  { title: 'Shadow Studio', description: 'Tambah kedalaman bayangan (drop shadow).', href: '/shadow-studio', icon: Layers, category: 'advanced', useCase: 'Dimensi' },
  { title: 'Perspective Warp', description: 'Transformasi 3D skew & tilt gambar.', href: '/perspective', icon: Move3d, category: 'advanced', useCase: '3D' },
  { title: 'Threshold B&W', description: 'Konversi biner hitam putih murni.', href: '/threshold', icon: Contrast, category: 'advanced', useCase: 'Binary' },
  { title: 'Color Mixer', description: 'Eksperimen RGB channel lab.', href: '/color-mixer', icon: Palette, category: 'advanced', useCase: 'Lab' },
  { title: 'Loji Mixer', description: 'Pencampuran warna logaritma.', href: '/loji-mix', icon: Camera, category: 'advanced', useCase: 'Tone' },

  // 5. Studio Audio
  { title: 'Audio FX Studio', description: 'Edit suara dengan profil studio musik.', href: '/audio-cleaner', icon: Music, category: 'audio', useCase: 'Studio' },
  { title: 'Dead Air Remover', description: 'Hapus jeda sunyi secara otomatis.', href: '/dead-air-remover', icon: TimerOff, category: 'audio', useCase: 'Podcast' },
  { title: 'Subtitle Workstation', description: 'Workstation subtitle manual presisi.', href: '/voice-to-srt', icon: Captions, category: 'audio', useCase: 'Video' },

  // 6. Utilitas Dev & Desain Baru
  { title: 'Gradient Studio', description: 'Generator gradien linear & radial.', href: '/gradient-gen', icon: Palette, category: 'utility', useCase: 'CSS' },
  { title: 'Glassmorphism', description: 'Generator efek kaca transparan CSS.', href: '/glassmorphism', icon: GlassWater, category: 'utility', useCase: 'UI' },
  { title: 'Tilt-Shift FX', description: 'Efek miniatur dengan blur lensa.', href: '/tilt-shift', icon: FocusIcon, category: 'utility', useCase: 'Fokus' },
  { title: 'Lomo Camera', description: 'Filter saturasi tinggi & vignette klasik.', href: '/lomo', icon: Camera, category: 'utility', useCase: 'Vintage' },
  { title: 'Polaroid Frame', description: 'Bingkai foto instan gaya retro.', href: '/polaroid', icon: Box, category: 'utility', useCase: 'Instan' },
  { title: 'QR Generator', description: 'Generate kode QR statis instan.', href: '/qr-gen', icon: Binary, category: 'utility', useCase: 'Scan' },
  { title: 'Favicon Gen', description: 'Buat ikon situs web .ico standar.', href: '/favicon-generator', icon: Box, category: 'utility', useCase: 'Web' },
  { title: 'SVG Inspector', description: 'Inspeksi & pratinjau kode vektor SVG.', href: '/svg-view', icon: Code2, category: 'utility', useCase: 'Vektor' },
  { title: 'Kalkulator Aspek', description: 'Hitung proporsi dimensi gambar.', href: '/aspect-calculator', icon: Hash, category: 'utility', useCase: 'Desain' },
  { title: 'Inspektur EXIF', description: 'Baca atribut data biner asli foto.', href: '/exif-view', icon: Eye, category: 'utility', useCase: 'Metadata' },
  { title: 'Pola Berulang', description: 'Buat pratinjau pola ubin mulus.', href: '/pattern', icon: Scaling, category: 'utility', useCase: 'Texture' },
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
    <div className="min-h-full pb-20 workstation-content bg-[#090a0f]">
      <div className="container mx-auto px-6 lg:px-12 py-10 space-y-12">
        
        {/* Dashboard Header - Clean & Wide */}
        <div className="flex flex-col space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Dasbor</h1>
            <div className="flex items-center justify-between">
               <p className="text-muted-foreground text-sm font-medium opacity-60">
                 Sistem terintegrasi. {allTools.length}+ modul operasional siap digunakan.
               </p>
               <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Sistem Online</span>
               </div>
            </div>
        </div>

        {/* Workstation Statistics - Horizontal Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Modul', value: `${allTools.length}+`, sub: 'Aktif & Stabil', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Latensi Node', value: '0ms', sub: 'Pemrosesan Lokal', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { label: 'Memori Cache', value: '2.8 MB', sub: 'Buffer Optimal', icon: Database, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { label: 'Status Build', value: 'v3.8.0', sub: 'Stabil Pro', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <Card key={i} className="bg-[#11121d] border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group border hover:border-accent/30 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent -translate-y-16 translate-x-16 rounded-full group-hover:scale-125 transition-transform duration-700" />
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{stat.label}</p>
                      <p className="text-3xl font-black tracking-tight text-white">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">
                  <ArrowRight className={cn("w-3.5 h-3.5", stat.color)} /> {stat.sub}
                </div>
            </Card>
          ))}
        </div>

        {/* Global Search Hub - Prominent */}
        <div className="relative group max-w-4xl mx-auto">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity" />
           <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di antara 90+ modul workstation..." 
            className="h-20 pl-16 pr-8 rounded-[2.5rem] bg-[#11121d] border-white/5 focus-visible:ring-1 focus-visible:ring-accent/40 text-lg font-bold tracking-tight shadow-2xl text-white placeholder:text-muted-foreground/30"
           />
        </div>

        {/* Tools Exploration Grid */}
        <div className="space-y-10 pt-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-accent" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Eksplorasi Modul Utama</h2>
             </div>
             <Badge variant="secondary" className="bg-accent/10 text-accent text-[10px] uppercase tracking-widest font-black px-6 py-1.5 border-none rounded-full">
                {filteredTools.length} Alat Tersedia
             </Badge>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {filteredTools.map((tool) => (
                <Link key={tool.title} href={tool.href} className="group">
                  <Card className="tool-card h-full flex flex-col rounded-[2.5rem] border border-white/5 hover:border-accent/40 transition-all duration-500 bg-[#11121d]/40 backdrop-blur-md overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                          "w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-lg border border-white/5",
                          tool.category === 'core' && 'bg-blue-500/10 text-blue-500',
                          tool.category === 'social' && 'bg-orange-500/10 text-orange-500',
                          tool.category === 'studio' && 'bg-pink-500/10 text-pink-500',
                          tool.category === 'advanced' && 'bg-purple-500/10 text-purple-500',
                          tool.category === 'utility' && 'bg-slate-500/10 text-slate-500',
                          tool.category === 'audio' && 'bg-emerald-500/10 text-emerald-500',
                        )}>
                          <tool.icon className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] font-black opacity-30 group-hover:opacity-100 transition-opacity border-white/10 px-3 py-1 rounded-full">
                          {tool.useCase}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-base font-black tracking-tighter uppercase text-white leading-tight">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-xs leading-relaxed text-muted-foreground/60 line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto pt-6 p-8 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
                      <span className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] group-hover:text-accent/40 transition-colors">Muat Modul</span>
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6 bg-[#11121d]/40 rounded-[3rem] border border-dashed border-white/5">
               <div className="p-6 bg-white/5 rounded-full inline-block animate-bounce"><Search className="w-10 h-10 text-muted-foreground opacity-20" /></div>
               <div className="space-y-1">
                  <p className="text-white text-lg font-bold uppercase tracking-widest">Modul tidak ditemukan</p>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest opacity-60">Coba gunakan kata kunci lain seperti 'Konversi' atau 'Filter'</p>
               </div>
               <Button variant="outline" onClick={() => setSearchQuery('')} className="rounded-full px-8 text-xs font-bold uppercase tracking-widest border-white/10">
                 Reset Pencarian
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
