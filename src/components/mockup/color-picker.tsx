'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { HexColorPicker } from "react-colorful"

interface ColorPickerProps {
    background: string;
    setBackground: (background: string) => void;
    className?: string;
}

export function ColorPicker({ background, setBackground, className }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[100px] justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
             null
            )}
            <div className="truncate flex-1">{background ? background.toUpperCase() : "Pilih warna"}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none">
        <HexColorPicker color={background} onChange={setBackground} />
      </PopoverContent>
    </Popover>
  )
}
