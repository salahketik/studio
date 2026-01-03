'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Konverter Massal' },
  { href: '/mockup', label: 'Mockup' },
  { href: '/pdf-converter', label: 'Alat PDF' },
  { href: '/trim', label: 'Potong Cerdas' },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav
      className={cn(
        'flex items-center gap-2',
        isMobile && 'flex-col items-start gap-4'
      )}
    >
      {navItems.map(({ href, label }) => (
        <Button
          key={href}
          variant="link"
          asChild
          className={cn(
            'p-0 text-muted-foreground hover:text-foreground hover:no-underline',
            pathname === href && 'text-foreground font-semibold',
            isMobile && 'text-lg w-full justify-start'
          )}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-6 md:px-8">
        <div className="mr-4 hidden md:flex items-center gap-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">WebPGator</span>
          </Link>
          <NavLinks />
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl">WebPGator</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigasi utama untuk aplikasi WebPGator.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-8 pt-8">
                    <Link href="/" className="flex items-center space-x-2 px-4" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="font-bold text-xl">WebPGator</span>
                    </Link>
                    <div className="px-4">
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
