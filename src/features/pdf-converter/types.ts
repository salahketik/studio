export type PdfConversionStatus = 'pending' | 'converting' | 'converted' | 'error';

export interface PdfFile {
    id: string;
    file: File;
    status: PdfConversionStatus;
    error?: string;
}
