'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import type { PdfConversionStatus } from "@/features/pdf-converter/types";
import { ElementType } from "react";

interface ConversionCardProps {
    title: string;
    description: string;
    status: PdfConversionStatus | 'disabled';
    onConvert: () => void;
    icon: ElementType;
}

export function ConversionCard({ title, description, status, onConvert, icon: Icon }: ConversionCardProps) {
    const isConverting = status === 'converting';
    const isDisabled = status === 'disabled' || isConverting;

    const buttonText = () => {
        if (isConverting) return "Mengonversi...";
        if (status === 'disabled') return "Segera Hadir";
        return "Konversi Sekarang";
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                {/* Can add more content here in the future, like format options */}
            </CardContent>
            <CardFooter>
                <Button onClick={onConvert} disabled={isDisabled} className="w-full">
                    {isConverting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    {buttonText()}
                </Button>
            </CardFooter>
        </Card>
    );
}
