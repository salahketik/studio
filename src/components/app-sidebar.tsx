'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Music,
  ChevronRight,
  Settings,
  LayoutDashboard,
  Box,
  Github,
  Heart,
  Folder,
  Palette,
  Globe,
  Wand2,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navMain = [
  {
    title: "Dasbor",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Alat Berkas",
    url: "/image-converter",
    icon: Folder,
    items: [
      { title: "Konverter Massal", url: "/image-converter" },
      { title: "Optimasi PNG", url: "/png-opt" },
      { title: "Suite PDF", url: "/pdf-converter" },
      { title: "Atur DPI", url: "/dpi-adjuster" },
      { title: "Hapus Metadata", url: "/metadata-cleaner" },
      { title: "Alat Base64", url: "/base64-tool" },
    ],
  },
  {
    title: "Kreator",
    url: "/resizer",
    icon: Palette,
    items: [
      { title: "Resizer Pro", url: "/resizer" },
      { title: "Grid Splitter", url: "/grid-splitter" },
      { title: "Potong Cerdas", url: "/trim" },
      { title: "Image Stitcher", url: "/stitcher" },
      { title: "Studio Mockup", url: "/mockup" },
      { title: "Avatar Bulat", url: "/avatar-circle" },
      { title: "Corner Rounder", url: "/corners" },
      { title: "Pembuat Pola", url: "/pattern" },
      { title: "Canvas Text", url: "/canvas-text" },
    ],
  },
  {
    title: "Studio FX",
    url: "/filters",
    icon: Box,
    items: [
      { title: "Ruang Filter", url: "/filters" },
      { title: "Lab Palet Warna", url: "/palette-extractor" },
      { title: "Pembuat Glitch", url: "/glitch" },
      { title: "Seni ASCII", url: "/ascii-art" },
      { title: "Kaleidoskop", url: "/kaleido" },
      { title: "Seni Duotone", url: "/duotone" },
      { title: "Grayscale Pro", url: "/grayscale-pro" },
      { title: "Film Grain", url: "/film-grain" },
      { title: "Seni Posterize", url: "/posterize" },
      { title: "Seni Pixelate", url: "/pixelate" },
      { title: "Studio Vignette", url: "/vignette" },
      { title: "Threshold B&W", url: "/threshold" },
      { title: "Loji Mixer", url: "/loji-mix" },
      { title: "Seni Halftone", url: "/halftone" },
    ],
  },
  {
    title: "Editor Teknis",
    url: "/luminance",
    icon: Wand2,
    items: [
      { title: "Kontrol Luminansi", url: "/luminance" },
      { title: "Opacity Pro", url: "/opacity" },
      { title: "Studio Bayangan", url: "/shadow-studio" },
      { title: "Warp Perspektif", url: "/perspective" },
      { title: "Studio Cermin", url: "/mirror" },
      { title: "Invert Warna", url: "/invert" },
      { title: "Blur Pro", url: "/blur" },
      { title: "Studio Noise", url: "/noise" },
      { title: "Bingkai Gambar", url: "/image-border" },
      { title: "Studio Overlay", url: "/overlay" },
      { title: "CMYK Splitter", url: "/cmyk-split" },
    ],
  },
  {
    title: "Studio Audio",
    url: "/audio-cleaner",
    icon: Music,
    items: [
      { title: "Studio FX Audio", url: "/audio-cleaner" },
      { title: "Hapus Jeda Sunyi", url: "/dead-air-remover" },
      { title: "Subtitle Workstation", url: "/voice-to-srt" },
    ],
  },
  {
    title: "Dev & Website",
    url: "/svg-view",
    icon: Globe,
    items: [
      { title: "Inspektur SVG", url: "/svg-view" },
      { title: "QR Generator", url: "/qr-gen" },
      { title: "Favicon Gen", url: "/favicon-generator" },
      { title: "Kalkulator Aspek", url: "/aspect-calculator" },
      { title: "Penampil EXIF", url: "/exif-view" },
      { title: "Mixer Warna", url: "/color-mixer" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0d0e16]">
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 px-4 group w-full">
          <div className="bg-accent p-2 rounded-xl transition-all group-hover:scale-110 shadow-lg shadow-accent/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-black text-sm tracking-tighter uppercase leading-none">Visual Suite</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">60-IN-1 WORKSTATION</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.2em] font-black px-4 mb-4 mt-2 opacity-40">Menu Utama</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url || (item.items?.some(i => pathname === i.url))}
                    className={cn(
                      "h-11 rounded-xl px-4 transition-all hover:bg-white/5",
                      (pathname === item.url || item.items?.some(i => pathname === i.url)) && "bg-accent/10 text-accent"
                    )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="font-bold text-[11px] uppercase tracking-wider">{item.title}</span>
                    {item.items && <ChevronRight className={cn("ml-auto w-3.5 h-3.5 transition-transform", (pathname === item.url || item.items?.some(i => pathname === i.url)) && "rotate-90")} />}
                  </Link>
                </SidebarMenuButton>
                {item.items && (pathname === item.url || item.items?.some(i => pathname === i.url)) && (
                  <SidebarMenuSub className="ml-6 border-l border-white/5 mt-1 py-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                            asChild 
                            isActive={pathname === subItem.url}
                            className={cn(
                              "h-8 rounded-lg text-[10px] font-medium uppercase tracking-widest px-4 transition-colors",
                              pathname === subItem.url ? "text-accent bg-accent/5" : "text-muted-foreground hover:text-white"
                            )}
                        >
                          <Link href={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <div className="mt-auto p-4 group-data-[collapsible=icon]:hidden">
           <div className="bg-[#11121d] rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                       <Zap className="w-3 h-3" /> Ran Dev
                    </span>
                 </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                 "Alat presisi untuk para master digital lokal."
              </p>
              <div className="flex gap-1.5 pt-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-accent/20 hover:text-white transition-all">
                    <Github className="w-3.5 h-3.5" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-accent/20 hover:text-white transition-all">
                    <Heart className="w-3.5 h-3.5" />
                 </Button>
              </div>
           </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
             <Settings className="w-4 h-4 text-accent" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
             <span className="text-[10px] font-black uppercase tracking-tight">Node Sistem</span>
             <span className="text-[8px] text-green-500 font-bold uppercase tracking-widest">v2.8.5 STABIL</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
