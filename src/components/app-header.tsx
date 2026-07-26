'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Layers, ChevronRight, Zap, Palette, Code2, Grid3X3, Layers2 } from 'lucide-react';
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
  { href: '/', label: 'Dashboard', icon: Zap },
  { href: '/image-converter', label: 'Batch Convert', icon: Layers },
  { href: '/mockup', label: 'Mockup Studio', icon: Layers2 },
  { href: '/filters', label: 'Filter Room', icon: Palette },
  { href: '/resizer', label: 'Social Resizer', icon: Grid3X3 },
  { href: '/base64-tool', label: 'Dev Utility', icon: Code2 },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={cn('flex items-center gap-1', isMobile && 'flex-col items-start gap-1.5 w-full')}>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          variant="ghost"
          asChild
          className={cn(
            'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 h-9',
            pathname === href 
              ? 'bg-accent text-white shadow-lg shadow-accent/20' 
              : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground',
            isMobile && 'w-full justify-start text-xs py-6 h-auto rounded-2xl px-6 bg-muted/20'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={href} className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5" />
            {label}
            {isMobile && <ChevronRight className="ml-auto w-4 h-4 opacity-30" />}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className={cn(
      "sticky top-0 z-[100] w-full transition-all duration-500 h-16 flex items-center border-b",
      scrolled ? "bg-background/80 backdrop-blur-2xl border-border/10 shadow-sm" : "bg-transparent border-transparent"
    )}>
      <div className="container mx-auto flex items-center px-6">
        <div className="flex-1 flex items-center gap-12">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-accent p-2 rounded-xl transition-all group-hover:scale-110 shadow-lg shadow-accent/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tighter uppercase leading-none">Visual Suite</span>
              <span className="text-[8px] font-bold text-accent/60 uppercase tracking-[0.3em]">Advanced 4.0</span>
            </div>
          </Link>
          <div className="hidden xl:flex items-center gap-1">
             <NavLinks />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/5 h-11 w-11">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] p-0 flex flex-col border-l border-border/5 bg-background/95 backdrop-blur-3xl">
                <SheetHeader className="p-8 border-b border-border/5 text-left bg-accent/5">
                  <SheetTitle className="sr-only">Navigasi Suite</SheetTitle>
                  <SheetDescription className="sr-only">Akses cepat ke 40 alat visual profesional</SheetDescription>
                  <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="bg-accent p-2 rounded-xl">
                          <Layers className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-sm tracking-tighter uppercase leading-none">Visual Suite</span>
                        <span className="text-[8px] font-bold text-accent/50 uppercase tracking-[0.2em]">Workstation Hub</span>
                      </div>
                  </Link>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-4 py-8">
                    <div className="space-y-8">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-6">Main Workstations</p>
                           <NavLinks isMobile />
                        </div>
                        <div className="px-6 py-6 bg-accent/5 rounded-3xl mx-2 space-y-3">
                           <p className="text-[10px] font-black text-accent uppercase tracking-widest">Privacy Engine</p>
                           <p className="text-[11px] text-muted-foreground leading-relaxed">Seluruh pemrosesan dilakukan 100% di browser Anda tanpa unggahan server.</p>
                        </div>
                    </div>
                </ScrollArea>
                
                <div className="p-8 border-t border-border/5 bg-muted/10">
                    <p className="text-[9px] text-muted-foreground text-center font-black uppercase tracking-[0.4em] opacity-30">
                        Workstation v4.0.0-Stable
                    </p>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}