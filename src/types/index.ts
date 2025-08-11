export type ConversionStatus = 'pending' | 'converting' | 'converted' | 'ai_optimizing' | 'error';

export type ConversionFormat = 'image/webp' | 'image/jpeg' | 'image/png';

export interface ConversionOptions {
  format: ConversionFormat;
  quality: number;
}

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  status: ConversionStatus;
  progress?: number;
  convertedFile?: Blob;
  convertedSize?: number;
  convertedUrl?: string;
  originalUrl?: string;
  error?: string;
  conversionOptions: ConversionOptions;
}
