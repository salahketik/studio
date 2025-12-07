'use client';

import { useState, useCallback, useRef, DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ImageUploaderProps {
  onImageReady: (url: string | null) => void;
}

export function ImageUploader({ onImageReady }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [urlInput, setUrlInput] = useState('');

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Tipe File Tidak Valid',
        description: 'Silakan unggah file gambar.',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageReady(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    // Simple URL validation
    if (!urlInput.match(/\.(jpeg|jpg|gif|png|webp|svg)$/)) {
        toast({ variant: 'destructive', title: 'URL tidak valid', description: 'Pastikan URL mengarah langsung ke sebuah gambar.' });
        return;
    }
    onImageReady(urlInput);
  }

  const onDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    []
  );

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'p-6 border-2 border-dashed rounded-lg transition-colors w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center',
        isDragging ? 'border-primary bg-primary/10' : 'border-border'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
      <p className="font-semibold mb-2">Seret & lepas gambar, atau</p>
      <Button onClick={() => fileInputRef.current?.click()} className="mb-4">
        Pilih File
      </Button>
      <div className="w-full text-center">
        <p className="text-sm text-muted-foreground mb-2">Atau tempel URL gambar</p>
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <Input
                type="text"
                placeholder="https://example.com/image.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-grow"
            />
            <Button type="submit" variant="outline">Pratinjau</Button>
        </form>
      </div>
    </div>
  );
}
