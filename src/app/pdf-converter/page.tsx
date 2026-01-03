'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/features/pdf-converter/components/pdf-uploader';
import { ConversionCard } from '@/features/pdf-converter/components/conversion-card';
import type { PdfFile } from '@/features/pdf-converter/types';
import { runPDFToWordConversion } from '@/app/actions';
import { saveAs } from 'file-saver';
import { FileText, Trash2 } from 'lucide-react';


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
      if (files.length > 1) {
        toast({
            title: "Satu file dalam satu waktu",
            description: "Alat PDF hanya memproses satu file dalam satu waktu. File pertama yang dipilih.",
        })
      }
      setPdfFile({
        id: `${file.name}-${file.lastModified}`,
        file,
        status: 'pending',
      });
    }
  }, [toast]);
  
  const handleClear = () => {
    setPdfFile(null);
  }

  const handlePdfToWord = async () => {
    if (!pdfFile) return;

    setPdfFile(prev => prev ? {...prev, status: 'converting'} : null);
    
    try {
        const pdfDataUri = await fileToDataUri(pdfFile.file);
        const result = await runPDFToWordConversion({ pdfDataUri });

        if (result.error) {
            throw new Error(result.error);
        }

        if (result.docxDataUri) {
            saveAs(result.docxDataUri, pdfFile.file.name.replace(/\.pdf$/, '.docx'));
            setPdfFile(prev => prev ? {...prev, status: 'converted'} : null);
            toast({
                title: 'Konversi Berhasil',
                description: 'PDF Anda telah berhasil dikonversi ke dokumen Word.',
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui.';
        setPdfFile(prev => prev ? {...prev, status: 'error', error: errorMessage} : null);
        toast({
            variant: 'destructive',
            title: 'Konversi Gagal',
            description: errorMessage,
        });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 h-full">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Perangkat PDF</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Alat canggih berbasis AI untuk mengonversi dan mengedit file PDF Anda.
              </p>
          </div>
          
          {!pdfFile && <PdfUploader onUpload={handlePdfUpload} />}

          {pdfFile && (
              <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-card flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                          <FileText className="h-8 w-8 text-primary shrink-0" />
                          <p className="font-semibold truncate">{pdfFile.file.name}</p>
                      </div>
                      <Button variant="destructive" size="icon" onClick={handleClear} className="shrink-0">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Hapus file</span>
                      </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ConversionCard
                          title="Konversi ke Word"
                          description="Gunakan AI untuk mengubah PDF Anda menjadi file Microsoft Word (.docx) yang dapat diedit."
                          onConvert={handlePdfToWord}
                          status={pdfFile.status}
                      />
                      <ConversionCard
                          title="Konversi ke Excel"
                          description="Ekstrak tabel dan data ke dalam file Microsoft Excel (.xlsx). (Segera Hadir)"
                          onConvert={() => {}}
                          status="disabled"
                      />
                          <ConversionCard
                          title="Konversi ke PowerPoint"
                          description="Ubah halaman PDF menjadi slide PowerPoint (.pptx) yang dapat diedit. (Segera Hadir)"
                          onConvert={() => {}}
                          status="disabled"
                      />
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}
