export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;

  let wordCount = 0;
  let isWord = false;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    // Checking for whitespace: space (32), tab (9), newline (10), carriage return (13)
    if (char === 32 || char === 9 || char === 10 || char === 13) {
      isWord = false;
    } else if (!isWord) {
      isWord = true;
      wordCount++;
    }
  }

  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return readingTimeMinutes;
}
