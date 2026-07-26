'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Layers } from 'lucide-react';
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
      {navItems.map(({ href, label }) => (
        <Button
          key={href}
          variant="ghost"
          asChild
          className={cn(
            'px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-tight transition-all duration-300',
            pathname === href 
              ? 'bg-accent/10 text-accent shadow-sm' 
              : 'text-muted-foreground hover:bg-accent/5 hover:text-foreground',
            isMobile && 'w-full justify-start text-xs py-4 h-auto rounded-xl'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/5 bg-background/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-6 hidden lg:flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="bg-accent p-1.5 rounded-lg transition-transform group-hover:scale-110 shadow-lg shadow-accent/20">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-sm tracking-tighter uppercase">Visual Suite</span>
          </Link>
          <NavLinks />
        </div>
        
        <div className="lg:hidden flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <div className="bg-accent p-1.5 rounded-lg shadow-lg shadow-accent/20">
                    <Layers className="h-4 w-4 text-white" />
                </div>
                <span className="font-black text-xs tracking-tighter uppercase">Visual Suite</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/5 h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0 flex flex-col border-r border-border/5">
                <SheetHeader className="p-6 border-b border-border/5">
                  <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                  <SheetDescription className="sr-only">Menu utama aplikasi Visual Creative Suite</SheetDescription>
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-accent p-1.5 rounded-lg">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-black text-sm tracking-tighter uppercase">Visual Suite</span>
                    </Link>
                  </div>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-4 py-4">
                    <div className="flex flex-col gap-1">
                        <NavLinks isMobile />
                    </div>
                </ScrollArea>
                
                <div className="p-6 border-t border-border/5 bg-muted/10">
                    <p className="text-[9px] text-muted-foreground text-center font-black uppercase tracking-widest">
                        Workstation v2.5.0
                    </p>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
