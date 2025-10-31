'use client';

import { useState, useCallback, useRef, type DragEvent } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PdfUploaderProps {
  onUpload: (files: File[]) => void;
}

export function PdfUploader({ onUpload }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Only PDF files are accepted. Other files were ignored.",
        });
    }

    if (pdfFiles.length > 0) {
        onUpload(pdfFiles);
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
    setIsDragging(true);
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
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-300 flex flex-col items-center justify-center text-center',
        isDragging ? 'border-accent bg-accent/10' : 'border-border bg-card'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={false}
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <FileUp className="w-16 h-16 text-muted-foreground mb-4" />
      <p className="text-lg font-semibold mb-2">Drag & drop a PDF here</p>
      <p className="text-muted-foreground mb-4">or</p>
      <Button onClick={onButtonClick}>Select PDF</Button>
      <p className="text-xs text-muted-foreground mt-4">
        Your file will be securely sent to our AI for conversion.
      </p>
    </div>
  );
}
