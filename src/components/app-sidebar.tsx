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
  MessageCircle,
  Heart,
  Folder,
  Palette,
  Globe,
  Scissors,
  Wand2,
  Terminal,
  Code2,
  Activity,
  Layers,
  Database
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
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "File Tools",
    url: "/image-converter",
    icon: Folder,
    items: [
      { title: "Batch Converter", url: "/image-converter" },
      { title: "PNG Optimizer", url: "/png-opt" },
      { title: "PDF Suite", url: "/pdf-converter" },
      { title: "DPI Adjuster", url: "/dpi-adjuster" },
      { title: "Metadata Cleaner", url: "/metadata-cleaner" },
      { title: "Base64 Tool", url: "/base64-tool" },
    ],
  },
  {
    title: "Creator",
    url: "/resizer",
    icon: Palette,
    items: [
      { title: "Resizer Pro", url: "/resizer" },
      { title: "Grid Splitter", url: "/grid-splitter" },
      { title: "Smart Trim", url: "/trim" },
      { title: "Image Stitcher", url: "/stitcher" },
      { title: "Mockup Studio", url: "/mockup" },
      { title: "Avatar Circle", url: "/avatar-circle" },
      { title: "Corner Rounder", url: "/corners" },
      { title: "Pattern Maker", url: "/pattern" },
      { title: "Canvas Text", url: "/canvas-text" },
    ],
  },
  {
    title: "Studio FX",
    url: "/filters",
    icon: Box,
    items: [
      { title: "Filter Room", url: "/filters" },
      { title: "Palette Lab", url: "/palette-extractor" },
      { title: "Glitch Maker", url: "/glitch" },
      { title: "ASCII Art", url: "/ascii-art" },
      { title: "Kaleidoscope", url: "/kaleido" },
      { title: "Duotone Art", url: "/duotone" },
      { title: "Grayscale Pro", url: "/grayscale-pro" },
      { title: "Film Grain", url: "/film-grain" },
      { title: "Posterize Art", url: "/posterize" },
      { title: "Pixelate Art", url: "/pixelate" },
      { title: "Vignette Studio", url: "/vignette" },
      { title: "Threshold B&W", url: "/threshold" },
      { title: "Loji Mixer", url: "/loji-mix" },
      { title: "Halftone Art", url: "/halftone" },
    ],
  },
  {
    title: "Technical Editor",
    url: "/luminance",
    icon: Wand2,
    items: [
      { title: "Luminance Control", url: "/luminance" },
      { title: "Opacity Pro", url: "/opacity" },
      { title: "Shadow Studio", url: "/shadow-studio" },
      { title: "Perspective Warp", url: "/perspective" },
      { title: "Mirror Studio", url: "/mirror" },
      { title: "Color Inverter", url: "/invert" },
      { title: "Blur Pro", url: "/blur" },
      { title: "Noise Studio", url: "/noise" },
      { title: "Image Border", url: "/image-border" },
      { title: "Overlay Studio", url: "/overlay" },
      { title: "CMYK Splitter", url: "/cmyk-split" },
    ],
  },
  {
    title: "Audio Studio",
    url: "/audio-cleaner",
    icon: Music,
    items: [
      { title: "FX Studio", url: "/audio-cleaner" },
      { title: "Dead Air Remover", url: "/dead-air-remover" },
      { title: "Subtitles", url: "/voice-to-srt" },
    ],
  },
  {
    title: "Dev & Website",
    url: "/svg-view",
    icon: Globe,
    items: [
      { title: "SVG Inspector", url: "/svg-view" },
      { title: "QR Generator", url: "/qr-gen" },
      { title: "Favicon Gen", url: "/favicon-generator" },
      { title: "Aspect Calc", url: "/aspect-calculator" },
      { title: "EXIF Viewer", url: "/exif-view" },
      { title: "Color Mixer", url: "/color-mixer" },
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
          <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.2em] font-black px-4 mb-4 mt-2 opacity-40">Main Menu</SidebarGroupLabel>
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
                       <Zap className="w-3 h-3" /> Vibe Coder
                    </span>
                 </div>
                 <Github className="w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                 "Precision tools for digital masters."
              </p>
              <div className="pt-1">
                 <p className="text-[9px] font-bold uppercase tracking-widest">— RonzX7 Developer</p>
              </div>
              <div className="flex gap-1.5">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-accent/20 hover:text-white transition-all">
                    <MessageCircle className="w-3.5 h-3.5" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-accent/20 hover:text-white transition-all">
                    <Heart className="w-3.5 h-3.5" />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-accent/20 hover:text-white transition-all">
                    <Github className="w-3.5 h-3.5" />
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
             <span className="text-[10px] font-black uppercase tracking-tight">System Node</span>
             <span className="text-[8px] text-green-500 font-bold uppercase tracking-widest">v2.8.5 STABLE</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
