'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { PdfUploader } from '@/components/pdf-uploader';
import { ConversionCard } from '@/components/conversion-card';
import type { PdfFile } from '@/types';
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
            title: "One file at a time",
            description: "PDF tools only process one file at a time. The first file was selected.",
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
                title: 'Conversion Successful',
                description: 'Your PDF has been converted to a Word document.',
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setPdfFile(prev => prev ? {...prev, status: 'error', error: errorMessage} : null);
        toast({
            variant: 'destructive',
            title: 'Conversion Failed',
            description: errorMessage,
        });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold font-headline">WebPGator</h1>
              <nav className="flex items-center gap-2">
                <Button variant="link" asChild className="p-0 text-muted-foreground">
                    <Link href="/">Bulk Converter</Link>
                </Button>
                <Button variant="link" asChild className="p-0 text-muted-foreground data-[active]:text-foreground">
                    <Link href="/pdf-converter">PDF Tools</Link>
                </Button>
                <Button variant="link" asChild className="p-0 text-muted-foreground">
                    <Link href="/trim">Smart Trim</Link>
                </Button>
              </nav>
            </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">PDF Toolkit</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Powerful AI-driven tools to convert and edit your PDF files.
                </p>
            </div>
            
            {!pdfFile && <PdfUploader onUpload={handlePdfUpload} />}

            {pdfFile && (
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-card flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <FileText className="h-8 w-8 text-primary" />
                            <p className="font-semibold truncate">{pdfFile.file.name}</p>
                        </div>
                        <Button variant="destructive" size="icon" onClick={handleClear}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ConversionCard
                            title="Convert to Word"
                            description="Use AI to convert your PDF to an editable Microsoft Word (.docx) file."
                            onConvert={handlePdfToWord}
                            status={pdfFile.status}
                        />
                        <ConversionCard
                            title="Convert to Excel"
                            description="Extract tables and data into a Microsoft Excel (.xlsx) file. (Coming Soon)"
                            onConvert={() => {}}
                            status="disabled"
                        />
                         <ConversionCard
                            title="Convert to PowerPoint"
                            description="Transform PDF pages into editable PowerPoint (.pptx) slides. (Coming Soon)"
                            onConvert={() => {}}
                            status="disabled"
                        />
                    </div>
                </div>
            )}
        </div>
      </main>
      <footer className="p-4 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} WebPGator. All rights reserved.</p>
      </footer>
    </div>
  );
}
