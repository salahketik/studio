'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Music,
  ChevronRight,
  LayoutDashboard,
  Box,
  Folder,
  Wand2,
  Smartphone,
  Binary,
  Cpu,
  Settings,
  ShieldCheck,
  History,
  FileCode,
  Palette,
  Image as ImageIcon,
  Key,
  ShieldAlert,
  Terminal,
  Code2,
  BrainCircuit,
  Bot
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
    title: "Dasbor Utama",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "AI Command Center",
    icon: BrainCircuit,
    items: [
      { title: "AI Image Analyst", url: "/ai-analyst" },
      { title: "AI Background Gen", url: "/ai-background" },
      { title: "AI Voice-to-SRT", url: "/voice-to-srt" },
      { title: "AI Doc Helper", url: "/pdf-converter" },
    ],
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
      { title: "Base64 Encoder", url: "/base64-tool" },
      { title: "Base64 Decoder", url: "/base64-decode" },
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
      { title: "Image Flipper", url: "/image-flipper" },
      { title: "Avatar Circle", url: "/avatar-circle" },
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
      { title: "Halftone Art", url: "/halftone" },
      { title: "Duotone Filter", url: "/duotone" },
      { title: "Posterize Art", url: "/posterize" },
      { title: "Vignette Studio", url: "/vignette" },
    ],
  },
  {
    title: "Editor Teknis",
    icon: Wand2,
    items: [
      { title: "Sharpen Pro", url: "/sharpen" },
      { title: "Kontrol Luminansi", url: "/luminance" },
      { title: "Studio Bayangan", url: "/shadow-studio" },
      { title: "Warp Perspektif", url: "/perspective" },
      { title: "Edge Detection", url: "/edge-detection" },
      { title: "Color Balance", url: "/color-balance" },
      { title: "Loji Mixer", url: "/loji-mix" },
      { title: "Threshold B&W", url: "/threshold" },
    ],
  },
  {
    title: "Developer Hub",
    icon: Code2,
    items: [
      { title: "JSON Beautifier", url: "/json-beautifier" },
      { title: "Case Converter", url: "/case-converter" },
      { title: "URL Encode/Decode", url: "/url-tool" },
      { title: "PX to REM Calc", url: "/px-rem" },
      { title: "SVG Viewer", url: "/svg-view" },
    ],
  },
  {
    title: "Studio Audio",
    icon: Music,
    items: [
      { title: "Studio FX Audio", url: "/audio-cleaner" },
      { title: "Hapus Jeda Sunyi", url: "/dead-air-remover" },
      { title: "Subtitle Maker", url: "/voice-to-srt" },
    ],
  },
  {
    title: "Keamanan & Utilitas",
    icon: ShieldCheck,
    items: [
      { title: "Password Gen", url: "/password-gen" },
      { title: "Hash Master", url: "/hash-master" },
      { title: "QR Generator", url: "/qr-gen" },
      { title: "Barcode Maker", url: "/barcode-gen" },
      { title: "Favicon Gen", url: "/favicon-generator" },
      { title: "Lorem Ipsum", url: "/lorem-ipsum" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 px-4 group w-full">
          <div className="bg-primary p-1.5 rounded-lg transition-all group-hover:scale-110 shadow-lg shadow-primary/20 shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-black text-xs tracking-tighter uppercase leading-none text-sidebar-foreground">Visual Suite</span>
            <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-0.5">RAN DEV</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] uppercase tracking-[0.2em] font-black px-4 mb-2 opacity-40 text-sidebar-foreground">Modul Kerja</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible defaultOpen={item.items.some(sub => sub.url === pathname)} className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        className={cn(
                          "h-10 rounded-xl px-4 transition-all hover:bg-sidebar-accent",
                          item.items.some(sub => sub.url === pathname) && "bg-sidebar-accent text-primary"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-bold text-[10px] uppercase tracking-wider">{item.title}</span>
                        <ChevronRight className="ml-auto w-3 h-3 transition-transform group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-4 border-l border-sidebar-border mt-1 py-1 gap-1">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                                asChild 
                                isActive={pathname === subItem.url}
                                className={cn(
                                  "h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest px-4 transition-colors",
                                  pathname === subItem.url ? "text-primary bg-primary/5" : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
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
                      "h-10 rounded-xl px-4 transition-all hover:bg-sidebar-accent",
                      pathname === item.url && "bg-sidebar-accent text-primary"
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

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
             <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
             <span className="text-[9px] font-black uppercase tracking-tight text-sidebar-foreground">AI Node Active</span>
             <span className="text-[7px] text-green-500 font-bold uppercase tracking-widest">GEMINI 2.0 FLASH</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}