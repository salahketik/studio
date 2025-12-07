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
import { Download, Copy, Loader2, Camera } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Drawer,
  DrawerContent,
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
    toPng(canvasRef.current, { cacheBust: true })
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
    toPng(canvasRef.current, { cacheBust: true })
      .then((dataUrl) => {
        // Convert data URL to blob
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
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
      <div className="p-2 border-t bg-background flex justify-around">
        <Button onClick={handleCopyToClipboard} disabled={isLoading || !imageUrl} className="flex-1 mx-1">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
          Salin
        </Button>
        <Button onClick={handleDownload} disabled={isLoading || !imageUrl} className="flex-1 mx-1">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Unduh
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex-1 mx-1">
              <Camera className="mr-2 h-4 w-4" />
              Pengaturan
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4 h-[70vh] overflow-y-auto">
              <ControlPanel />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem-1px)] w-full">
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
