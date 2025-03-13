"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as excelColumnName from "excel-column-name";
import { truncateString } from "@/components/ui/ExcelTable";

type ColumnSelectionProps = {
  headers: string[];
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
};

export function ColumnSelection({
  headers,
  placeholder,
  onChange,
  value,
}: ColumnSelectionProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {headers.map((header, index) => (
          <SelectItem
            key={index}
            value={excelColumnName.intToExcelCol(index + 1)}
          >
            {excelColumnName.intToExcelCol(index + 1)} - (
            <span className={"text-xs"}>{truncateString(header, 15)}</span>)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
