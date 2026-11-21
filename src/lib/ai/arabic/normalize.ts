/**
 * Conservative Arabic text normalization:
 * - Removes Tashkeel (harakat / diacritics)
 * - Removes Tatweel / Kashida (ـ)
 * - Removes Directional marks (RLM, LRM)
 * 
 * CRITICAL RULE:
 * Preserves original letter forms:
 * - Does NOT convert 'ة' to 'ه'
 * - Does NOT convert 'ى' to 'ي'
 * - Does NOT merge Alef variants
 */

export function normalizeArabic(text: string): string {
  if (!text) return '';

  return text
    // Remove Tashkeel (diacritics: Fatha, Damma, Kasra, Sukun, Tanween, Shadda)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove Tatweel (Kashida)
    .replace(/\u0640/g, '')
    // Remove invisible directional unicode formatting marks
    .replace(/[\u200E\u200F\u202A-\u202E]/g, '')
    // Normalize excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeText(text: string): string[] {
  const normalized = normalizeArabic(text).toLowerCase();
  return normalized.split(/[\s,.;:!?()[\]{}"'\\/]+/).filter(t => t.length > 1);
}
