'use client';

import { forwardRef } from 'react';
import { useSettings } from '@/features/mockup-generator/context/settings-context';
import { cn } from '@/lib/utils';
import { BrowserFrame } from './browser-frame';
import { ImageUploader } from './image-uploader';

interface CanvasPreviewProps {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

export const CanvasPreview = forwardRef<HTMLDivElement, CanvasPreviewProps>(
  ({ imageUrl, setImageUrl }, ref) => {
    const { settings } = useSettings();

    const paddingClasses: { [key: string]: string } = {
      '32': 'p-8',
      '64': 'p-16',
      '80': 'p-20',
      '100': 'p-24',
    };

    const positionClasses: { [key: string]: string } = {
        'left': 'items-start',
        'center': 'items-center',
        'right': 'items-end'
    };

    const radiusClasses: { [key: string]: string } = {
        'none': 'rounded-none',
        'sm': 'rounded-sm',
        'md': 'rounded-md',
        'lg': 'rounded-lg',
        'xl': 'rounded-xl',
        '2xl': 'rounded-2xl',
    };
    
    const backgroundStyle = () => {
        if (settings.background.type === 'image' && settings.background.value) {
            return { backgroundImage: `url(${settings.background.value})` };
        }
        // Default to gradient
        const gradient = settings.background.value as { from: string; to: string; };
        return { background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})` };
    }

    return (
      <div
        ref={ref}
        className={cn(
          "canvas-container flex justify-center transition-all duration-300",
          "bg-cover bg-center", // Add bg properties for image background
          paddingClasses[settings.padding],
          positionClasses[settings.position],
          radiusClasses[settings.radius]
        )}
        style={backgroundStyle()}
      >
        {settings.noise && <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>}
        <div className={cn("transition-all duration-300", `shadow-${settings.shadow}`)}>
            <BrowserFrame darkMode={settings.darkMode} radius={settings.radius}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Screenshot preview"
                        className={cn("w-full h-auto object-cover", radiusClasses[settings.screenshotRadius])}
                    />
                ) : (
                    <ImageUploader onImageReady={setImageUrl} />
                )}
            </BrowserFrame>
        </div>
      </div>
    );
  }
);

CanvasPreview.displayName = 'CanvasPreview';
