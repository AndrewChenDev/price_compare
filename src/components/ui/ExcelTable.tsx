"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as excelColumnName from "excel-column-name";
import { Atom, useAtom } from "jotai/index";
import { clsx } from "clsx";
import { atom } from "jotai";

type ExcelTableProps = {
  rows: string[][];
  maxColumns: number;
  fileDataStartIndexAtom?: Atom<number | undefined>;
  fileColumnAtom?: Atom<string>;
  filePriceColumnAtom?: Atom<string>;
};
export const truncateString = (str: string, maxLength: number) => {
  if (str?.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};

export function ExcelTable({
  rows,
  maxColumns,
  fileDataStartIndexAtom,
  fileColumnAtom,
  filePriceColumnAtom,
}: ExcelTableProps) {
  const [fileDataStartIndex] = useAtom(fileDataStartIndexAtom ?? atom(0));
  const [fileColumn] = useAtom(fileColumnAtom ?? atom(""));
  const [filePriceColumn] = useAtom(filePriceColumnAtom ?? atom(""));
  return (
    <div className="overflow-x-auto">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {/* Column headers (A, B, C, ...) */}
            <TableCell className="w-[50px]" />
            {/* Empty cell for row numbers */}
            {Array.from({ length: maxColumns }, (_, index) => (
              <TableCell
                key={index}
                className={clsx("bg-gray-100 w-[100px]", {
                  "bg-blue-600 text-white":
                    excelColumnName.intToExcelCol(index + 1) === fileColumn,
                  "bg-red-600 text-white":
                    excelColumnName.intToExcelCol(index + 1) ===
                    filePriceColumn,
                })}
              >
                {excelColumnName.intToExcelCol(index + 1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={clsx("", {
                "bg-gray-200": fileDataStartIndex === rowIndex,
              })}
            >
              {/* Row headers (1, 2, 3, ...) */}
              <TableCell
                className={clsx("bg-gray-100 w-[50px] text-center", {
                  "bg-gray-600 text-white": fileDataStartIndex === rowIndex,
                })}
              >
                {rowIndex + 1}
              </TableCell>
              {Array.from({ length: maxColumns }, (_, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className={clsx(
                    "min-w-[100px] whitespace-normal break-words p-2 align-top",
                    {
                      "bg-blue-200":
                        excelColumnName.intToExcelCol(cellIndex + 1) ===
                        fileColumn,
                      "bg-red-200":
                        excelColumnName.intToExcelCol(cellIndex + 1) ===
                        filePriceColumn,
                    },
                  )}
                >
                  {truncateString(row[cellIndex], 40) || ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
