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
  { href: '/trim', label: 'Potong Cerdas' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={cn('flex items-center gap-1', isMobile && 'flex-col items-start gap-2')}>
      {navItems.map(({ href, label }) => (
        <Button
          key={href}
          variant="ghost"
          asChild
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
            pathname === href 
              ? 'bg-primary/20 text-foreground shadow-sm' 
              : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground',
            isMobile && 'w-full justify-start text-base py-6 h-auto rounded-2xl'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 items-center px-6">
        <div className="mr-8 hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-accent p-2 rounded-lg transition-transform group-hover:scale-110 shadow-lg shadow-accent/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Visual Suite</span>
          </Link>
          <NavLinks />
        </div>
        
        <div className="md:hidden flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
                <div className="bg-accent p-2 rounded-lg shadow-lg shadow-accent/20">
                    <Layers className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Visual Suite</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0 flex flex-col border-r border-border/20">
                <SheetHeader className="p-6 border-b border-border/10">
                  <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                  <SheetDescription className="sr-only">Menu utama aplikasi Visual Creative Suite</SheetDescription>
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-accent p-2 rounded-lg">
                            <Layers className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Visual Suite</span>
                    </Link>
                  </div>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-4 py-6">
                    <div className="flex flex-col gap-2">
                        <NavLinks isMobile />
                    </div>
                </ScrollArea>
                
                <div className="p-6 border-t border-border/10 bg-muted/30">
                    <p className="text-[10px] text-muted-foreground text-center font-medium uppercase tracking-widest">
                        Digital Workstation v1.5
                    </p>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
