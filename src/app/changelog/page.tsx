
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, History, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ChangelogPage() {
  const logs = [
    {
      version: 'v2.9.0',
      date: 'Maret 2025',
      icon: History,
      title: 'User Space & Legal Update',
      changes: [
        'Sistem Favorit Lokal: Simpan alat yang sering digunakan di Sidebar.',
        'Riwayat Terbaru: Melacak 5 modul terakhir yang dibuka.',
        'Cookie & Privacy Banner: Transparansi pengolahan data lokal.',
        'Modularisasi Engine: Sentralisasi data alat untuk kestabilan tinggi.',
      ]
    },
    {
      version: 'v2.8.5',
      date: 'Februari 2025',
      icon: Sparkles,
      title: 'AI Command Center Integration',
      changes: [
        'Integrasi Google Gemini 2.0 Flash.',
        'AI Image Analyst & Background Generator aktif.',
        'Optimalisasi Dark Mode "Midnight Slate".',
        'Perbaikan error hidrasi pada Theme Toggle.',
      ]
    },
    {
      version: 'v2.0.0',
      date: 'Januari 2025',
      icon: Zap,
      title: 'Workstation Reborn',
      changes: [
        'Perubahan layout menjadi horizontal stat ribbon.',
        'Penambahan 80+ modul visual baru.',
        'Implementasi Local Processing (Canvas API).',
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 sm:p-10 max-w-4xl space-y-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tight">System Changelog</h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Ran Dev Node Updates</p>
        </div>
      </div>

      <div className="space-y-12 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-border">
        {logs.map((log, i) => (
          <div key={i} className="relative pl-16">
            <div className="absolute left-6 top-0 w-4 h-4 bg-background border-4 border-primary rounded-full z-10" />
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase">{log.version}</Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{log.date}</span>
               </div>
               <Card className="rounded-3xl border-none shadow-xl overflow-hidden glass-panel">
                  <CardHeader className="bg-muted/30 border-b py-4">
                     <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <log.icon className="w-4 h-4 text-primary" />
                        {log.title}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                     <ul className="space-y-3">
                        {log.changes.map((change, idx) => (
                          <li key={idx} className="flex gap-3 text-xs text-muted-foreground leading-relaxed">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                             {change}
                          </li>
                        ))}
                     </ul>
                  </CardContent>
               </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
