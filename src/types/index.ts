export type ConversionStatus = 'pending' | 'converting' | 'converted' | 'ai_optimizing' | 'error';

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  status: ConversionStatus;
  progress?: number;
  convertedFile?: Blob;
  convertedSize?: number;
  convertedUrl?: string;
  originalUrl?: string; // Add originalUrl for preview
  error?: string;
}
