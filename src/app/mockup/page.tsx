'use client';

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';
import {
  SettingsProvider,
} from '@/features/mockup-generator/context/settings-context';
import { ControlPanel } from '@/features/mockup-generator/components/control-panel';
import { CanvasPreview } from '@/features/mockup-generator/components/canvas-preview';
import { Button } from '@/components/ui/button';
import { Download, Copy, Loader2, Settings } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';

function MockupGenerator() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;
    if (!imageUrl) {
      toast({
        variant: 'destructive',
        title: 'Tidak Ada Gambar',
        description: 'Silakan unggah gambar terlebih dahulu.',
      });
      return;
    }
    setIsLoading(true);
    // Fix for CSS rules error and font loading
    toPng(canvasRef.current, { 
        cacheBust: true, 
        skipFonts: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
    })
      .then((dataUrl) => {
        saveAs(dataUrl, 'mockup.png');
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Gagal Mengunduh',
          description: 'Terjadi kesalahan saat membuat gambar.',
        });
      })
      .finally(() => setIsLoading(false));
  }, [canvasRef, imageUrl, toast]);

  const handleCopyToClipboard = useCallback(() => {
    if (!canvasRef.current) return;
    if (!imageUrl) {
      toast({
        variant: 'destructive',
        title: 'Tidak Ada Gambar',
        description: 'Silakan unggah gambar terlebih dahulu.',
      });
      return;
    }
    setIsLoading(true);
    toPng(canvasRef.current, { cacheBust: true, skipFonts: true })
      .then((dataUrl) => {
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            if (!blob) throw new Error("Gagal membuat blob gambar.");
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast({
              title: 'Berhasil Disalin',
              description: 'Mockup telah disalin ke papan klip.',
            });
          })
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Gagal Menyalin',
          description: 'Terjadi kesalahan saat menyalin gambar.',
        });
      })
      .finally(() => setIsLoading(false));
  }, [canvasRef, imageUrl, toast]);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const DesktopLayout = () => (
    <>
      <div className="flex-grow flex items-center justify-center p-8 overflow-auto">
        <CanvasPreview ref={canvasRef} imageUrl={imageUrl} setImageUrl={setImageUrl} />
      </div>
      <div className="w-[350px] h-full bg-card border-l overflow-y-auto">
        <ControlPanel />
      </div>
    </>
  );

  const MobileLayout = () => (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow flex items-center justify-center p-4 overflow-auto">
        <CanvasPreview ref={canvasRef} imageUrl={imageUrl} setImageUrl={setImageUrl} />
      </div>
      <div className="p-2 border-t bg-background flex justify-around gap-2">
         <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            {/* Fix for accessibility warning */}
            <DrawerHeader className="sr-only">
              <DrawerTitle>Pengaturan Mockup</DrawerTitle>
              <DrawerDescription>Sesuaikan tampilan mockup Anda dari panel ini.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 h-[70vh] overflow-y-auto">
              <ControlPanel />
            </div>
          </DrawerContent>
        </Drawer>
        <Button onClick={handleCopyToClipboard} disabled={isLoading || !imageUrl} className="flex-1" variant="outline">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
          Salin
        </Button>
        <Button onClick={handleDownload} disabled={isLoading || !imageUrl} className="flex-1">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Unduh
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full">
      {isDesktop ? <DesktopLayout /> : <MobileLayout />}
    </div>
  );
}

export default function MockupPage() {
  return (
    <SettingsProvider>
      <MockupGenerator />
    </SettingsProvider>
  );
}
