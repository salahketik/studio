'use client';

import Link from 'next/link';
import { 
  FileImage, 
  Monitor, 
  Volume2, 
  FileText, 
  Crop, 
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tools = [
  {
    title: 'Konverter Gambar',
    description: 'Konversi massal foto ke WebP, JPG, atau PNG dengan kompresi AI.',
    href: '/image-converter',
    icon: FileImage,
    color: 'bg-blue-500/10 text-blue-600',
    badge: 'Populer'
  },
  {
    title: 'Generator Mockup',
    description: 'Buat mockup screenshot browser profesional untuk presentasi Anda.',
    href: '/mockup',
    icon: Monitor,
    color: 'bg-purple-500/10 text-purple-600',
    badge: 'AI Update'
  },
  {
    title: 'Audio Cleaner',
    description: 'Hilangkan noise dan perhalus vokal menggunakan DSP profesional.',
    href: '/audio-cleaner',
    icon: Volume2,
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: 'Perangkat PDF',
    description: 'Ubah PDF menjadi Word yang dapat diedit menggunakan kecerdasan buatan.',
    href: '/pdf-converter',
    icon: FileText,
    color: 'bg-red-500/10 text-red-600',
  },
  {
    title: 'Potong Otomatis',
    description: 'Hapus ruang kosong dan transparan dari gambar secara cerdas.',
    href: '/trim',
    icon: Crop,
    color: 'bg-teal-500/10 text-teal-600',
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5 rounded-full animate-pulse">
            <Sparkles className="w-3 h-3 mr-2" />
            Teknologi AI Terbaru Telah Hadir
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Satu Tempat untuk <br /> <span className="text-primary">Kreativitas Anda.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Kumpulan alat kreatif cerdas untuk membantu Anda memproses gambar, audio, dan dokumen lebih cepat dari sebelumnya.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                    {tool.badge && <Badge variant="secondary" className="text-[10px]">{tool.badge}</Badge>}
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Gunakan Alat <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border/40">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg"><Zap className="w-5 h-5 text-primary" /></div>
                <div>
                    <h4 className="font-semibold">Cepat & Ringan</h4>
                    <p className="text-sm text-muted-foreground">Pemrosesan langsung di browser untuk kecepatan maksimal.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                <div>
                    <h4 className="font-semibold">Privasi Aman</h4>
                    <p className="text-sm text-muted-foreground">File Anda tidak pernah disimpan secara permanen di server kami.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg"><Globe className="w-5 h-5 text-primary" /></div>
                <div>
                    <h4 className="font-semibold">Tanpa Instalasi</h4>
                    <p className="text-sm text-muted-foreground">Akses semua alat dari mana saja lewat browser favorit Anda.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
