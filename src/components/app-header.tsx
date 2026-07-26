'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Layers, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/image-converter', label: 'Konverter' },
  { href: '/mockup', label: 'Mockup' },
  { href: '/resizer', label: 'Resizer' },
  { href: '/filters', label: 'Filter' },
  { href: '/palette-extractor', label: 'Palet' },
  { href: '/watermark', label: 'Watermark' },
  { href: '/grid-splitter', label: 'Grid' },
  { href: '/metadata-cleaner', label: 'Privacy' },
  { href: '/base64-tool', label: 'Base64' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={cn('flex items-center gap-0.5', isMobile && 'flex-col items-start gap-1')}>
      {navItems.slice(0, isMobile ? 10 : 4).map(({ href, label }) => (
        <Button
          key={href}
          variant="ghost"
          asChild
          className={cn(
            'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 h-8',
            pathname === href 
              ? 'bg-accent/10 text-accent shadow-sm' 
              : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground',
            isMobile && 'w-full justify-between text-xs py-5 h-auto rounded-2xl px-6'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={href}>
            {label}
            {isMobile && <ChevronRight className="w-4 h-4 opacity-30" />}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/5 bg-background/80 backdrop-blur-xl transition-all h-16 flex items-center">
      <div className="container mx-auto flex items-center px-6">
        <div className="flex-1 flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-accent p-2 rounded-xl transition-all group-hover:scale-110 shadow-lg shadow-accent/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tighter uppercase leading-none">Visual Suite</span>
              <span className="text-[8px] font-bold text-accent/50 uppercase tracking-[0.2em]">Workstation</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
             <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/5 h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0 flex flex-col border-l border-border/5 bg-background/95 backdrop-blur-2xl">
                <SheetHeader className="p-8 border-b border-border/5 text-left">
                  <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                  <SheetDescription className="sr-only">Menu utama aplikasi Visual Creative Suite</SheetDescription>
                  <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="bg-accent p-2 rounded-xl">
                          <Layers className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm tracking-tighter uppercase leading-none">Visual Suite</span>
                        <span className="text-[8px] font-bold text-accent/50 uppercase tracking-[0.2em]">Creative Hub</span>
                      </div>
                  </Link>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-4 py-6">
                    <div className="flex flex-col gap-2">
                        <NavLinks isMobile />
                    </div>
                </ScrollArea>
                
                <div className="p-8 border-t border-border/5 bg-muted/10">
                    <p className="text-[9px] text-muted-foreground text-center font-black uppercase tracking-[0.3em] opacity-40">
                        Workstation v2.9.0-Stable
                    </p>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}