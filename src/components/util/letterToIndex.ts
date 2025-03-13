/**
 * Converts an Excel column letter to a zero-based index.
 *
 * This utility function translates Excel-style column identifiers (A, B, C, etc.)
 * to their corresponding zero-based array indices (0, 1, 2, etc.).
 *
 * Examples:
 * - "A" -> 0
 * - "B" -> 1
 * - "Z" -> 25
 *
 * @param letter - The Excel column letter (case-insensitive, single character A-Z)
 * @returns The zero-based index corresponding to the letter, or null if invalid
 */
export default function letterToIndex(letter: string): number | null {
  // Handle empty input
  if (!letter || letter.length === 0) {
    return null;
  }

  // Convert the letter to uppercase to handle both cases
  const uppercaseLetter = letter.toUpperCase();

  // Calculate position (A=1, B=2, ...) by converting char code
  // ASCII 'A' is 65, so we subtract 64 to get position 1
  const position = uppercaseLetter.charCodeAt(0) - 64;

  // Check if the letter is within the valid range (A-Z)
  if (position >= 1 && position <= 26) {
    // Convert from 1-based to 0-based index
    return position - 1;
  } else {
    return null; // Return null for invalid input
  }
}
