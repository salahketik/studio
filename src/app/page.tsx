'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileImage, Monitor, Crop, ArrowRight, Sparkles, Zap, 
  LayoutGrid, Maximize2, SlidersHorizontal, Pipette, Stamp, Grid3X3, 
  ShieldAlert, Code2, ImageIcon, Palette, 
  Layers, Wind, Box, Split, Eye, 
  Type, Scaling, Ghost, Contrast, Aperture, Paintbrush2, Minimize2, 
  IterationCcw, Frame, Component, Focus, Sun, Download, Filter,
  Music, TimerOff, Captions, Terminal, UserCircle,
  Hash, Disc, Binary, Share2, Search,
  Database, Clock, Heart, Monitor as Screen, Globe,
  Activity, Zap as Flash, Scissors, Eraser, Move3d,
  Layers2, Barchart2, Braces, Ruler, Layout
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const allTools = [
  // Core & Files
  { title: 'Konverter Gambar', description: 'Konversi massal ke WebP, JPG, PNG.', href: '/image-converter', icon: FileImage, category: 'core', useCase: 'Batch' },
  { title: 'PNG Optimizer', description: 'Optimasi aset PNG tanpa kehilangan.', href: '/png-opt', icon: Minimize2, category: 'core', useCase: 'Size' },
  { title: 'PDF Suite', description: 'Transformasi PDF ke Word/Excel/PPT.', href: '/pdf-converter', icon: Globe, category: 'core', useCase: 'Docs' },
  { title: 'DPI Adjuster', description: 'Atur resolusi cetak (DPI) gambar.', href: '/dpi-adjuster', icon: Hash, category: 'core', useCase: 'Print' },
  { title: 'Hapus Metadata', description: 'Bersihkan data privasi EXIF permanen.', href: '/metadata-cleaner', icon: ShieldAlert, category: 'core', useCase: 'Privacy' },
  { title: 'Base64 Tool', description: 'Ubah gambar ke string data URI.', href: '/base64-tool', icon: Code2, category: 'core', useCase: 'Dev' },
  
  // Social & Layout
  { title: 'Resizer Pro', description: 'Preset media sosial & kustom piksel.', href: '/resizer', icon: Maximize2, category: 'social', useCase: 'Resize' },
  { title: 'Grid Splitter', description: 'Potong gambar untuk grid Instagram.', href: '/grid-splitter', icon: Grid3X3, category: 'social', useCase: 'IG Feed' },
  { title: 'Potong Cerdas', description: 'Hapus margin kosong secara otomatis.', href: '/trim', icon: Crop, category: 'social', useCase: 'Cleanup' },
  { title: 'Image Stitcher', description: 'Gabungkan gambar secara vertikal.', href: '/stitcher', icon: Split, category: 'social', useCase: 'Layout' },
  { title: 'Generator Mockup', description: 'Presentasi produk dengan frame browser.', href: '/mockup', icon: Monitor, category: 'social', useCase: 'Showcase' },
  { title: 'Circular Avatar', description: 'Potong gambar menjadi profil bulat.', href: '/avatar-circle', icon: UserCircle, category: 'social', useCase: 'Profile' },
  { title: 'Corner Rounder', description: 'Bulatkan sudut gambar secara presisi.', href: '/corners', icon: Frame, category: 'social', useCase: 'UI/UX' },
  { title: 'Pattern Maker', description: 'Hasilkan tekstur pola berulang.', href: '/pattern', icon: Scaling, category: 'social', useCase: 'Texture' },
  { title: 'Canvas Text', description: 'Tambah caption teks pada kanvas.', href: '/canvas-text', icon: Type, category: 'social', useCase: 'Text' },
  
  // Studio FX (Artistic)
  { title: 'Filter Studio', description: 'Edit kecerahan, kontras, & mood.', href: '/filters', icon: SlidersHorizontal, category: 'studio', useCase: 'Editor' },
  { title: 'Ekstrak Palet', description: 'Ambil kode HEX warna dari gambar.', href: '/palette-extractor', icon: Pipette, category: 'studio', useCase: 'Colors' },
  { title: 'Grayscale Pro', description: 'Kontrol monokrom kontras tinggi.', href: '/grayscale-pro', icon: ImageIcon, category: 'studio', useCase: 'B&W' },
  { title: 'Duotone Filter', description: 'Efek gradasi dua warna modern.', href: '/duotone', icon: Sparkles, category: 'studio', useCase: 'Art' },
  { title: 'Film Grain', description: 'Tekstur vintage grain artistik.', href: '/film-grain', icon: Wind, category: 'studio', useCase: 'Texture' },
  { title: 'Glitch Maker', description: 'Efek distorsi digital artistik.', href: '/glitch', icon: IterationCcw, category: 'studio', useCase: 'Digital' },
  { title: 'ASCII Art Pro', description: 'Ubah gambar menjadi karakter teks.', href: '/ascii-art', icon: Terminal, category: 'studio', useCase: 'Text' },
  { title: 'Kaleidoscope', description: 'Ciptakan geometri fraktal melingkar.', href: '/kaleido', icon: Focus, category: 'studio', useCase: 'Fractal' },
  { title: 'Posterize Art', description: 'Reduksi warna gaya seni pop.', href: '/posterize', icon: Paintbrush2, category: 'studio', useCase: 'Pop Art' },
  { title: 'Pixelate Art', description: 'Ubah gambar menjadi gaya 8-bit.', href: '/pixelate', icon: Component, category: 'studio', useCase: 'Retro' },
  { title: 'Vignette Studio', description: 'Fokus dramatis pada tepian gambar.', href: '/vignette', icon: Aperture, category: 'studio', useCase: 'Drama' },
  { title: 'Threshold B&W', description: 'Konversi biner hitam putih murni.', href: '/threshold', icon: Contrast, category: 'studio', useCase: 'Binary' },
  { title: 'Loji Mixer', description: 'Pencampuran warna logaritmik.', href: '/loji-mix', icon: Flash, category: 'studio', useCase: 'Tone' },
  { title: 'Halftone Art', description: 'Efek titik koran klasik.', href: '/halftone', icon: Binary, category: 'studio', useCase: 'Retro' },
  
  // Technical Editor
  { title: 'Mirror Studio', description: 'Efek cermin reflektif horizontal.', href: '/mirror', icon: IterationCcw, category: 'advanced', useCase: 'Symmetry' },
  { title: 'Luminance Tool', description: 'Kontrol pencahayaan tingkat lanjut.', href: '/luminance', icon: Sun, category: 'advanced', useCase: 'Light' },
  { title: 'Opacity Pro', description: 'Kontrol saluran alfa transparansi.', href: '/opacity', icon: Ghost, category: 'advanced', useCase: 'Alpha' },
  { title: 'Shadow Studio', description: 'Tambah kedalaman bayangan drop.', href: '/shadow-studio', icon: Layers, category: 'advanced', useCase: 'Depth' },
  { title: 'Perspective Warp', description: 'Transformasi 3D skew & tilt.', href: '/perspective', icon: Move3d, category: 'advanced', useCase: '3D' },
  { title: 'Color Inverter', description: 'Efek klise foto negatif.', href: '/invert', icon: IterationCcw, category: 'advanced', useCase: 'Negative' },
  { title: 'Blur Pro', description: 'Gaussian depth adjustment.', href: '/blur', icon: Ghost, category: 'advanced', useCase: 'Focus' },
  { title: 'Noise Studio', description: 'Analog grain texture adder.', href: '/noise', icon: Filter, category: 'advanced', useCase: 'Texture' },
  { title: 'Image Border', description: 'Bingkai seni halus kustom.', href: '/image-border', icon: Frame, category: 'advanced', useCase: 'Frame' },
  { title: 'Overlay Studio', description: 'Gabungkan dua gambar (layers).', href: '/overlay', icon: Layers2, category: 'advanced', useCase: 'Merge' },
  { title: 'CMYK Splitter', description: 'Pisahkan kanal warna cetak.', href: '/cmyk-split', icon: Palette, category: 'advanced', useCase: 'Print' },

  // Audio Studio
  { title: 'Audio FX Studio', description: 'Edit suara dengan profil studio.', href: '/audio-cleaner', icon: Music, category: 'audio', useCase: 'Studio' },
  { title: 'Dead Air Remover', description: 'Hapus bagian diam secara otomatis.', href: '/dead-air-remover', icon: TimerOff, category: 'audio', useCase: 'Podcast' },
  { title: 'Voice to SRT', description: 'Workstation subtitle manual presisi.', href: '/voice-to-srt', icon: Captions, category: 'audio', useCase: 'Video' },
  
  // Website & Dev
  { title: 'QR Code Maker', description: 'Generate kode QR statis instan.', href: '/qr-gen', icon: Binary, category: 'utility', useCase: 'Scan' },
  { title: 'Favicon Gen', description: 'Buat ikon situs web .ico standar.', href: '/favicon-generator', icon: Box, category: 'utility', useCase: 'Web' },
  { title: 'SVG Viewer', description: 'Inspeksi & pratinjau kode vektor.', href: '/svg-view', icon: Code2, category: 'utility', useCase: 'Vector' },
  { title: 'Aspect Calc', description: 'Kalkulator proporsi dimensi.', href: '/aspect-calculator', icon: Hash, category: 'utility', useCase: 'Math' },
  { title: 'EXIF Inspector', description: 'Baca atribut data gambar biner.', href: '/exif-view', icon: Eye, category: 'utility', useCase: 'Metadata' },
  { title: 'Color Mixer', description: 'Eksperimen RGB channel lab.', href: '/color-mixer', icon: Palette, category: 'utility', useCase: 'Mix' },
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
    <div className="min-h-full pb-20 workstation-content">
      <div className="container mx-auto px-6 lg:px-10 py-10 space-y-12">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase">Dashboard</h1>
              <p className="text-muted-foreground text-[12px] font-medium opacity-60">
                 Welcome back, Zeron. 60+ Modules fully initialized.
              </p>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-green" />
                 <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">System Online</span>
              </div>
           </div>
        </div>

        {/* Main Grid Layout: Stats + Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Stats Cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Modules', value: '60', sub: 'Active & Verified', icon: Sparkles, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Latency', value: '0ms', sub: '100% Local Processing', icon: Flash, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { label: 'Memory Use', value: '4.8 MB', sub: 'Buffer Optimized', icon: Database, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                { label: 'Build Status', value: 'Stable', sub: 'v2.8.5 Production', icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10' },
              ].map((stat, i) => (
                <Card key={i} className="bg-[#11121d] border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent -translate-y-12 translate-x-12 rounded-full group-hover:scale-150 transition-transform duration-700" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{stat.label}</p>
                          <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                      </div>
                      <div className={cn("p-2 rounded-xl", stat.bg)}>
                        <stat.icon className={cn("w-4 h-4", stat.color)} />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground relative z-10">
                      <ArrowRight className={cn("w-3 h-3", stat.color)} /> {stat.sub}
                    </div>
                </Card>
              ))}
            </div>

            {/* Search Bar Hub */}
            <div className="relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity" />
               <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 60+ workstation modules..." 
                className="h-16 pl-14 pr-6 rounded-[2rem] bg-[#11121d] border-white/5 focus-visible:ring-1 focus-visible:ring-accent/40 text-sm font-bold tracking-tight shadow-xl"
               />
            </div>
          </div>

          {/* Right Column: Developer Info Card */}
          <div className="lg:col-span-4">
            <Card className="bg-[#11121d] border-white/5 rounded-[2.5rem] p-8 space-y-8 sticky top-24 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 blur-[80px] -translate-y-20 translate-x-20 group-hover:bg-accent/10 transition-all duration-700" />
               
               <div className="flex items-center gap-2 text-muted-foreground/40">
                  <div className="p-1.5 bg-white/5 rounded-lg"><Screen className="w-3.5 h-3.5" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Master Node</span>
               </div>

               <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse" />
                    <Avatar className="h-16 w-16 border-2 border-accent/20 relative z-10 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <AvatarImage src="https://picsum.photos/seed/zeron/200/200" />
                      <AvatarFallback>AZ</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black tracking-tight leading-none">Agler Zeroun (Zeron)</h3>
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">Lead Digital Architect</p>
                  </div>
               </div>

               <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-medium">
                  Founder of RonzX7 Developer. Specialized in building high-performance local workstations that prioritize user privacy and professional speed.
               </p>

               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-[1.5rem] space-y-2 border border-white/5 hover:border-white/10 transition-colors text-center">
                     <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Engine</p>
                     <p className="text-[13px] font-black">Pure Canvas</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-[1.5rem] space-y-2 border border-white/5 hover:border-white/10 transition-colors text-center">
                     <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Build</p>
                     <p className="text-[13px] font-black">v2.8.5 Stable</p>
                  </div>
               </div>

               <div className="pt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                       <div key={i} className="w-7 h-7 rounded-full border-2 border-[#11121d] bg-white/5 flex items-center justify-center overflow-hidden">
                          <img src={`https://picsum.photos/seed/${i+50}/50/50`} className="w-full h-full object-cover grayscale opacity-50" />
                       </div>
                     ))}
                     <div className="w-7 h-7 rounded-full border-2 border-[#11121d] bg-accent/20 flex items-center justify-center text-[8px] font-black text-accent">+{allTools.length}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10 hover:text-accent">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </Card>
          </div>

        </div>

        {/* Tools Hub Grid */}
        <div className="space-y-8 pt-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-accent" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">Explore Modules</h2>
             </div>
             <Badge variant="secondary" className="bg-accent/10 text-accent text-[9px] uppercase tracking-widest font-black px-4 py-1 border-none">
                {filteredTools.length} Available Tools
             </Badge>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-1000">
              {filteredTools.map((tool) => (
                <Link key={tool.title} href={tool.href} className="group">
                  <Card className="tool-card h-full flex flex-col border-white/5 bg-[#11121d]/40 hover:bg-[#161827] rounded-[2rem] overflow-hidden transition-all duration-500">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 group-hover:scale-110 shadow-sm border border-white/5",
                          tool.category === 'core' && 'bg-blue-500/10 text-blue-500',
                          tool.category === 'social' && 'bg-orange-500/10 text-orange-500',
                          tool.category === 'studio' && 'bg-pink-500/10 text-pink-500',
                          tool.category === 'advanced' && 'bg-purple-500/10 text-purple-500',
                          tool.category === 'utility' && 'bg-slate-500/10 text-slate-500',
                          tool.category === 'audio' && 'bg-emerald-500/10 text-emerald-500',
                        )}>
                          <tool.icon className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-[0.2em] font-black opacity-30 group-hover:opacity-100 transition-opacity border-white/10">
                          {tool.useCase}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-[13px] font-black tracking-tight uppercase leading-tight">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-[10px] leading-snug text-muted-foreground/60 pt-1 line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4 p-6 flex items-center justify-between border-t border-white/5">
                      <span className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.3em]">Load Module</span>
                      <div className="flex items-center text-[10px] font-black text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-[#11121d]/40 rounded-[3rem] border border-dashed border-white/5">
               <div className="p-4 bg-white/5 rounded-full inline-block"><Search className="w-8 h-8 text-muted-foreground opacity-20" /></div>
               <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
