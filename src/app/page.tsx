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
  CheckCircle2
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
    badge: 'Paling Populer',
    useCase: 'Batch Processing'
  },
  {
    title: 'Generator Mockup',
    description: 'Presentasi produk profesional dengan bingkai browser dan latar belakang premium.',
    href: '/mockup',
    icon: Monitor,
    color: 'bg-purple-500/10 text-purple-600',
    badge: 'Desain Produk',
    useCase: 'Presentation'
  },
  {
    title: 'Resizer Pro',
    description: 'Ubah ukuran gambar untuk Instagram, TikTok, YouTube secara instan & presisi.',
    href: '/resizer',
    icon: Maximize2,
    color: 'bg-orange-500/10 text-orange-600',
    badge: 'Sosial Media',
    useCase: 'Content Resize'
  },
  {
    title: 'Potong Cerdas',
    description: 'Hapus area kosong atau margin transparan secara otomatis berbasis piksel.',
    href: '/trim',
    icon: Crop,
    color: 'bg-teal-500/10 text-teal-600',
    badge: 'Pembersih Aset',
    useCase: 'Auto Crop'
  },
  {
    title: 'Filter Studio',
    description: 'Edit kecerahan, kontras, dan terapkan filter artistik tanpa software berat.',
    href: '/filters',
    icon: SlidersHorizontal,
    color: 'bg-pink-500/10 text-pink-600',
    badge: 'Editor Cepat',
    useCase: 'Enhancement'
  },
  {
    title: 'Ekstrak Palet',
    description: 'Ambil skema warna HEX dari gambar untuk referensi desain brand Anda.',
    href: '/palette-extractor',
    icon: Pipette,
    color: 'bg-indigo-500/10 text-indigo-600',
    badge: 'Branding Kit',
    useCase: 'Color Picking'
  },
  {
    title: 'Watermark Pro',
    description: 'Lindungi karya Anda dengan logo atau teks hak cipta secara profesional.',
    href: '/watermark',
    icon: Stamp,
    color: 'bg-red-500/10 text-red-600',
    badge: 'Proteksi Karya',
    useCase: 'Copyright'
  },
  {
    title: 'Grid Splitter',
    description: 'Bagi gambar menjadi grid 3x3 atau 3x1 untuk tampilan profil estetik.',
    href: '/grid-splitter',
    icon: Grid3X3,
    color: 'bg-yellow-500/10 text-yellow-600',
    badge: 'Layout Kit',
    useCase: 'Instagram Grid'
  },
  {
    title: 'Hapus Metadata',
    description: 'Bersihkan data privasi EXIF dari foto Anda secara permanen & aman.',
    href: '/metadata-cleaner',
    icon: ShieldAlert,
    color: 'bg-green-500/10 text-green-600',
    badge: 'Privasi Aman',
    useCase: 'Privacy Clean'
  },
  {
    title: 'Base64 Tool',
    description: 'Ubah gambar menjadi string Base64 untuk kebutuhan pengembang web.',
    href: '/base64-tool',
    icon: Code2,
    color: 'bg-slate-500/10 text-slate-600',
    badge: 'Utilitas Dev',
    useCase: 'Data URI'
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
            Professional Visual Workstation
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Satu Workstation. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent animate-gradient-x">
              Sepuluh Kekuatan.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-xs sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-6 opacity-70">
            Ekosistem pengolahan visual terlengkap yang berjalan 100% lokal. 
            Cepat, aman, dan tanpa biaya berlangganan selamanya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto px-10 sm:px-0">
            <Button 
              size="lg"
              className="bg-accent text-white px-10 h-12 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:shadow-accent/40 transition-all hover:scale-105 active:scale-95"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Mulai Eksplorasi <Zap className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-12 backdrop-blur-md border-accent/20 font-bold text-xs uppercase tracking-widest hover:bg-accent/5" asChild>
              <Link href="/image-converter">Konversi Batch</Link>
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">Pilih alat yang Anda butuhkan</p>
              </div>
            </div>

            <div className="relative w-full md:w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari alat visual..." 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 animate-in fade-in duration-700">
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
                      <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Ready to use</span>
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
               <p className="text-muted-foreground font-medium">Tidak ada alat yang cocok dengan pencarian "{searchQuery}"</p>
               <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery('')}>Lihat Semua Alat</Button>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-[2.5rem] border-none space-y-4 group">
                <div className="p-3 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Zap className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Zero Latency</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  Semua proses dilakukan di perangkat Anda. Tanpa antrean server, tanpa upload data, hasil instan.
                </p>
            </div>
            <div className="glass-panel p-8 rounded-[2.5rem] border-none space-y-4 group">
                <div className="p-3 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Privacy First</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  Data Anda tidak pernah meninggalkan browser. Privasi 100% terjamin untuk aset perusahaan atau pribadi.
                </p>
            </div>
            <div className="glass-panel p-8 rounded-[2.5rem] border-none space-y-4 group">
                <div className="p-3 bg-accent/10 rounded-2xl w-fit group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6 text-accent" /></div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Industry Standard</h3>
                <p className="text-xs text-muted-foreground leading-relaxed opacity-80">
                  Output berkualitas tinggi yang dioptimalkan untuk web, media sosial, dan kebutuhan desain profesional.
                </p>
            </div>
        </div>

        {/* Professional Trust Area */}
        <div className="flex flex-wrap justify-center gap-12 py-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><ShieldCheck className="w-5 h-5" /> Secured</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><Globe className="w-5 h-5" /> Global Access</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><Zap className="w-5 h-5" /> Instant Engine</div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"><Maximize2 className="w-5 h-5" /> Pro Quality</div>
        </div>

      </div>
    </div>
  );
}