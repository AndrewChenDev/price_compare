"use client";

import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import compareArrays from "@/components/util/compareArrays";
import letterToIndex from "@/components/util/letterToIndex";
import { atom, useAtomValue } from "jotai";
import ExcelFileUpload from "@/components/ui/ExcelFileUpload";
import { jsonToExcel } from "@/components/util/jsonToExcel";

export type FileData = {
  workbook: XLSX.WorkBook;
  sheets: string[];
  currentSheet: string;
  headers: string[];
  rows: string[][];
  maxColumns: number;
  filename?: string;
};

export const file1Atom = atom<FileData | null>(null);
export const file2Atom = atom<FileData | null>(null);
export const file1DataStartIndexAtom = atom<number>();
export const file2DataStartIndexAtom = atom<number>();
export const file1ColumnAtom = atom<string>("");
export const file2ColumnAtom = atom<string>("");
export const file1PriceColumnAtom = atom<string>("");
export const file2PriceColumnAtom = atom<string>("");

export function ExcelComparison() {
  const file1Data = useAtomValue(file1Atom);
  const file2Data = useAtomValue(file2Atom);
  const file1Column = useAtomValue(file1ColumnAtom);
  const file1PriceColumn = useAtomValue(file1PriceColumnAtom);

  const handleSubmit = () => {
    if (file1Data && file2Data) {
      //Compare New to Old
      const result = compareArrays(
        file1Data.rows, //New Excel file
        file2Data.rows, //Old Excel file
        letterToIndex(file1Column) ?? 0,
        letterToIndex(file1PriceColumn) ?? 0,
      );
      jsonToExcel(result, file1Data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExcelFileUpload
          label={"新報價表"}
          fileAtom={file1Atom}
          fileDataStartIndexAtom={file1DataStartIndexAtom}
          fileColumnAtom={file1ColumnAtom}
          filePriceColumnAtom={file1PriceColumnAtom}
          siblingColumnAtom={file2ColumnAtom}
          siblingPriceColumnAtom={file2PriceColumnAtom}
        ></ExcelFileUpload>
        <ExcelFileUpload
          label={"舊報價表"}
          fileAtom={file2Atom}
          fileDataStartIndexAtom={file2DataStartIndexAtom}
          fileColumnAtom={file2ColumnAtom}
          filePriceColumnAtom={file2PriceColumnAtom}
        ></ExcelFileUpload>
      </div>
      <div className="mt-8">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
