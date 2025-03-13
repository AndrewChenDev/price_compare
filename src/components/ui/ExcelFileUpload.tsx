import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SheetSelection } from "@/components/ui/SheetSelection";
import { ColumnSelection } from "@/components/ui/ColumnSelection";
import { ExcelTable } from "@/components/ui/ExcelTable";
import { PrimitiveAtom, useAtom } from "jotai";
import { FileData } from "@/components/excel-comparison";
import { useCallback } from "react";
import * as XLSX from "xlsx";
import { StartColumnIndexSelection } from "@/components/ui/StartColumnIndexSelection";

/**
 * Props interface for the ExcelFileUpload component.
 */
interface ExcelFileUploadProps {
  /** Optional label to display for this upload section */
  label?: string;
  /** Jotai atom to store the Excel file data */
  fileAtom: PrimitiveAtom<FileData | null>;
  /** Jotai atom to store the starting row index for data (after headers) */
  fileDataStartIndexAtom: PrimitiveAtom<number | undefined>;
  /** Jotai atom to store the selected identifier column (e.g., product ID) */
  fileColumnAtom: PrimitiveAtom<string>;
  /** Jotai atom to store the selected price column */
  filePriceColumnAtom: PrimitiveAtom<string>;
  /** Optional atom to sync identifier column selection with another component */
  siblingColumnAtom?: PrimitiveAtom<string>;
  /** Optional atom to sync price column selection with another component */
  siblingPriceColumnAtom?: PrimitiveAtom<string>;
}

/**
 * Component for uploading and configuring Excel files for comparison.
 *
 * This component handles:
 * 1. File upload and parsing
 * 2. Sheet selection within multi-sheet Excel files
 * 3. Identifying the starting row for data
 * 4. Selecting columns for product identification and price comparison
 * 5. Displaying a preview of the Excel data
 *
 * It also provides synchronization with a sibling component (for comparing two files)
 * by optionally mirroring column selections.
 */
export default function ExcelFileUpload({
  label = "",
  fileAtom,
  fileDataStartIndexAtom,
  fileColumnAtom,
  filePriceColumnAtom,
  siblingColumnAtom,
  siblingPriceColumnAtom,
}: ExcelFileUploadProps) {
  // Access state from Jotai atoms
  const [fileData, setFileData] = useAtom(fileAtom);
  const [fileColumn, setFileColumn] = useAtom(fileColumnAtom);
  const [filePriceColumn, setFilePriceColumn] = useAtom(filePriceColumnAtom);
  const [fileDataStartIndex, setFileDataStartIndex] = useAtom(
    fileDataStartIndexAtom,
  );

  // Use sibling atoms if provided (for syncing selections between components)
  // eslint-disable-next-line is needed because useAtom is called conditionally
  const [siblingColumn, setSiblingColumn] = siblingColumnAtom
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useAtom(siblingColumnAtom)
    : [null, null];
  const [siblingPriceColumn, setSiblingPriceColumn] = siblingPriceColumnAtom
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useAtom(siblingPriceColumnAtom)
    : [null, null];

  /**
   * Handles changes to the identifier column selection.
   * If this is the first component to have a column selected and the sibling
   * component has no selection yet, it will sync the selection to the sibling.
   */
  const handleColumnChange = useCallback(
    (column: string) => {
      setFileColumn(column);
      // If sibling has no selection yet, sync this selection to it
      if (setSiblingColumn && siblingColumn === "") {
        setSiblingColumn(column);
      }
    },
    [setFileColumn, setSiblingColumn, siblingColumn],
  );

  /**
   * Handles changes to the price column selection.
   * Works similar to handleColumnChange but for the price column.
   */
  const handlePriceColumnChange = useCallback(
    (price: string) => {
      setFilePriceColumn(price);
      // If sibling has no selection yet, sync this selection to it
      if (setSiblingPriceColumn && siblingPriceColumn === "") {
        setSiblingPriceColumn(price);
      }
    },
    [setFilePriceColumn, setSiblingPriceColumn, siblingPriceColumn],
  );

  /**
   * Processes the selected sheet from an Excel workbook.
   *
   * This function handles:
   * 1. Reading raw data from the sheet
   * 2. Special handling for date cells (converting to YYYY-MM-DD format)
   * 3. Filtering out empty rows
   * 4. Determining the maximum column count
   *
   * @param workbook - The Excel workbook object from SheetJS
   * @param sheetName - The name of the sheet to process
   * @returns Object containing headers, processed rows, and maximum column count
   */
  const processSheetData = (workbook: XLSX.WorkBook, sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];

    // First, read the data with dates converted to Date objects
    const workbookWithDates = XLSX.read(
      XLSX.write(workbook, { bookType: "xlsx", type: "array" }),
      {
        type: "array",
        cellDates: true,
      },
    );
    const worksheetWithDates = workbookWithDates.Sheets[sheetName];

    // Then get the raw data without date conversion
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][];

    // Get data with dates for reference
    const jsonDataWithDates = XLSX.utils.sheet_to_json(worksheetWithDates, {
      header: 1,
    }) as any[][];

    // Process the data to handle dates specifically
    const processedData = jsonData.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        // Check if this cell is a date in the date-converted version
        const dateCell = jsonDataWithDates[rowIdx]?.[colIdx];
        if (dateCell instanceof Date) {
          // Format the date as YYYY-MM-DD
          return dateCell.toISOString().split("T")[0];
        }
        // Keep other values as is
        return cell;
      }),
    );

    // Filter out empty rows and ensure at least 2 columns per row
    const rows = processedData.filter(
      (row) =>
        row.some((cell) => String(cell).trim().length > 0) && row.length > 1,
    );

    // Get headers from the first row, or empty array if no rows
    const headers = rows.length > 0 ? rows[0] : [];

    // Calculate the maximum number of columns in any row
    const maxColumns = Math.max(...jsonData.map((row) => row.length));

    return { headers, rows, maxColumns };
  };

  /**
   * Handles the file upload process when a user selects an Excel file.
   *
   * This function:
   * 1. Reads the selected file as an ArrayBuffer
   * 2. Parses it using SheetJS
   * 3. Processes the first sheet to extract data
   * 4. Updates the file data state
   * 5. Resets selection states when a new file is uploaded
   *
   * @param event - The file input change event
   * @param setFileData - Function to update the file data state
   */
  const handleFileUpload = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      setFileData: (data: FileData) => void,
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        const fileName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const firstSheetName = workbook.SheetNames[0];
          const { headers, rows, maxColumns } = processSheetData(
            workbook,
            firstSheetName,
          );

          // Update file data state with the parsed Excel data
          setFileData({
            workbook,
            sheets: workbook.SheetNames,
            currentSheet: firstSheetName,
            headers,
            rows,
            maxColumns,
            filename: fileName,
          });

          // Reset selections when a new file is uploaded
          setFileDataStartIndex(0);
          setFileColumn("");
          setFilePriceColumn("");
        };
        reader.readAsArrayBuffer(file);
      }
    },
    [setFileDataStartIndex, setFileColumn, setFilePriceColumn],
  );

  /**
   * Handles the sheet change when a user selects a different sheet in the Excel file.
   *
   * This function:
   * 1. Processes the newly selected sheet
   * 2. Updates the file data state with new sheet data
   * 3. Resets index and column selections
   *
   * @param sheetName - The name of the selected sheet
   * @param fileData - The current file data state
   * @param setFileData - Function to update the file data state
   */
  const handleSheetChange = useCallback(
    (
      sheetName: string,
      fileData: FileData | null,
      setFileData: (data: FileData) => void,
    ) => {
      if (fileData?.workbook) {
        const workbook = fileData.workbook;
        const { headers, rows, maxColumns } = processSheetData(
          workbook,
          sheetName,
        );

        // Update the file data with the new sheet information
        // Explicitly preserve the filename property
        setFileData({
          ...fileData,
          currentSheet: sheetName,
          headers,
          rows,
          maxColumns,
          filename: fileData.filename, // Preserve the filename
        });

        // Reset the data start index to 0 when switching sheets
        setFileDataStartIndex(0);

        // Reset column selections as they might be invalid in the new sheet
        setFileColumn("");
        setFilePriceColumn("");
      }
    },
    [setFileDataStartIndex, setFileColumn, setFilePriceColumn],
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
        <Label htmlFor="excel-file-1">上傳{label}</Label>
        <Input
          id={"excel-file-1"}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => handleFileUpload(e, setFileData)}
        />
      </div>
      {fileData && (
        <>
          <Label htmlFor="sheets1-selection">選擇表單</Label>
          <SheetSelection
            currentSheet={fileData.currentSheet}
            sheets={fileData.sheets}
            onChange={(sheet) =>
              handleSheetChange(sheet, fileData, setFileData)
            }
          />

          <Label htmlFor={"start-column-index"}>
            <span className={"w-3 h-3 inline-block bg-gray-500 mr-2"}></span>
            請選擇開始欄位（選擇標題列的位置 或 第一個產品資料的開始位置）
          </Label>
          <StartColumnIndexSelection
            fileDataAtom={fileAtom}
            fileDataStartIndexAtom={fileDataStartIndexAtom}
          />
          {/*Column selection*/}
          {fileDataStartIndex !== undefined && fileDataStartIndex >= 0 && (
            <div className="flex gap-4 mb-4">
              <div className="flex-1 flex flex-col gap-4">
                <Label className={""} htmlFor={"column-select"}>
                  <span
                    className={"w-3 h-3 inline-block bg-blue-500 mr-2"}
                  ></span>
                  請選擇唯一標識的欄位
                  <br />
                  （例如：產品編號或序號）
                </Label>
                <ColumnSelection
                  headers={fileData.headers}
                  placeholder="選擇唯一標識欄位"
                  onChange={(column) => handleColumnChange(column)}
                  value={fileColumn}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <Label htmlFor={"price-column-select"}>
                  <span
                    className={"w-3 h-3 inline-block bg-red-500 mr-2"}
                  ></span>
                  請選擇要比對價格的欄位
                </Label>
                <ColumnSelection
                  headers={fileData.headers}
                  placeholder="選擇價格欄位"
                  onChange={(price) => handlePriceColumnChange(price)}
                  value={filePriceColumn}
                />
              </div>
            </div>
          )}
          <Label htmlFor={"preview-table"}>{label}預覽</Label>
          <div className={"h-[300px] overflow-y-auto"}>
            <ExcelTable
              rows={fileData.rows}
              maxColumns={fileData.maxColumns}
              fileDataStartIndexAtom={fileDataStartIndexAtom}
              fileColumnAtom={fileColumnAtom}
              filePriceColumnAtom={filePriceColumnAtom}
            />
          </div>
        </>
      )}
    </div>
  );
}
