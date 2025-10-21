import CryptoJS from 'crypto-js';

function sha256(value) {
  return CryptoJS.SHA256(value).toString();
}

function isPalindrome(value) {
  const v = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return v === v.split('').reverse().join('');
}

function characterFrequencyMap(value) {
  const map = {};
  for (const ch of value) map[ch] = (map[ch] || 0) + 1;
  return map;
}

export function analyze(value) {
  const freq = characterFrequencyMap(value);
  return {
    length: value.length,
    is_palindrome: isPalindrome(value),
    unique_characters: Object.keys(freq).length,
    word_count: value.trim() ? value.trim().split(/\s+/).length : 0,
    sha256_hash: sha256(value),
    character_frequency_map: freq,
  };
}

export function filterStrings(strings, filters) {
  return strings.filter((s) => {
    const p = s.properties;
    if (
      filters.is_palindrome !== undefined &&
      p.is_palindrome !== filters.is_palindrome
    )
      return false;
    if (filters.min_length !== undefined && p.length < filters.min_length)
      return false;
    if (filters.max_length !== undefined && p.length > filters.max_length)
      return false;
    if (filters.word_count !== undefined && p.word_count !== filters.word_count)
      return false;
    if (
      filters.contains_character &&
      !s.value.includes(filters.contains_character)
    )
      return false;
    return true;
  });
}

export function parseNaturalLanguage(query) {
  const text = query.toLowerCase();
  const filters = {};

  if (text.includes('palindromic')) filters.is_palindrome = true;
  if (text.includes('single word')) filters.word_count = 1;

  const lengthMatch = text.match(/longer than (\d+)/);
  if (lengthMatch) filters.min_length = parseInt(lengthMatch[1]);

  const containsMatch = text.match(/containing the letter ([a-z])/);
  if (containsMatch) filters.contains_character = containsMatch[1];

  if (Object.keys(filters).length === 0) {
    throw new Error('Unable to parse natural language query');
  }

  return filters;
}
export default {
  analyze,
  sha256,
  isPalindrome,
  characterFrequencyMap,
  filterStrings,
};
