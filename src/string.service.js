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
