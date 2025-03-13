export default function compareArrays(
  newArr: any[][],
  oldArr: any[][],
  itemNameIndex: number,
  priceIndex: number,
) {
  const changes: CompareArrays = {
    newItems: [],
    deletedItems: [],
    changedPrices: [],
  };

  const newItemMap = new Map(newArr.map((item) => [item[itemNameIndex], item]));
  const oldItemMap = new Map(oldArr.map((item) => [item[itemNameIndex], item]));

  // Check for deleted items or price changes
  for (const [key, oldItem] of oldItemMap.entries()) {
    if (!newItemMap.has(key)) {
      changes.deletedItems.push({
        item: oldItem,
      });
    } else {
      const newItem = newItemMap.get(key);

      // Skip if either price is a date
      const isOldPriceDate = isDateValue(oldItem[priceIndex]);
      const isNewPriceDate = isDateValue(newItem[priceIndex]);

      if (
        newItem &&
        !isOldPriceDate &&
        !isNewPriceDate &&
        newItem[priceIndex] !== oldItem[priceIndex]
      ) {
        changes.changedPrices.push({
          item: newItem,
          oldPrice: oldItem[priceIndex], // Old price from old array
          newPrice: newItem[priceIndex], // New price from new array
        });
      }
    }
  }

  // Check for new items
  for (const [key, newItem] of newItemMap.entries()) {
    if (!oldItemMap.has(key)) {
      changes.newItems.push({
        item: newItem,
      });
    }
  }

  return changes;
}

// Helper function to detect if a value is a date
function isDateValue(value: any): boolean {
  // Check if it's a string in date format (YYYY-MM-DD)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return true;
  }

  // Check if it's a Date object
  if (value instanceof Date) {
    return true;
  }

  return false;
}
