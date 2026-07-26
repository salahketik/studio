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
  Maximize2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const visualTools = [
  {
    title: 'Konverter Gambar',
    description: 'Transformasi gambar ke WebP, JPG, atau PNG dengan analisis cerdas untuk hasil optimal.',
    href: '/image-converter',
    icon: FileImage,
    color: 'bg-blue-500/10 text-blue-600',
    badge: 'Multi-Batch'
  },
  {
    title: 'Generator Mockup',
    description: 'Ciptakan visual produk profesional dengan latar belakang artistik yang dihasilkan oleh AI Imagen 4.',
    href: '/mockup',
    icon: Monitor,
    color: 'bg-purple-500/10 text-purple-600',
    badge: 'AI Background'
  },
  {
    title: 'Resizer Pro',
    description: 'Ubah ukuran gambar secara instan untuk format Instagram, TikTok, YouTube, dan platform lainnya.',
    href: '/resizer',
    icon: Maximize2,
    color: 'bg-orange-500/10 text-orange-600',
    badge: 'Social Media'
  },
  {
    title: 'Potong Cerdas',
    description: 'Segmentasi gambar cerdas untuk membuang area kosong atau margin transparan secara instan.',
    href: '/trim',
    icon: Crop,
    color: 'bg-teal-500/10 text-teal-600',
    badge: 'Pixel Perfect'
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-full hero-gradient pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:p-16 lg:p-24 space-y-16 sm:y-24">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pt-10 sm:pt-0">
          <Badge variant="outline" className="px-4 sm:px-6 py-1.5 text-[10px] sm:text-xs text-primary border-primary/30 bg-primary/10 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Visual Creative Suite Professional
          </Badge>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Workstation Visual <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
              Kreativitas Tanpa Batas.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-sm sm:text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed px-4">
            Ekosistem alat pengolahan gambar profesional yang dirancang untuk mempercepat alur kerja desain Anda secara lokal, cepat, dan cerdas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto px-6 sm:px-0">
            <button 
              className="bg-accent text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-accent/20 transition-all active:scale-95 w-full sm:w-auto"
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Jelajahi Alat <Zap className="ml-2 w-4 h-4 inline" />
            </button>
            <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm h-12 sm:h-14 w-full sm:w-auto font-bold" asChild>
              <Link href="/image-converter">Mulai Konversi</Link>
            </Button>
          </div>
        </div>

        {/* Visual Tools Grid */}
        <div id="tools" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-border/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-card shadow-sm border border-border/20 text-blue-600">
                <Palette className="w-6 h-6 sm:w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Alat Kreatif</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Pengolahan gambar dan pembuatan aset desain profesional.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            {visualTools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <Card className="tool-card h-full flex flex-col border-border/10 bg-card/60">
                  <CardHeader className="p-5 sm:p-6">
                    <div className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500 group-hover:rotate-6",
                      tool.color
                    )}>
                      <tool.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg sm:text-xl group-hover:text-accent transition-colors">
                        {tool.title}
                      </CardTitle>
                      {tool.badge && (
                        <Badge variant="secondary" className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold bg-accent/10 text-accent border-none shrink-0">
                          {tool.badge}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground/80">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-4 sm:pt-6 p-5 sm:p-6">
                    <div className="flex items-center text-xs sm:text-sm font-bold text-accent sm:translate-x-[-10px] sm:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      Buka Alat <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Guide Section */}
        <div className="space-y-10">
           <div className="flex items-center gap-3 border-b pb-6 border-border/20">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-card shadow-sm border border-border/20 text-accent">
                <Info className="w-6 h-6 sm:w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Panduan Penggunaan</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Tips memaksimalkan workstation visual Anda.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass-panel p-8 rounded-3xl space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" /> Ekspor Cepat & Aman
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Seluruh proses konversi dan pemotongan gambar dilakukan secara **lokal di browser Anda**. Tidak ada data yang dikirim ke server, sehingga privasi Anda terjamin 100% dan proses berjalan sangat instan.
                  </p>
               </div>
               <div className="glass-panel p-8 rounded-3xl space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-accent" /> Optimalisasi Media Sosial
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gunakan **Resizer Pro** untuk menyesuaikan satu aset ke berbagai platform sekaligus. Fitur *Center Crop* otomatis memastikan subjek utama gambar Anda tetap berada di tengah bingkai.
                  </p>
               </div>
            </div>
        </div>

        {/* Trust Features */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center md:text-left border-none shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-primary/20 rounded-2xl shadow-inner shrink-0"><LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-accent" /></div>
                <div className="space-y-1 sm:space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold">Terorganisir</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Antarmuka bersih yang fokus pada alur kerja visual Anda tanpa distraksi.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-primary/20 rounded-2xl shadow-inner shrink-0"><ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-accent" /></div>
                <div className="space-y-1 sm:space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold">Privasi Utama</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Pemrosesan lokal di browser memastikan aset Anda tetap berada di tangan Anda.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-primary/20 rounded-2xl shadow-inner shrink-0"><Globe className="w-6 h-6 sm:w-8 sm:h-8 text-accent" /></div>
                <div className="space-y-1 sm:space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold">Tanpa Batas</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Tanpa login, tanpa biaya berlangganan. Siap digunakan kapan pun dibutuhkan.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
