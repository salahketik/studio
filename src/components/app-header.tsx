'use client';

import { Search, Bell, SidebarTrigger } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function AppHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full h-16 flex items-center transition-all duration-300 border-b",
      scrolled ? "bg-background/60 backdrop-blur-2xl border-border/10 shadow-sm" : "bg-transparent border-transparent"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="h-10 w-10 rounded-full hover:bg-accent/10 transition-colors" />
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
            <Input 
              placeholder="Search module... (Cmd + K)" 
              className="pl-11 h-10 rounded-full bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-accent/30 text-[11px] font-medium tracking-tight"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden lg:flex px-3 py-1 text-[9px] font-black uppercase tracking-widest border-green-500/20 text-green-600 bg-green-500/5">
            Cloud Sync Disabled
          </Badge>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
