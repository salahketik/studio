
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, X, Scale } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vcs_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('vcs_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 inset-x-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-grow space-y-2 text-center md:text-left">
          <h3 className="text-sm font-black uppercase tracking-tight">Privasi & Transparansi Data</h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Visual Creative Suite beroperasi 100% pada **Sisi Klien**. Kami menggunakan penyimpanan lokal browser untuk menyimpan preferensi dan alat favorit Anda. Tidak ada data gambar atau audio yang meninggalkan perangkat Anda. Dengan melanjutkan, Anda menyetujui <Link href="/tos" className="text-primary hover:underline font-bold">Syarat Layanan</Link> kami.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none rounded-xl text-[10px] font-bold uppercase tracking-widest" asChild>
            <Link href="/privacy">Kebijakan</Link>
          </Button>
          <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90 rounded-xl text-[10px] font-bold uppercase tracking-widest px-8 shadow-lg shadow-primary/20" onClick={accept}>
            Saya Mengerti
          </Button>
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
