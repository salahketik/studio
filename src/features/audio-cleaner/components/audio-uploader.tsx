
'use client';

import { useState, useRef, useCallback, DragEvent } from 'react';
import { Music, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
}

export function AudioUploader({ onUpload }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('audio/')) {
      toast({
        variant: 'destructive',
        title: 'File tidak valid',
        description: 'Silakan unggah file audio (MP3, WAV, dsb).',
      });
      return;
    }
    onUpload(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); }}
      className={cn(
        'w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center text-center bg-card',
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Music className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Bersihkan Audio Anda</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Unggah rekaman suara atau file audio untuk menghilangkan noise dan menjadikannya lebih jernih.
      </p>
      <Button onClick={() => fileInputRef.current?.click()} size="lg" className="gap-2">
        <UploadCloud className="w-5 h-5" />
        Pilih File Audio
      </Button>
    </div>
  );
}
