
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Star,
  ChevronLeft,
  LayoutGrid,
  Search
} from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ALL_TOOLS } from '@/lib/tools-data';
import { useUserData } from '@/hooks/use-user-data';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, trackRecent, mounted } = useUserData();

  const favoriteTools = useMemo(() => {
    if (!mounted) return [];
    return ALL_TOOLS.filter(t => favorites.includes(t.title.toLowerCase().trim()));
  }, [favorites, mounted]);

  return (
    <div className="container mx-auto p-4 sm:p-10 max-w-7xl space-y-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tight">Koleksi Favorit</h1>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Ruang Kerja Personal Anda</p>
        </div>
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {favoriteTools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <div key={tool.title} className="relative group">
                <Link 
                  href={tool.href} 
                  onClick={() => trackRecent(tool.title.toLowerCase().trim())}
                  className="block h-full"
                >
                  <Card className="tool-card h-full flex flex-col rounded-2xl">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-border/50",
                          tool.category === 'ai' && 'bg-accent/10 text-accent',
                          tool.category === 'core' && 'bg-blue-500/10 text-blue-500',
                          tool.category === 'social' && 'bg-orange-500/10 text-orange-500',
                          tool.category === 'studio' && 'bg-pink-500/10 text-pink-500',
                          tool.category === 'advanced' && 'bg-purple-500/10 text-purple-500',
                          tool.category === 'dev' && 'bg-cyan-500/10 text-cyan-500',
                          tool.category === 'utility' && 'bg-slate-500/10 text-slate-500',
                          tool.category === 'audio' && 'bg-emerald-500/10 text-emerald-500',
                        )}>
                          <ToolIcon className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="text-[8px] uppercase font-black opacity-30 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-full">
                          {tool.useCase}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-black tracking-tight uppercase leading-tight">
                          {tool.title}
                        </CardTitle>
                        <CardDescription className="text-[10px] leading-relaxed line-clamp-2 opacity-60">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4 p-6 flex items-center justify-between border-t border-border/5 bg-muted/5">
                      <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest group-hover:text-primary transition-colors">Buka Modul</span>
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(tool.title.toLowerCase().trim());
                  }}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all bg-white/5 backdrop-blur-md border border-white/10 hover:scale-110 text-yellow-500"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/50 max-w-3xl mx-auto flex flex-col items-center">
           <div className="p-6 bg-muted rounded-full">
             <Star className="w-12 h-12 text-muted-foreground opacity-20" />
           </div>
           <div className="space-y-2">
             <p className="font-black uppercase tracking-widest text-xs">Belum ada alat favorit</p>
             <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">Klik ikon bintang pada alat di Dashboard untuk menambahkannya ke sini agar akses lebih cepat.</p>
           </div>
           <Button variant="outline" className="rounded-full px-8 text-[10px] font-black uppercase tracking-widest" asChild>
             <Link href="/">Ke Dashboard Utama</Link>
           </Button>
        </div>
      )}
    </div>
  );
}
