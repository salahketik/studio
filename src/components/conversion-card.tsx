'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import type { PdfConversionStatus } from "@/types";

interface ConversionCardProps {
    title: string;
    description: string;
    status: PdfConversionStatus | 'disabled';
    onConvert: () => void;
}

export function ConversionCard({ title, description, status, onConvert }: ConversionCardProps) {
    const isConverting = status === 'converting';
    const isDisabled = status === 'disabled' || isConverting;

    const buttonText = () => {
        if (isConverting) return "Converting...";
        if (status === 'disabled') return "Coming Soon";
        return "Convert Now";
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
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
