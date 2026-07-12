'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/features/pdf-converter/components/pdf-uploader';
import { ConversionCard } from '@/features/pdf-converter/components/conversion-card';
import type { PdfFile } from '@/features/pdf-converter/types';
import { 
    runPDFToWordConversion, 
    runPDFToExcelConversion, 
    runPDFToPptConversion 
} from '@/app/actions';
import { saveAs } from 'file-saver';
import { FileText, Trash2, FileType, FileSpreadsheet, Presentation, ChevronLeft } from 'lucide-react';
import Link from 'next/link';


export default function PdfConverterPage() {
  const { toast } = useToast();
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePdfUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setPdfFile({
        id: `${file.name}-${file.lastModified}`,
        file,
        status: 'pending',
      });
    }
  }, []);
  
  const handleClear = () => {
    setPdfFile(null);
  }

  const performConversion = async (type: 'word' | 'excel' | 'ppt') => {
    if (!pdfFile) return;
    setPdfFile(prev => prev ? {...prev, status: 'converting'} : null);
    
    try {
        const pdfDataUri = await fileToDataUri(pdfFile.file);
        let result;
        let ext = '';
        
        if (type === 'word') {
            result = await runPDFToWordConversion({ pdfDataUri });
            ext = '.docx';
        } else if (type === 'excel') {
            result = await runPDFToExcelConversion({ pdfDataUri });
            ext = '.xlsx';
        } else {
            result = await runPDFToPptConversion({ pdfDataUri });
            ext = '.pptx';
        }

        if (result.error) throw new Error(result.error);
        if (result.dataUri) {
            saveAs(result.dataUri, pdfFile.file.name.replace(/\.pdf$/, ext));
            setPdfFile(prev => prev ? {...prev, status: 'converted'} : null);
            toast({ title: 'Konversi Berhasil', description: `PDF Anda telah berhasil dikonversi ke ${type.toUpperCase()}.` });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan.';
        setPdfFile(prev => prev ? {...prev, status: 'error', error: errorMessage} : null);
        toast({ variant: 'destructive', title: 'Konversi Gagal', description: errorMessage });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 h-full bg-background/50">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><ChevronLeft className="h-6 w-6" /></Link>
            </Button>
            <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Perangkat PDF Suite</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                    Suite AI lengkap untuk mentransformasi dokumen PDF Anda secara presisi.
                </p>
            </div>
          </div>
          
          {!pdfFile && <PdfUploader onUpload={handlePdfUpload} />}

          {pdfFile && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-6 border rounded-2xl bg-card shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 min-w-0">
                          <div className="bg-primary/10 p-3 rounded-xl"><FileText className="h-8 w-8 text-primary shrink-0" /></div>
                          <div className="min-w-0">
                            <p className="font-bold text-lg truncate">{pdfFile.file.name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{(pdfFile.file.size / 1024).toFixed(2)} KB • PDF Document</p>
                          </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleClear} className="shrink-0 rounded-full hover:bg-destructive/10">
                          <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ConversionCard
                          title="Konversi ke Word"
                          description="Edit dokumen Anda kembali dengan format Word yang sempurna."
                          onConvert={() => performConversion('word')}
                          status={pdfFile.status}
                          icon={FileType}
                      />
                      <ConversionCard
                          title="Konversi ke Excel"
                          description="Ekstrak data tabel secara otomatis ke spreadsheet XLSX."
                          onConvert={() => performConversion('excel')}
                          status={pdfFile.status}
                          icon={FileSpreadsheet}
                      />
                      <ConversionCard
                          title="Konversi ke PowerPoint"
                          description="Ubah setiap halaman menjadi slide presentasi PPTX."
                          onConvert={() => performConversion('ppt')}
                          status={pdfFile.status}
                          icon={Presentation}
                      />
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
