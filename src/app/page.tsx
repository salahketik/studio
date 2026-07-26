'use client';

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
  Palette,
  Info,
  Maximize2,
  SlidersHorizontal,
  Pipette,
  Stamp,
  Grid3X3,
  ShieldAlert,
  Code2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const visualTools = [
  {
    title: 'Konverter Gambar',
    description: 'Transformasi massal gambar ke WebP, JPG, atau PNG dengan optimasi instan.',
    href: '/image-converter',
    icon: FileImage,
    color: 'bg-blue-500/10 text-blue-600',
    badge: 'Multi-Batch'
  },
  {
    title: 'Generator Mockup',
    description: 'Presentasi produk profesional dengan bingkai browser dan latar AI.',
    href: '/mockup',
    icon: Monitor,
    color: 'bg-purple-500/10 text-purple-600',
    badge: 'Presentation'
  },
  {
    title: 'Resizer Pro',
    description: 'Ubah ukuran gambar untuk Instagram, TikTok, YouTube secara instan.',
    href: '/resizer',
    icon: Maximize2,
    color: 'bg-orange-500/10 text-orange-600',
    badge: 'Social Media'
  },
  {
    title: 'Potong Cerdas',
    description: 'Hapus area kosong atau margin transparan secara otomatis.',
    href: '/trim',
    icon: Crop,
    color: 'bg-teal-500/10 text-teal-600',
    badge: 'Pixel-Clean'
  },
  {
    title: 'Filter Studio',
    description: 'Edit kecerahan, kontras, dan terapkan filter artistik profesional.',
    href: '/filters',
    icon: SlidersHorizontal,
    color: 'bg-pink-500/10 text-pink-600',
    badge: 'Photo Editor'
  },
  {
    title: 'Ekstrak Palet',
    description: 'Ambil skema warna HEX dari gambar untuk referensi desain.',
    href: '/palette-extractor',
    icon: Pipette,
    color: 'bg-indigo-500/10 text-indigo-600',
    badge: 'Branding'
  },
  {
    title: 'Watermark Pro',
    description: 'Lindungi karya Anda dengan logo atau teks hak cipta.',
    href: '/watermark',
    icon: Stamp,
    color: 'bg-red-500/10 text-red-600',
    badge: 'Protection'
  },
  {
    title: 'Grid Splitter',
    description: 'Bagi gambar menjadi grid 3x3 atau 3x1 untuk profil estetik.',
    href: '/grid-splitter',
    icon: Grid3X3,
    color: 'bg-yellow-500/10 text-yellow-600',
    badge: 'Content Kit'
  },
  {
    title: 'Hapus Metadata',
    description: 'Bersihkan data privasi EXIF dari foto Anda secara permanen.',
    href: '/metadata-cleaner',
    icon: ShieldAlert,
    color: 'bg-green-500/10 text-green-600',
    badge: 'Privacy'
  },
  {
    title: 'Base64 Tool',
    description: 'Ubah gambar menjadi string Base64 untuk kebutuhan pengembang.',
    href: '/base64-tool',
    icon: Code2,
    color: 'bg-slate-500/10 text-slate-600',
    badge: 'Dev Utility'
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-full hero-gradient pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:p-12 lg:p-20 space-y-16 sm:space-y-20">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-6 sm:pt-0">
          <Badge variant="outline" className="px-4 py-1 text-[9px] sm:text-[10px] text-primary border-primary/30 bg-primary/5 rounded-full uppercase tracking-widest font-bold">
            <Sparkles className="w-3 h-3 mr-2" />
            Ultimate Visual Workstation
          </Badge>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
            Kreativitas Tanpa <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Batas Teknis.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4 opacity-80">
            Ekosistem 10 alat pengolahan gambar profesional yang berjalan 100% lokal di browser Anda. Cepat, aman, dan tanpa biaya berlangganan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto px-6 sm:px-0">
            <button 
              className="bg-accent text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl hover:shadow-accent/20 transition-all active:scale-95 w-full sm:w-auto"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Mulai Eksplorasi <Zap className="ml-2 w-3.5 h-3.5 inline" />
            </button>
            <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm h-11 w-full sm:w-auto font-bold text-sm" asChild>
              <Link href="/image-converter">Konversi Batch</Link>
            </Button>
          </div>
        </div>

        {/* Visual Tools Grid */}
        <div id="tools" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4 border-border/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-card shadow-sm border border-border/20 text-accent">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase">Dashboard Alat</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium">10 Modul Visual Aktif</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {visualTools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <Card className="tool-card h-full flex flex-col border-border/10 bg-card/40 hover:bg-card transition-all duration-300">
                  <CardHeader className="p-5">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 shadow-sm",
                      tool.color
                    )}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <CardTitle className="text-sm font-bold group-hover:text-accent transition-colors tracking-tight">
                        {tool.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80 line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-2 p-5 flex items-center justify-between">
                     <Badge variant="secondary" className="text-[8px] uppercase tracking-wider font-black bg-accent/5 text-accent/60 border-none group-hover:bg-accent/10 transition-colors">
                        {tool.badge}
                      </Badge>
                    <div className="flex items-center text-[10px] font-black text-accent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      BUKA <ArrowRight className="ml-1 w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl border-none shadow-sm space-y-3">
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                  <Zap className="w-4 h-4 text-accent" /> Kecepatan Lokal
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Semua proses dilakukan di perangkat Anda. Tidak ada antrean server, data tidak pernah meninggalkan browser, dan privasi Anda terjamin 100%.
                </p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-none shadow-sm space-y-3">
                <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                  <Maximize2 className="w-4 h-4 text-accent" /> Standar Industri
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Output berkualitas tinggi yang dioptimalkan untuk performa web dan media sosial tanpa kompromi pada fidelitas visual.
                </p>
            </div>
        </div>

        {/* Trust Badge Area */}
        <div className="flex flex-wrap justify-center gap-8 py-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> Secure Processing</div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><Globe className="w-4 h-4" /> Global Standards</div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><Zap className="w-4 h-4" /> Zero Latency</div>
        </div>

      </div>
    </div>
  );
}
