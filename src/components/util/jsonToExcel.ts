import * as XLSX from "xlsx";
import { FileData } from "@/components/excel-comparison";
import { CompareArrays } from "@/components/util/compareArrays";

/**
 * Converts comparison data to Excel format and triggers download.
 *
 * This function takes the comparison results (new items, deleted items, price changes)
 * and formats them into an Excel file for download. The file is organized with
 * separate sections for each category of change.
 *
 * @param data - The comparison results from compareArrays function
 * @param newfileData - Information about the Excel file that was processed
 */
export function jsonToExcel(data: CompareArrays, newfileData: FileData): void {
  // Create worksheet data array (array of arrays format for SheetJS)
  const worksheetData = [];

  // === Section 1: Price Changed Items ===
  worksheetData.push(["價格改變商品"]); // "Products with Price Changes"
  worksheetData.push(["新價格", "舊價格", "商品詳細資訊"]); // "New Price", "Old Price", "Product Details"

  // Filter out items without valid prices before adding to worksheet
  data.changedPrices.forEach((item: any) => {
    // Only include items with valid price values
    if (isValidPrice(item.newPrice) && isValidPrice(item.oldPrice)) {
      worksheetData.push([item.newPrice, item.oldPrice, ...item.item]);
    }
  });

  // Add a blank row for spacing between sections
  worksheetData.push([]);

  // === Section 2: New Items ===
  worksheetData.push(["新商品"]); // "New Products"
  worksheetData.push(["商品詳細資訊"]); // "Product Details"
  data.newItems.forEach((item: any) => {
    // Add empty cells for price columns to maintain consistent layout
    worksheetData.push([, , ...item.item]);
  });

  // Add a blank row for spacing between sections
  worksheetData.push([]);

  // === Section 3: Deleted Items ===
  worksheetData.push(["下架商品"]); // "Discontinued Products"
  worksheetData.push(["商品詳細資訊"]); // "Product Details"
  data.deletedItems.forEach((item) => {
    // Add empty cells for price columns to maintain consistent layout
    worksheetData.push([, , ...item.item]);
  });

  // Convert the structured array data into a worksheet object
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, newfileData.currentSheet);

  // Export the workbook to Excel format as an array buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Trigger file download with the generated Excel data
  saveAsExcelFile(excelBuffer, `${newfileData.currentSheet}_價格變化.xlsx`);
}

/**
 * Helper function to check if a value is a valid price.
 *
 * @param value - The value to check
 * @returns True if the value is a valid price (not a date, not empty, parsable as number)
 */
function isValidPrice(value: any): boolean {
  // Skip if undefined, null, or empty string
  if (value === undefined || value === null || value === "") {
    return false;
  }

  // Skip if it's a date
  if (
    value instanceof Date ||
    (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
  ) {
    return false;
  }

  // Skip if it's not a number or can't be converted to a number
  const num = Number(value);
  if (isNaN(num)) {
    return false;
  }

  return true;
}

/**
 * Creates and triggers download of an Excel file from buffer data.
 *
 * @param buffer - The Excel file data as an array buffer
 * @param filename - The name to give the downloaded file
 */
function saveAsExcelFile(buffer: BlobPart, filename: string): void {
  // Create a Blob with the Excel data
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  // Create a link element to download the file
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Append the anchor to the body and trigger the download
  document.body.appendChild(a);
  a.click();

  // Clean up DOM and memory
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
