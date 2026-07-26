'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileImage, 
  Monitor, 
  Crop, 
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  LayoutGrid,
  Maximize2,
  SlidersHorizontal,
  Pipette,
  Stamp,
  Grid3X3,
  ShieldAlert,
  Code2,
  Search,
  X,
  CheckCircle2,
  Box,
  Image as ImageIcon,
  RotateCcw,
  Palette,
  Calculator,
  Layers,
  Wind,
  Square,
  FileCode
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const visualTools = [
  {
    title: 'Konverter Gambar',
    description: 'Transformasi massal gambar ke WebP, JPG, atau PNG dengan optimisasi instan.',
    href: '/image-converter',
    icon: FileImage,
    color: 'bg-blue-500/10 text-blue-600',
    badge: 'Popular',
    useCase: 'Batch'
  },
  {
    title: 'Generator Mockup',
    description: 'Presentasi produk profesional dengan bingkai browser dan latar belakang premium.',
    href: '/mockup',
    icon: Monitor,
    color: 'bg-purple-500/10 text-purple-600',
    badge: 'Design',
    useCase: 'Showcase'
  },
  {
    title: 'Resizer Pro',
    description: 'Ubah ukuran gambar untuk Instagram, TikTok, YouTube secara instan & presisi.',
    href: '/resizer',
    icon: Maximize2,
    color: 'bg-orange-500/10 text-orange-600',
    badge: 'Sosial',
    useCase: 'Resize'
  },
  {
    title: 'Potong Cerdas',
    description: 'Hapus area kosong atau margin transparan secara otomatis berbasis piksel.',
    href: '/trim',
    icon: Crop,
    color: 'bg-teal-500/10 text-teal-600',
    badge: 'Cleanup',
    useCase: 'Auto Crop'
  },
  {
    title: 'Filter Studio',
    description: 'Edit kecerahan, kontras, dan terapkan filter artistik tanpa software berat.',
    href: '/filters',
    icon: SlidersHorizontal,
    color: 'bg-pink-500/10 text-pink-600',
    badge: 'Editor',
    useCase: 'Filters'
  },
  {
    title: 'Ekstrak Palet',
    description: 'Ambil skema warna HEX dari gambar untuk referensi desain brand Anda.',
    href: '/palette-extractor',
    icon: Pipette,
    color: 'bg-indigo-500/10 text-indigo-600',
    badge: 'Inspiration',
    useCase: 'Colors'
  },
  {
    title: 'Watermark Pro',
    description: 'Lindungi karya Anda dengan logo atau teks hak cipta secara profesional.',
    href: '/watermark',
    icon: Stamp,
    color: 'bg-red-500/10 text-red-600',
    badge: 'Copyright',
    useCase: 'Protect'
  },
  {
    title: 'Grid Splitter',
    description: 'Bagi gambar menjadi grid 3x3 atau 3x1 untuk tampilan profil estetik.',
    href: '/grid-splitter',
    icon: Grid3X3,
    color: 'bg-yellow-500/10 text-yellow-600',
    badge: 'Layout',
    useCase: 'Instagram'
  },
  {
    title: 'Hapus Metadata',
    description: 'Bersihkan data privasi EXIF dari foto Anda secara permanen & aman.',
    href: '/metadata-cleaner',
    icon: ShieldAlert,
    color: 'bg-green-500/10 text-green-600',
    badge: 'Privacy',
    useCase: 'Security'
  },
  {
    title: 'Base64 Tool',
    description: 'Ubah gambar menjadi string Base64 untuk kebutuhan pengembang web.',
    href: '/base64-tool',
    icon: Code2,
    color: 'bg-slate-500/10 text-slate-600',
    badge: 'Developer',
    useCase: 'Data URI'
  },
  // New 10 Tools
  {
    title: 'Favicon Generator',
    description: 'Buat file favicon .ico berbagai ukuran (16x16, 32x32) secara otomatis.',
    href: '/favicon-generator',
    icon: Box,
    color: 'bg-amber-500/10 text-amber-600',
    badge: 'Web Utility',
    useCase: 'Favicon'
  },
  {
    title: 'Shadow Studio',
    description: 'Tambahkan bayangan drop-shadow lembut yang profesional ke aset transparan.',
    href: '/shadow-studio',
    icon: Layers,
    color: 'bg-indigo-500/10 text-indigo-600',
    badge: 'Styling',
    useCase: 'Depth'
  },
  {
    title: 'Image Flipper',
    description: 'Putar atau balikkan gambar secara horizontal dan vertikal secara instan.',
    href: '/image-flipper',
    icon: RotateCcw,
    color: 'bg-emerald-500/10 text-emerald-600',
    badge: 'Orientation',
    useCase: 'Flip'
  },
  {
    title: 'Grayscale Pro',
    description: 'Ubah gambar berwarna menjadi hitam putih murni dengan kontras tinggi.',
    href: '/grayscale-pro',
    icon: ImageIcon,
    color: 'bg-zinc-500/10 text-zinc-600',
    badge: 'B&W',
    useCase: 'Monochrome'
  },
  {
    title: 'Color Mixer',
    description: 'Mixer warna visual untuk menciptakan harmoni warna baru secara manual.',
    href: '/color-mixer',
    icon: Palette,
    color: 'bg-rose-500/10 text-rose-600',
    badge: 'Artistic',
    useCase: 'Mixing'
  },
  {
    title: 'Aspect Calculator',
    description: 'Hitung rasio aspek dan dimensi gambar secara presisi untuk desain.',
    href: '/aspect-calculator',
    icon: Calculator,
    color: 'bg-cyan-500/10 text-cyan-600',
    badge: 'Utility',
    useCase: 'Proportions'
  },
  {
    title: 'Duotone Filter',
    description: 'Terapkan efek dua warna (Duotone) yang modern ke foto apa pun.',
    href: '/duotone',
    icon: Sparkles,
    color: 'bg-violet-500/10 text-violet-600',
    badge: 'Creative',
    useCase: 'Styles'
  },
  {
    title: 'Film Grain',
    description: 'Tambahkan tekstur grain film vintage yang artistik ke gambar digital Anda.',
    href: '/film-grain',
    icon: Wind,
    color: 'bg-stone-500/10 text-stone-600',
    badge: 'Vibe',
    useCase: 'Texturizing'
  },
  {
    title: 'Border Master',
    description: 'Tambahkan bingkai solid atau gradien ke sekeliling gambar Anda.',
    href: '/image-border',
    icon: Square,
    color: 'bg-lime-500/10 text-lime-600',
    badge: 'Framing',
    useCase: 'Border'
  },
  {
    title: 'SVG Viewer',
    description: 'Pratinjau kode SVG dan ekspor sebagai gambar resolusi tinggi.',
    href: '/svg-view',
    icon: FileCode,
    color: 'bg-orange-500/10 text-orange-600',
    badge: 'Developer',
    useCase: 'SVG'
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return visualTools.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.useCase.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-full hero-gradient pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:p-12 lg:px-24 space-y-16 sm:space-y-24">
        
        {/* Premium Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-10 sm:pt-4">
          <Badge variant="outline" className="px-5 py-1.5 text-[9px] sm:text-[10px] text-accent border-accent/20 bg-accent/5 rounded-full uppercase tracking-[0.2em] font-black">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-accent" />
            Ultimate Visual Workstation
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            20 Alat Kreatif. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-gradient-x">
              Satu Ekosistem Lokal.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-xs sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-6 opacity-70">
            Workstation digital terlengkap yang berjalan 100% di browser Anda. 
            Cepat, murni lokal, dan dirancang untuk profesional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto px-10 sm:px-0">
            <Button 
              size="lg"
              className="bg-accent text-white px-10 h-12 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Jelajahi 20 Alat <Zap className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search & Tool Grid */}
        <div id="tools" className="space-y-10 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6 border-border/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent text-white shadow-xl shadow-accent/20">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase italic">Modul Kreatif</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">Cari di antara 20 alat visual</p>
              </div>
            </div>

            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari alat (cth: mockup, grid, shadow)..." 
                className="pl-11 h-12 rounded-2xl bg-white/50 backdrop-blur-sm border-accent/10 focus:border-accent/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8" 
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in duration-700">
              {filteredTools.map((tool) => (
                <Link key={tool.title} href={tool.href} className="group">
                  <Card className="tool-card h-full flex flex-col border-border/10 bg-card/30 hover:bg-card/90 transition-all duration-500 rounded-3xl">
                    <CardHeader className="p-6">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                        tool.color
                      )}>
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <CardTitle className="text-sm font-black group-hover:text-accent transition-colors tracking-tight uppercase">
                          {tool.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-[8px] uppercase tracking-[0.15em] font-black bg-accent/5 text-accent/50 border-none">
                          {tool.useCase}
                        </Badge>
                      </div>
                      <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80 pt-3 line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-0 p-6 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Ready</span>
                      <div className="flex items-center text-[10px] font-black text-accent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        BUKA <ArrowRight className="ml-1 w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 glass-panel rounded-3xl border-dashed">
               <Search className="w-12 h-12 text-muted-foreground/20 mx-auto" />
               <p className="text-muted-foreground font-medium">Tidak ada alat yang cocok dengan "{searchQuery}"</p>
               <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery('')}>Tampilkan Semua 20 Alat</Button>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-none space-y-4 group">
                <div className="p-3 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Zap className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Speed of Light</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  Pemrosesan kanvas lokal tanpa antrean server. Hasil instan untuk workflow profesional Anda.
                </p>
            </div>
            <div className="glass-panel p-8 rounded-[2.5rem] border-none space-y-4 group">
                <div className="p-3 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Privacy Engine</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  Data Anda adalah privasi Anda. 100% pemrosesan dilakukan di perangkat tanpa upload cloud.
                </p>
            </div>
            <div className="glass-panel p-8 rounded-[2.5rem] border-none space-y-4 group">
                <div className="p-3 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-black uppercase tracking-tighter">20-In-1 Power</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  Dari konversi batch hingga shadow studio. Semua kebutuhan visual dalam satu alamat web.
                </p>
            </div>
        </div>

        {/* Professional Trust Area */}
        <div className="flex flex-wrap justify-center gap-12 py-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><ShieldCheck className="w-5 h-5" /> Secured</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><Globe className="w-5 h-5" /> Global</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><Zap className="w-5 h-5" /> Instant</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><Maximize2 className="w-5 h-5" /> HQ Output</div>
        </div>

      </div>
    </div>
  );
}