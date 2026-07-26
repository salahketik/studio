'use client';

import { Search, Bell, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      scrolled ? "bg-[#090a0f]/90 backdrop-blur-xl border-white/5 shadow-sm" : "bg-transparent border-transparent"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="h-10 w-10 rounded-full hover:bg-white/5 transition-colors" />
          <div className="relative w-full max-w-xl hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-30" />
            <Input 
              placeholder="Search tools..." 
              className="pl-11 h-10 rounded-2xl bg-white/5 border-none focus-visible:ring-1 focus-visible:ring-accent/30 text-[11px] font-bold tracking-tight"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20">
               <kbd className="text-[9px] font-mono border rounded px-1">⌘</kbd>
               <kbd className="text-[9px] font-mono border rounded px-1">K</kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden lg:flex px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-white/5 text-muted-foreground bg-white/5">
            <Globe className="w-3 h-3 mr-2" /> EN
          </Badge>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/5">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </Button>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-blue-600 p-0.5 ml-2 cursor-pointer hover:scale-105 transition-transform">
             <div className="w-full h-full bg-[#0d0e16] rounded-[10px] flex items-center justify-center">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                  <AvatarFallback className="text-[10px]">VS</AvatarFallback>
                </Avatar>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}