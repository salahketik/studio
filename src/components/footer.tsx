'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Globe } from 'lucide-react';

export function AppFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-12 border-t border-border/5 bg-card/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-1.5 rounded-lg"><Zap className="w-4 h-4 text-accent" /></div>
                <span className="font-black text-sm uppercase tracking-tighter">Visual Creative Suite</span>
             </div>
             <p className="text-[11px] text-muted-foreground max-w-sm leading-relaxed uppercase font-medium opacity-60">
               Workstation digital murni yang mengutamakan kecepatan, keamanan, dan privasi. Semua pemrosesan data dilakukan 100% di perangkat Anda tanpa bantuan server eksternal.
             </p>
          </div>
          
          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Keamanan Lokal</h4>
             <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                   <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Tanpa Unggah Data
                </li>
                <li className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                   <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Enkripsi Sisi Klien
                </li>
                <li className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                   <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Proses CPU Lokal
                </li>
             </ul>
          </div>

          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Versi Workstation</h4>
             <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10">
                <p className="text-[10px] font-black text-accent uppercase tracking-widest">v2.8.5 Stabil</p>
                <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold">Build: RanDev.2025</p>
             </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {year || '2025'} Ran Dev Studio. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest"><Globe className="w-3 h-3" /> Indonesia</div>
             <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">Kebijakan Privasi</div>
             <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest">Ketentuan Layanan</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
