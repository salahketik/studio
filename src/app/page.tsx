'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  LayoutGrid, 
  Database,
  RefreshCcw, 
  Search,
  Cpu, 
  ShieldCheck,
  Zap,
  Star,
  History,
  FileImage, Crop, Sparkles, 
  Maximize2, SlidersHorizontal, Pipette, Grid3X3, 
  ShieldAlert, Code2, ImageIcon, Palette, 
  Layers, Wind, Box, Split, Eye, 
  Type, Scaling, Ghost, Contrast, Aperture, Paintbrush2, Minimize2, 
  IterationCcw, Frame, Component, Focus, Sun, Filter,
  Music, TimerOff, Captions, Terminal, UserCircle,
  Hash, Binary, SearchCode,
  Wand2, Layers2, Flame, Coins,
  ImagePlus, Monitor,
  GlassWater, Camera, Globe,
  Layout, Info, CheckCircle2, RotateCcw,
  Smartphone, Barcode, Key, FileJson, Link as LinkIcon, Ruler,
  MousePointer2, BrainCircuit, Bot, FileText, Stamp, FileCode,
  ListChecks, FileType, FileSpreadsheet, Clock, Braces, Table, AlignLeft,
  Waveform, Microscope, ScanEye, Brush, Waves, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ALL_TOOLS } from '@/lib/tools-data';
import { useUserData } from '@/hooks/use-user-data';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite, trackRecent, mounted } = useUserData();

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.useCase.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-full pb-20 bg-background text-foreground">
      <div className="container mx-auto px-6 lg:px-10 py-10 space-y-12">
        
        {/* Header Ribbon */}
        <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Workstation Dashboard</h1>
            <div className="flex items-center justify-between flex-wrap gap-4">
               <p className="text-muted-foreground text-xs font-medium opacity-60">
                 Sistem Aktif. {ALL_TOOLS.length}+ modul operasional siap digunakan 100% lokal.
               </p>
               <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase text-primary tracking-widest">AI Engine: Online</span>
               </div>
            </div>
        </div>

        {/* Horizontal Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Modul Aktif', value: `${ALL_TOOLS.length}`, sub: 'Total Terintegrasi', icon: Cpu, color: 'text-primary' },
            { label: 'Latensi Node', value: '0ms', sub: 'Pemrosesan Lokal', icon: Zap, color: 'text-orange-500' },
            { label: 'Cache Buffer', value: '1.8 GB', sub: 'Optimasi RAM', icon: Database, color: 'text-cyan-500' },
            { label: 'Privasi', value: '100%', sub: 'Sisi Klien', icon: ShieldCheck, color: 'text-green-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/40 border-border/50 rounded-2xl p-5 shadow-sm group hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{stat.label}</p>
                      <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/50">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                  <ArrowRight className="w-2.5 h-2.5" /> {stat.sub}
                </div>
            </Card>
          ))}
        </div>

        {/* Global Search Hub */}
        <div className="relative group max-w-3xl mx-auto">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-30 group-focus-within:opacity-100 transition-opacity" />
           <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul visual, audio, atau AI (cth: list, markdown, jwt)..." 
            className="h-16 pl-14 pr-8 rounded-2xl bg-card/80 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 text-sm font-bold tracking-tight shadow-xl"
           />
        </div>

        {/* Tools Catalog */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
             <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Katalog Modul</h2>
             </div>
             <Badge variant="secondary" className="bg-primary/5 text-primary text-[8px] uppercase font-black px-4 py-0.5 border-none rounded-full">
                {filteredTools.length} Unit
             </Badge>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => {
                const isFav = mounted && favorites.includes(tool.title.toLowerCase().trim());
                const Icon = tool.icon;
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
                              <Icon className="w-5 h-5" />
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
                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(tool.title.toLowerCase().trim());
                      }}
                      className={cn(
                        "absolute top-4 right-4 z-10 p-2 rounded-full transition-all bg-white/5 backdrop-blur-md border border-white/10 hover:scale-110",
                        isFav ? "text-yellow-500 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <Star className={cn("w-3.5 h-3.5", isFav && "fill-current")} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 bg-muted/20 rounded-3xl border border-dashed border-border/50">
               <Search className="w-10 h-10 text-muted-foreground opacity-10 mx-auto" />
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Modul tidak ditemukan</p>
               <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="rounded-full px-6 text-[10px] font-bold uppercase tracking-widest">
                 Reset Pencarian
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
