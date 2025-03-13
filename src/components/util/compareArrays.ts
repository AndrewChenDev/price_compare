/**
 * Type definition for a product data row, which is an array of values
 * that can be strings, numbers, null, or undefined
 */
export type ProductRow = Array<string | number | null | undefined>;

/**
 * Type for a product with only its data row
 */
export interface ProductItem {
  item: ProductRow;
}

/**
 * Type for a product with price change information
 */
export interface ProductPriceChange {
  item: ProductRow;
  oldPrice: string | number;
  newPrice: string | number;
}

/**
 * Interface definition for the return type of the compareArrays function.
 * It contains arrays for new items, deleted items, and items with price changes.
 */
export interface CompareArrays {
  newItems: ProductItem[];
  deletedItems: ProductItem[];
  changedPrices: ProductPriceChange[];
}

/**
 * Compares two arrays of product data and identifies differences.
 *
 * @param newArr - The new/updated array of product data (rows from the new Excel file)
 * @param oldArr - The old/original array of product data (rows from the old Excel file)
 * @param itemNameIndex - The column index that contains the unique identifier for each product
 * @param priceIndex - The column index that contains the price information
 * @returns An object containing arrays of new items, deleted items, and items with price changes
 */
export default function compareArrays(
  newArr: ProductRow[],
  oldArr: ProductRow[],
  itemNameIndex: number,
  priceIndex: number,
): CompareArrays {
  const changes: CompareArrays = {
    newItems: [],
    deletedItems: [],
    changedPrices: [],
  };

  // Create maps for fast lookup using the product identifier as the key
  const newItemMap = new Map<string | number | null | undefined, ProductRow>(
    newArr.map((item) => [item[itemNameIndex], item]),
  );

  const oldItemMap = new Map<string | number | null | undefined, ProductRow>(
    oldArr.map((item) => [item[itemNameIndex], item]),
  );

  // Check for deleted items or price changes
  // Using Array.from to convert Map entries to an array for compatibility
  Array.from(oldItemMap.keys()).forEach((key) => {
    const oldItem = oldItemMap.get(key)!; // We know this exists because we got it from keys()

    if (!newItemMap.has(key)) {
      // Item exists in old data but not in new data - it's been deleted
      changes.deletedItems.push({
        item: oldItem,
      });
    } else {
      const newItem = newItemMap.get(key);

      // Skip if either price is a date (avoid comparing dates as prices)
      const isOldPriceDate = isDateValue(oldItem[priceIndex]);
      const isNewPriceDate = newItem ? isDateValue(newItem[priceIndex]) : false;

      const oldPrice = oldItem[priceIndex];
      const newPrice = newItem ? newItem[priceIndex] : undefined;

      if (
        newItem &&
        !isOldPriceDate &&
        !isNewPriceDate &&
        newPrice !== oldPrice &&
        // Ensure we have valid price values that can be used
        (typeof oldPrice === "string" || typeof oldPrice === "number") &&
        (typeof newPrice === "string" || typeof newPrice === "number")
      ) {
        // Price has changed for this item
        changes.changedPrices.push({
          item: newItem,
          oldPrice: oldPrice as string | number,
          newPrice: newPrice as string | number,
        });
      }
    }
  });

  // Check for new items (exist in new data but not in old data)
  // Using Array.from to convert Map entries to an array for compatibility
  Array.from(newItemMap.keys()).forEach((key) => {
    if (!oldItemMap.has(key)) {
      const newItem = newItemMap.get(key)!; // We know this exists because we got it from keys()
      changes.newItems.push({
        item: newItem,
      });
    }
  });

  return changes;
}

/**
 * Helper function to detect if a value is a date.
 *
 * @param value - The value to check
 * @returns True if the value is a date (either Date object or date string format)
 */
function isDateValue(value: unknown): boolean {
  // Check if it's a string in date format (YYYY-MM-DD)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return true;
  }

  // Check if it's a Date object
  return value instanceof Date;
}
