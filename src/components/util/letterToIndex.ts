export default function letterToIndex(letter: string): number | null {
    // Convert the letter to uppercase to handle both cases
    const uppercaseLetter = letter.toUpperCase();

    const position = uppercaseLetter.charCodeAt(0) - 64;

    // Check if the letter is within the valid range (A-Z)
    if (position >= 1 && position <= 26) {
        return position-1;
    } else {
        return null; // Return null for invalid input
    }
}
