import * as XLSX from "xlsx";
import { FileData } from "@/components/excel-comparison";
import { CompareArrays } from "@/components/util/compareArrays";

export function jsonToExcel(data: CompareArrays, newfileData: FileData): void {
  // Create worksheet data here
  const worksheetData = [];
  // Add section for Changed Items
  worksheetData.push(["價格改變商品"]);
  worksheetData.push(["新價格", "舊價格", "商品詳細資訊"]);

  // Filter out items without valid prices before adding to worksheet
  data.changedPrices.forEach((item: any) => {
    // Only include items with valid price values
    if (isValidPrice(item.newPrice) && isValidPrice(item.oldPrice)) {
      worksheetData.push([item.newPrice, item.oldPrice, ...item.item]);
    }
  });

  // Add a blank row for spacing
  worksheetData.push([]);

  // Add section for New Items
  worksheetData.push(["新商品"]);
  worksheetData.push(["商品詳細資訊"]);
  data.newItems.forEach((item: any) => {
    worksheetData.push([, , ...item.item]);
  });

  // Add a blank row for spacing
  worksheetData.push([]);

  // Add section for Deleted Items
  worksheetData.push(["下架商品"]);
  worksheetData.push(["商品詳細資訊"]);
  data.deletedItems.forEach((item) => {
    worksheetData.push([, , ...item.item]);
  });

  // Convert the structured data into a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, newfileData.currentSheet);

  // Export the workbook to Excel
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Call the function to save the file
  saveAsExcelFile(excelBuffer, `${newfileData.currentSheet}_價格變化.xlsx`);
}

// Helper function to check if a value is a valid price
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

function saveAsExcelFile(buffer: BlobPart, filename: string) {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  // Create a link element to download the file
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  // Append the anchor to the body and trigger the download
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
