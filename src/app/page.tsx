'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileImage, Monitor, Crop, ArrowRight, Sparkles, Zap, ShieldCheck, 
  LayoutGrid, Maximize2, SlidersHorizontal, Pipette, Stamp, Grid3X3, 
  ShieldAlert, Code2, Search, Box, Image as ImageIcon, RotateCcw, 
  Palette, Calculator, Layers, Wind, Square, FileCode, Split, Eye, 
  Type, Scaling, Ghost, Contrast, Aperture, Paintbrush2, Minimize2, 
  IterationCcw, Frame, Component, Focus, Sun, Camera, Download, Filter
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
  { id: 'advanced', label: 'Advanced Tools', icon: Layers },
  { id: 'utility', label: 'Utility & Dev', icon: Code2 },
];

const visualTools = [
  { title: 'Konverter Gambar', description: 'Konversi massal ke WebP, JPG, PNG.', href: '/image-converter', icon: FileImage, category: 'core', useCase: 'Batch' },
  { title: 'Generator Mockup', description: 'Presentasi produk dengan frame browser.', href: '/mockup', icon: Monitor, category: 'core', useCase: 'Showcase' },
  { title: 'Resizer Pro', description: 'Preset media sosial & kustom piksel.', href: '/resizer', icon: Maximize2, category: 'social', useCase: 'Resize' },
  { title: 'Potong Cerdas', description: 'Hapus margin kosong secara otomatis.', href: '/trim', icon: Crop, category: 'social', useCase: 'Cleanup' },
  { title: 'Filter Studio', description: 'Edit kecerahan, kontras, & mood.', href: '/filters', icon: SlidersHorizontal, category: 'studio', useCase: 'Editor' },
  { title: 'Ekstrak Palet', description: 'Ambil kode HEX warna dari gambar.', href: '/palette-extractor', icon: Pipette, category: 'studio', useCase: 'Colors' },
  { title: 'Watermark Pro', description: 'Tambahkan logo/teks hak cipta.', href: '/watermark', icon: Stamp, category: 'advanced', useCase: 'Protect' },
  { title: 'Grid Splitter', description: 'Potong gambar untuk grid Instagram.', href: '/grid-splitter', icon: Grid3X3, category: 'social', useCase: 'Instagram' },
  { title: 'Hapus Metadata', description: 'Bersihkan data privasi EXIF permanen.', href: '/metadata-cleaner', icon: ShieldAlert, category: 'utility', useCase: 'Security' },
  { title: 'Base64 Tool', description: 'Ubah gambar ke string data URI.', href: '/base64-tool', icon: Code2, category: 'utility', useCase: 'Dev' },
  { title: 'Favicon Generator', description: 'Buat file .ico berbagai ukuran.', href: '/favicon-generator', icon: Box, category: 'utility', useCase: 'Web Icon' },
  { title: 'Shadow Studio', description: 'Drop-shadow lembut untuk aset PNG.', href: '/shadow-studio', icon: Layers, category: 'advanced', useCase: 'Depth' },
  { title: 'Image Flipper', description: 'Putar balik gambar secara instan.', href: '/image-flipper', icon: RotateCcw, category: 'social', useCase: 'Flip' },
  { title: 'Grayscale Pro', description: 'Kontrol monokrom kontras tinggi.', href: '/grayscale-pro', icon: ImageIcon, category: 'studio', useCase: 'B&W' },
  { title: 'Color Mixer', description: 'Eksperimen harmoni warna baru.', href: '/color-mixer', icon: Palette, category: 'studio', useCase: 'Mixer' },
  { title: 'Aspect Ratio', description: 'Kalkulator proporsi & dimensi.', href: '/aspect-calculator', icon: Calculator, category: 'utility', useCase: 'Logic' },
  { title: 'Duotone Filter', description: 'Efek gradasi dua warna modern.', href: '/duotone', icon: Sparkles, category: 'studio', useCase: 'Creative' },
  { title: 'Film Grain', description: 'Tekstur vintage grain artistik.', href: '/film-grain', icon: Wind, category: 'studio', useCase: 'Texture' },
  { title: 'Border Master', description: 'Tambahkan bingkai solid/gradien.', href: '/image-border', icon: Square, category: 'advanced', useCase: 'Frame' },
  { title: 'SVG Viewer', description: 'Inspeksi & pratinjau kode SVG.', href: '/svg-view', icon: FileCode, category: 'utility', useCase: 'Dev' },
  { title: 'Vignette Studio', description: 'Efek fokus tepian gelap dramatis.', href: '/vignette', icon: Aperture, category: 'studio', useCase: 'Mood' },
  { title: 'Pixelate Art', description: 'Sensor atau efek retro pixelation.', href: '/pixelate', icon: Component, category: 'studio', useCase: 'Creative' },
  { title: 'Noise Studio', description: 'Kurangi atau tambahkan noise visual.', href: '/noise', icon: Filter, category: 'studio', useCase: 'Detail' },
  { title: 'Corner Rounder', description: 'Bulatkan sudut gambar secara presisi.', href: '/corners', icon: Frame, category: 'social', useCase: 'UI' },
  { title: 'Glitch Maker', description: 'Efek distorsi digital artistik.', href: '/glitch', icon: IterationCcw, category: 'studio', useCase: 'Creative' },
  { title: 'Image Overlay', description: 'Tumpuk gambar dengan blend mode.', href: '/overlay', icon: Layers, category: 'advanced', useCase: 'Stitch' },
  { title: 'Blur Pro', description: 'Gaussian blur dengan radius kustom.', href: '/blur', icon: Ghost, category: 'studio', useCase: 'Depth' },
  { title: 'Color Inverter', description: 'Balikkan warna gambar (negatif).', href: '/invert', icon: IterationCcw, category: 'studio', useCase: 'Logic' },
  { title: 'Posterize Filter', description: 'Kurangi palet warna bergaya poster.', href: '/posterize', icon: Paintbrush2, category: 'studio', useCase: 'Art' },
  { title: 'Luminance Tool', description: 'Kontrol pencahayaan tingkat lanjut.', href: '/luminance', icon: Sun, category: 'studio', useCase: 'Light' },
  { title: 'Opacity Adjuster', description: 'Atur transparansi aset visual.', href: '/opacity', icon: Ghost, category: 'advanced', useCase: 'Assets' },
  { title: 'Threshold B&W', description: 'Ubah ke hitam putih murni (biner).', href: '/threshold', icon: Contrast, category: 'studio', useCase: 'Silhouette' },
  { title: 'Mirror Studio', description: 'Efek cermin reflektif horizontal.', href: '/mirror', icon: IterationCcw, category: 'social', useCase: 'Symmetry' },
  { title: 'Canvas Text', description: 'Tambahkan teks minimalis ke gambar.', href: '/canvas-text', icon: Type, category: 'advanced', useCase: 'Banners' },
  { title: 'Image Stitcher', description: 'Gabungkan gambar secara vertikal.', href: '/stitcher', icon: Split, category: 'social', useCase: 'Layout' },
  { title: 'EXIF Inspector', description: 'Lihat metadata detail tanpa hapus.', href: '/exif-view', icon: Eye, category: 'utility', useCase: 'Info' },
  { title: 'PNG Optimizer', description: 'Optimasi aset PNG tanpa kehilangan.', href: '/png-opt', icon: Minimize2, category: 'core', useCase: 'Size' },
  { title: 'Pattern Maker', description: 'Ubah gambar menjadi pola berulang.', href: '/pattern', icon: Scaling, category: 'advanced', useCase: 'Repeat' },
  { title: 'Kaleidoscope', description: 'Efek geometri fraktal reaktif.', href: '/kaleido', icon: Focus, category: 'studio', useCase: 'Fractal' },
  { title: 'Loji Mixer', description: 'Pencampuran warna logaritma murni.', href: '/loji-mix', icon: Camera, category: 'studio', useCase: 'Color' },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    return visualTools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-full hero-gradient pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:p-12 lg:px-24 space-y-12 sm:space-y-20">
        
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-10 sm:pt-6">
          <Badge variant="outline" className="px-5 py-1.5 text-[9px] sm:text-[10px] text-accent border-accent/20 bg-accent/5 rounded-full uppercase tracking-[0.25em] font-black">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-accent" />
            Visual Creative Workstation 4.0
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] max-w-4xl">
            Workstation Efisien. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary/80 to-accent animate-gradient-x">
              Performa Maksimal.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-[11px] sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-8 opacity-80 uppercase tracking-widest font-medium">
            40 alat kreatif yang hanya berjalan saat Anda membutuhkannya. Hemat RAM, cepat, dan murni lokal.
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
                placeholder="Cari alat visual..." 
                className="pl-12 h-14 rounded-2xl bg-white/40 backdrop-blur-md border-accent/5 focus:border-accent/40 transition-all text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-in fade-in duration-700">
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
              { label: 'On-Demand Engine', icon: ShieldCheck, desc: 'Sangat Ringan' },
              { label: 'Zero Latency', icon: Zap, desc: 'Instan Lokal' },
              { label: 'Privacy 100%', icon: Download, desc: 'Tanpa Upload' },
              { label: '40 Modular Tools', icon: Component, desc: 'Ekosistem Lengkap' }
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
