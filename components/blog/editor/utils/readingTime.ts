const WORDS_PER_MINUTE = 200;

export function countWords(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text.replace(/\s/g, "").length;
}

export function estimateReadingTime(
  text: string,
  wordsPerMinute = WORDS_PER_MINUTE
): number {
  const words = countWords(text);

  if (words === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getReadingStats(text: string) {
  const words = countWords(text);

  return {
    words,
    characters: countCharacters(text),
    readingTime: estimateReadingTime(text),
  };
}