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

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/image-converter', label: 'Gambar' },
  { href: '/mockup', label: 'Mockup' },
  { href: '/audio-cleaner', label: 'Studio Audio' },
  { href: '/dead-air-remover', label: 'Dead Air' },
  { href: '/pdf-converter', label: 'PDF' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={cn('flex items-center gap-1', isMobile && 'flex-col items-start gap-4')}>
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
            isMobile && 'w-full justify-start text-lg'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 items-center px-6">
        <div className="mr-8 hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-accent p-2 rounded-lg transition-transform group-hover:scale-110 shadow-lg shadow-accent/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Alat Kreatif</span>
          </Link>
          <NavLinks />
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
                <div className="bg-accent p-2 rounded-lg shadow-lg shadow-accent/20">
                    <Layers className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">Alat Kreatif</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                  <SheetDescription className="sr-only">Menu utama aplikasi Alat Kreatif</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-10 pt-10">
                    <Link href="/" className="flex items-center space-x-3 px-4" onClick={() => setIsMobileMenuOpen(false)}>
                        <Layers className="h-8 w-8 text-accent" />
                        <span className="font-bold text-2xl tracking-tight">Alat Kreatif</span>
                    </Link>
                    <div className="px-2">
                      <NavLinks isMobile />
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
