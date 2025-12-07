'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BrowserFrameProps {
  children: ReactNode;
  darkMode: boolean;
  radius: string;
}

export function BrowserFrame({ children, darkMode, radius }: BrowserFrameProps) {
    
    const radiusClasses: { [key: string]: string } = {
        'none': 'rounded-none',
        'sm': 'rounded-t-sm',
        'md': 'rounded-t-md',
        'lg': 'rounded-t-lg',
        'xl': 'rounded-t-xl',
        '2xl': 'rounded-t-2xl',
    };

  return (
    <div className={cn("overflow-hidden", radius, `rounded-${radius}`)}>
      <div
        className={cn(
          "h-8 flex items-center gap-1.5 px-3",
          radiusClasses[radius],
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        )}
      >
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className={cn(darkMode ? 'bg-gray-700' : 'bg-white')}>
        {children}
      </div>
    </div>
  );
}
