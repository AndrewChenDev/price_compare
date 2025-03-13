"use client"

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

type SheetSelectionProps = {
    currentSheet: string
    sheets: string[]
    onChange: (sheet: string) => void
}

export function SheetSelection({currentSheet, sheets, onChange }: SheetSelectionProps) {
    return (
        <Select value={currentSheet} onValueChange={onChange}>
            <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a sheet" />
            </SelectTrigger>
            <SelectContent>
                {sheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                        {sheet}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
