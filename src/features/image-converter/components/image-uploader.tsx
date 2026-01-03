'use client';

import { useState, useCallback, useRef, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
        toast({
            variant: "destructive",
            title: "Tipe File Tidak Valid",
            description: "Hanya file gambar yang diterima. File yang bukan gambar diabaikan.",
        });
    }

    if (imageFiles.length > 0) {
        onUpload(imageFiles);
    }
  };

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
    setIsDragging(true); // Keep highlighting when dragging over
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unggah Gambar Anda</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={cn(
            'w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300 flex flex-col items-center justify-center text-center',
            isDragging ? 'border-primary bg-primary/10' : 'border-border bg-background'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">Seret & lepas gambar di sini</p>
          <p className="text-muted-foreground mb-4">atau</p>
          <Button onClick={onButtonClick}>Pilih File dari Komputer</Button>
          <p className="text-xs text-muted-foreground mt-4 max-w-sm">
            Gambar Anda diproses langsung di browser Anda dan tidak pernah diunggah ke server untuk konversi standar. Privasi Anda terjamin.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
