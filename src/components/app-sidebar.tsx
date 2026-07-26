'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileImage,
  Monitor,
  Palette,
  Grid3X3,
  Layers2,
  Code2,
  Music,
  Zap,
  ChevronRight,
  Search,
  Settings,
  ShieldCheck,
  LayoutGrid,
  Layers
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
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: Zap,
    isActive: true,
  },
  {
    title: "Core & Export",
    url: "/image-converter",
    icon: Layers,
    items: [
      { title: "Batch Converter", url: "/image-converter" },
      { title: "PNG Optimizer", url: "/png-opt" },
      { title: "PDF Converter", url: "/pdf-converter" },
      { title: "DPI Adjuster", url: "/dpi-adjuster" },
      { title: "Favicon Maker", url: "/favicon-generator" },
    ],
  },
  {
    title: "Social & Layout",
    url: "/resizer",
    icon: Grid3X3,
    items: [
      { title: "Resizer Pro", url: "/resizer" },
      { title: "Grid Splitter", url: "/grid-splitter" },
      { title: "Smart Trim", url: "/trim" },
      { title: "Image Stitcher", url: "/stitcher" },
      { title: "Circular Avatar", url: "/avatar-circle" },
    ],
  },
  {
    title: "Studio & Filters",
    url: "/filters",
    icon: Palette,
    items: [
      { title: "Filter Room", url: "/filters" },
      { title: "Palette Extractor", url: "/palette-extractor" },
      { title: "Grayscale Pro", url: "/grayscale-pro" },
      { title: "Glitch Maker", url: "/glitch" },
      { title: "ASCII Art", url: "/ascii-art" },
    ],
  },
  {
    title: "Advanced Visuals",
    url: "/mockup",
    icon: Layers2,
    items: [
      { title: "Mockup Studio", url: "/mockup" },
      { title: "Shadow Studio", url: "/shadow-studio" },
      { title: "Watermark Pro", url: "/watermark" },
      { title: "Perspective Warp", url: "/perspective" },
      { title: "Kaleidoscope", url: "/kaleido" },
    ],
  },
  {
    title: "Audio & Voice",
    url: "/audio-cleaner",
    icon: Music,
    items: [
      { title: "Audio FX Studio", url: "/audio-cleaner" },
      { title: "Dead Air Remover", url: "/dead-air-remover" },
      { title: "Subtitle Workstation", url: "/voice-to-srt" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/10 bg-card/30 backdrop-blur-xl">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/5">
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="bg-accent p-2 rounded-xl transition-all group-hover:scale-110 shadow-lg shadow-accent/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-black text-sm tracking-tighter uppercase leading-none">Visual Suite</span>
            <span className="text-[8px] font-bold text-accent/60 uppercase tracking-[0.3em]">Workstation 4.0</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.2em] font-black px-4 mb-2 opacity-40">Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url || (item.items?.some(i => pathname === i.url))}
                    className="h-11 rounded-xl mx-2 px-3 transition-all hover:bg-accent/5 active:scale-95"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className={cn("w-4 h-4", (pathname === item.url || item.items?.some(i => pathname === i.url)) ? "text-accent" : "text-muted-foreground")} />
                    <span className="font-bold text-[11px] uppercase tracking-wider">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items && (
                  <SidebarMenuSub className="ml-8 border-l border-accent/10 mt-1">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                            asChild 
                            isActive={pathname === subItem.url}
                            className="h-8 rounded-lg text-[10px] font-medium uppercase tracking-widest px-3"
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

        <SidebarGroup className="mt-auto">
          <div className="mx-4 p-4 bg-accent/5 rounded-2xl border border-accent/10 space-y-2 group-data-[collapsible=icon]:hidden">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Privacy Mode</span>
             </div>
             <p className="text-[10px] text-muted-foreground leading-relaxed">Semuruh pemrosesan dilakukan lokal.</p>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/5">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
             <Settings className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
             <span className="text-[10px] font-bold uppercase">System Status</span>
             <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">v4.8 Stable</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
