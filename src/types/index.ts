export type ConversionStatus = 'pending' | 'converting' | 'converted' | 'ai_optimizing' | 'error';

export type ConversionFormat = 'image/webp' | 'image/jpeg' | 'image/png';

export interface ConversionOptions {
  format: ConversionFormat;
  quality: number;
}

export interface ResizeOptions {
    enabled: boolean;
    width: number;
    height: number;
}

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  originalUrl?: string;
  originalDimensions?: { width: number; height: number };
  status: ConversionStatus;
  convertedFile?: Blob;
  convertedSize?: number;
  convertedUrl?: string;
  error?: string;
  conversionOptions: ConversionOptions;
  resize?: ResizeOptions;
}
