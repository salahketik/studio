
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Zap, ShieldCheck, Cpu, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 sm:p-10 max-w-5xl space-y-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tight">Tentang Workstation</h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Ran Dev Digital Initiative</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
         <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-tighter leading-none">Kecepatan Lokal.<br/><span className="text-primary">Privasi Mutlak.</span></h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              **Visual Creative Suite** adalah workstation digital murni yang dirancang untuk kebutuhan produksi profesional. Berbeda dengan aplikasi SaaS biasa, kami tidak pernah mengirimkan file gambar atau audio Anda ke server manapun. 
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seluruh proses konversi, filter, dan optimasi terjadi di browser Anda menggunakan kekuatan CPU & GPU lokal. Ini memastikan latensi 0ms dan privasi data 100%.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase">GDPR Compliant</span>
               </div>
               <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-2xl border border-accent/20">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-black uppercase">Edge Engine</span>
               </div>
            </div>
         </div>
         <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-primary p-1">
            <div className="w-full h-full bg-background rounded-[2.8rem] p-10 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center">
                  <Cpu className="w-10 h-10 text-primary" />
               </div>
               <div className="space-y-2">
                  <p className="text-2xl font-black uppercase tracking-tighter">Ran Dev Engine</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Workstation v2.9.5</p>
               </div>
               <p className="text-[11px] text-muted-foreground italic">"Membangun alat yang memberdayakan kreator tanpa mengorbankan privasi mereka."</p>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10">
         {[
           { title: 'Infrastruktur', desc: 'Next.js 15 & Turbopack untuk performa loading secepat kilat.', icon: Zap },
           { title: 'Keamanan', desc: 'Zero data transfer. Semua pemrosesan citra murni di sisi klien.', icon: ShieldCheck },
           { title: 'Global', desc: 'Dibuat dengan dedikasi penuh untuk komunitas desainer Indonesia.', icon: Globe },
         ].map((feat, i) => (
           <Card key={i} className="rounded-3xl border-none shadow-lg bg-card/40 p-8 space-y-4 hover:border-primary/20 transition-all group">
              <div className="p-3 bg-muted rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
                 <feat.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="font-bold uppercase text-xs tracking-widest">{feat.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.desc}</p>
           </Card>
         ))}
      </div>

      <div className="pt-10 text-center opacity-30">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
           Dibuat dengan <Heart className="w-3 h-3 text-red-500 fill-current" /> oleh Ran Dev Team
         </p>
      </div>
    </div>
  );
}
