
export interface TextStats {
  words: number;
  chars: number;
  readingTime: number;
}

export const calculateStats = (text: string): TextStats => {
  // Count characters (including spaces)
  const chars = text.length;
  
  // Count words (split by whitespace)
  const wordMatch = text.match(/\S+/g);
  const words = wordMatch ? wordMatch.length : 0;
  
  // Calculate reading time (assuming 200 words per minute)
  const readingTime = Math.max(1, Math.ceil(words / 200));
  
  return { words, chars, readingTime };
};

export const countOccurrences = (text: string, pattern: RegExp): number => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};
