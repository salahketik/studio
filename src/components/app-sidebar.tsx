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
  Folder,
  Palette,
  Wand2,
  Smartphone,
  Binary,
  Monitor,
  Camera,
  Layers2,
  ShieldCheck,
  Cpu,
  History
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const navMain = [
  {
    title: "Dasbor",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Berkas Core",
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
    title: "Kreator Sosial",
    icon: Smartphone,
    items: [
      { title: "Resizer Pro", url: "/resizer" },
      { title: "Grid Splitter", url: "/grid-splitter" },
      { title: "Potong Cerdas", url: "/trim" },
      { title: "Image Stitcher", url: "/stitcher" },
      { title: "Studio Mockup", url: "/mockup" },
      { title: "Watermark Pro", url: "/watermark" },
    ],
  },
  {
    title: "Studio FX",
    icon: Box,
    items: [
      { title: "Ruang Filter", url: "/filters" },
      { title: "Lab Palet Warna", url: "/palette-extractor" },
      { title: "Seni ASCII", url: "/ascii-art" },
      { title: "Kaleidoskop", url: "/kaleido" },
      { title: "Seni Pixelate", url: "/pixelate" },
      { title: "Heatmap Visual", url: "/heatmap" },
    ],
  },
  {
    title: "Editor Teknis",
    icon: Wand2,
    items: [
      { title: "Kontrol Luminansi", url: "/luminance" },
      { title: "Studio Bayangan", url: "/shadow-studio" },
      { title: "Warp Perspektif", url: "/perspective" },
      { title: "Sepia Pro", url: "/sepia" },
      { title: "Invert Warna", url: "/invert" },
      { title: "Ketajaman (Sharpen)", url: "/sharpen" },
    ],
  },
  {
    title: "Studio Audio",
    icon: Music,
    items: [
      { title: "Studio FX Audio", url: "/audio-cleaner" },
      { title: "Hapus Jeda Sunyi", url: "/dead-air-remover" },
      { title: "Subtitle Workstation", url: "/voice-to-srt" },
    ],
  },
  {
    title: "Dev & Utilitas",
    icon: Binary,
    items: [
      { title: "QR Generator", url: "/qr-gen" },
      { title: "Favicon Gen", url: "/favicon-generator" },
      { title: "SVG Inspector", url: "/svg-view" },
      { title: "Kalkulator Aspek", url: "/aspect-calculator" },
      { title: "Inspektur EXIF", url: "/exif-view" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-[#07080d]">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 px-4 group w-full">
          <div className="bg-primary p-1.5 rounded-lg transition-all group-hover:scale-110 shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-black text-xs tracking-tighter uppercase leading-none">Visual Suite</span>
            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-0.5">RAN DEV</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.2em] font-black px-4 mb-2 opacity-40">Modul Kerja</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible defaultOpen={item.items.some(sub => sub.url === pathname)}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        className={cn(
                          "h-10 rounded-xl px-4 transition-all hover:bg-white/5",
                          item.items.some(sub => sub.url === pathname) && "bg-primary/10 text-primary"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-bold text-[10px] uppercase tracking-wider">{item.title}</span>
                        <ChevronRight className="ml-auto w-3 h-3 transition-transform group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 border-l border-border/50 mt-1 py-1 gap-1">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                                asChild 
                                isActive={pathname === subItem.url}
                                className={cn(
                                  "h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest px-4 transition-colors",
                                  pathname === subItem.url ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-white"
                                )}
                            >
                              <Link href={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className={cn(
                      "h-10 rounded-xl px-4 transition-all hover:bg-white/5",
                      pathname === item.url && "bg-primary/10 text-primary"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span className="font-bold text-[10px] uppercase tracking-wider">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
             <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
             <span className="text-[9px] font-black uppercase tracking-tight">Node Lokal</span>
             <span className="text-[7px] text-green-500 font-bold uppercase tracking-widest">v4.5.0 STABIL</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}