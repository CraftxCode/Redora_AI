/** Small, dependency-free text helpers used by retrieval and routing. */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'do', 'does', 'did', 'i', 'me', 'my', 'we', 'you', 'your',
  'to', 'of', 'in', 'on', 'for', 'with', 'and', 'or', 'it', 'can', 'how', 'what', 'please', 'that',
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Very light stemmer — enough to equate fail/failed/failing and plan/plans. */
export function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith('ies')) return `${w.slice(0, -3)}y`;
  if (w.length > 5 && w.endsWith('sses')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
  return w;
}

export function tokenize(text: string): string[] {
  const n = normalize(text);
  return n ? n.split(' ').map(stem) : [];
}

export function isStopword(token: string): boolean {
  return STOPWORDS.has(token);
}

export function wordCount(text: string): number {
  const n = normalize(text);
  return n ? n.split(' ').length : 0;
}

/** True when `needle` appears as a contiguous token sequence inside `haystack`. */
export function containsSequence(haystack: readonly string[], needle: readonly string[]): boolean {
  if (needle.length === 0 || needle.length > haystack.length) return false;
  outer: for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    for (let j = 0; j < needle.length; j += 1) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return true;
  }
  return false;
}
