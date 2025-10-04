'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { runAITrimming } from '@/app/actions';

import { ImageUploader } from '@/components/image-uploader';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { saveAs } from 'file-saver';


export default function TrimPage() {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
  const [trimmedImage, setTrimmedImage] = useState<{url: string, blob: Blob} | null>(null);
  const [isTrimming, setIsTrimming] = useState(false);

  const handleImageUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      if (files.length > 1) {
        toast({
            title: "One image at a time",
            description: "The Smart Trim feature only processes one image at a time. The first image was selected.",
        })
      }
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setTrimmedImage(null); // Reset trimmed image on new upload
    }
  }, [toast]);
  
  const fileToDataUri = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTrim = async () => {
    if (!originalImage) return;

    setIsTrimming(true);
    setTrimmedImage(null);

    try {
      const imageUri = await fileToDataUri(originalImage.file);
      const result = await runAITrimming({ imageUri });

      if (result.error) {
        throw new Error(result.error);
      }

      const res = await fetch(result.trimmedImageUri!);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setTrimmedImage({ url, blob });

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'AI Trimming Failed',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    } finally {
        setIsTrimming(false);
    }
  };

  const handleDownload = () => {
    if (!trimmedImage || !originalImage) return;
    const extension = originalImage.file.name.split('.').pop();
    const newName = originalImage.file.name.replace(/\.[^/.]+$/, `_trimmed.${extension}`);
    saveAs(trimmedImage.blob, newName);
  }

  const originalSize = useMemo(() => {
    if (!originalImage) return 0;
    return originalImage.file.size;
  }, [originalImage]);

  const trimmedSize = useMemo(() => {
    if (!trimmedImage) return 0;
    return trimmedImage.blob.size;
  }, [trimmedImage]);
  
  function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold font-headline">WebPGator</h1>
              <nav className="flex items-center gap-2">
                <Button variant="link" asChild className="p-0 text-muted-foreground">
                    <Link href="/">Bulk Converter</Link>
                </Button>
                <Button variant="link" asChild className="p-0 text-muted-foreground data-[active]:text-foreground">
                    <Link href="/trim">Smart Trim</Link>
                </Button>
              </nav>
            </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Smart Trim</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Upload an image and let our AI automatically remove the surrounding empty space or uniform background. Perfect for product photos and logos.
                </p>
            </div>
            
            {!originalImage && <ImageUploader onUpload={handleImageUpload} />}

            {originalImage && (
                <Card>
                    <CardContent className="p-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-lg">Original</h3>
                                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                                    <Image src={originalImage.url} alt="Original image" layout="fill" objectFit="contain" />
                                </div>
                                <p className="text-sm text-muted-foreground text-center">Size: {formatBytes(originalSize)}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-lg">Trimmed Result</h3>
                                <div className="relative aspect-video w-full rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                                    {isTrimming && <Loader2 className="w-8 h-8 animate-spin text-primary" />}
                                    {!isTrimming && trimmedImage && <Image src={trimmedImage.url} alt="Trimmed image" layout="fill" objectFit="contain" />}
                                    {!isTrimming && !trimmedImage && <ImageIcon className="w-8 h-8 text-muted-foreground" />}
                                </div>
                                <p className="text-sm text-muted-foreground text-center">
                                    {trimmedImage ? `Size: ${formatBytes(trimmedSize)}` : 'Click "Trim Image" to see the result'}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <Button onClick={handleTrim} disabled={isTrimming}>
                                {isTrimming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Trimming...</> : <><Sparkles className="mr-2 h-4 w-4" /> Trim Image</>}
                            </Button>
                            <Button onClick={handleDownload} disabled={!trimmedImage || isTrimming}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                         <div className="text-center mt-6">
                            <Button variant="link" onClick={() => setOriginalImage(null)}>
                                Or upload a different image
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
      <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WebPGator. All rights reserved.</p>
      </footer>
    </div>
  );
}
