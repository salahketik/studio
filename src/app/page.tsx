'use client';

import Link from 'next/link';
import { 
  FileImage, 
  Monitor, 
  Volume2, 
  Crop, 
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  LayoutGrid,
  TimerOff,
  Music4,
  Palette,
  Captions
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categories = [
  {
    name: 'Audio & Suara',
    description: 'Produksi dan pengeditan audio dengan teknologi DSP dan AI.',
    icon: Music4,
    color: 'text-orange-600',
    tools: [
      {
        title: 'Audio FX Studio',
        description: 'Transformasi suara dengan 20 profil studio dan visualizer reaktif.',
        href: '/audio-cleaner',
        icon: Volume2,
        color: 'bg-orange-500/10 text-orange-600',
        badge: 'Studio DSP'
      },
      {
        title: 'Voice to Subtitle',
        description: 'Transkripsi suara otomatis ke format subtitle SRT menggunakan Gemini AI atau Manual Studio.',
        href: '/voice-to-srt',
        icon: Captions,
        color: 'bg-purple-500/10 text-purple-600',
        badge: 'Smart Transcribe'
      },
      {
        title: 'Hapus Bagian Diam',
        description: 'Deteksi dan hapus jeda kosong (dead air) secara otomatis pada audio.',
        href: '/dead-air-remover',
        icon: TimerOff,
        color: 'bg-yellow-500/10 text-yellow-600',
        badge: 'Cerdas AI'
      },
    ]
  },
  {
    name: 'Visual & Gambar',
    description: 'Alat pengolahan gambar dan pembuatan aset desain profesional.',
    icon: Palette,
    color: 'text-blue-600',
    tools: [
      {
        title: 'Konverter Gambar',
        description: 'Transformasi gambar ke WebP, JPG, atau PNG dengan analisis cerdas AI.',
        href: '/image-converter',
        icon: FileImage,
        color: 'bg-blue-500/10 text-blue-600',
        badge: 'Optimasi AI'
      },
      {
        title: 'Generator Mockup',
        description: 'Ciptakan visual produk profesional dengan latar belakang buatan AI.',
        href: '/mockup',
        icon: Monitor,
        color: 'bg-purple-500/10 text-purple-600',
        badge: 'Imagen AI'
      },
      {
        title: 'Potong Otomatis',
        description: 'Segmentasi gambar cerdas untuk membuang area kosong secara instan.',
        href: '/trim',
        icon: Crop,
        color: 'bg-teal-500/10 text-teal-600',
      },
    ]
  }
];

export default function DashboardPage() {
  return (
    <div className="min-h-full hero-gradient pb-20">
      <div className="container mx-auto p-6 md:p-16 lg:p-24 space-y-24">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Badge variant="outline" className="px-6 py-1.5 text-primary border-primary/30 bg-primary/10 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Gratis & Tanpa Batas Selamanya
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Workstation Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Kreativitas Terpadu.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Satu ekosistem alat kreatif profesional yang dikelompokkan untuk mempercepat alur kerja Anda dengan presisi AI tinggi.
          </p>

          <div className="flex gap-4 pt-4">
            <button 
              className="bg-accent text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-accent/20 transition-all active:scale-95"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Jelajahi Alat <Zap className="ml-2 w-4 h-4 inline" />
            </button>
            <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm h-14" asChild>
              <Link href="/image-converter">Mulai Konversi</Link>
            </Button>
          </div>
        </div>

        {/* Tools by Category */}
        <div id="tools" className="space-y-20">
          {categories.map((category) => (
            <div key={category.name} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-border/20">
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl bg-card shadow-sm border border-border/20", category.color)}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">{category.name}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.tools.map((tool) => (
                  <Link key={tool.title} href={tool.href} className="group">
                    <Card className="tool-card h-full flex flex-col border-border/10 bg-card/60">
                      <CardHeader>
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:rotate-6",
                          tool.color
                        )}>
                          <tool.icon className="w-7 h-7" />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-2xl group-hover:text-accent transition-colors">
                            {tool.title}
                          </CardTitle>
                          {tool.badge && (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-accent/10 text-accent border-none">
                              {tool.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base leading-relaxed text-muted-foreground/80">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto pt-6">
                        <div className="flex items-center text-sm font-bold text-accent translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                          Buka Alat <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Features */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left border-none shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="p-4 bg-primary/20 rounded-2xl shadow-inner"><LayoutGrid className="w-8 h-8 text-accent" /></div>
                <div className="space-y-2">
                    <h4 className="text-xl font-bold">Terorganisir</h4>
                    <p className="text-muted-foreground">Alat yang dikelompokkan berdasarkan kebutuhan alur kerja Anda.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="p-4 bg-primary/20 rounded-2xl shadow-inner"><ShieldCheck className="w-8 h-8 text-accent" /></div>
                <div className="space-y-2">
                    <h4 className="text-xl font-bold">Privasi Utama</h4>
                    <p className="text-muted-foreground">Pemrosesan lokal di browser Anda untuk keamanan data maksimal.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="p-4 bg-primary/20 rounded-2xl shadow-inner"><Globe className="w-8 h-8 text-accent" /></div>
                <div className="space-y-2">
                    <h4 className="text-xl font-bold">Akses Instan</h4>
                    <p className="text-muted-foreground">Tanpa login, tanpa biaya. Siap digunakan kapan pun Anda butuh.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
