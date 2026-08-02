// Keyword-based "AI" category predictor.
// Each category maps to a list of keywords found in real expense descriptions.
// Matching is case-insensitive substring matching against the description.

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Others',
]

export const CATEGORY_KEYWORDS = {
  Food: ['pizza', 'burger', 'dominos', "domino's", 'kfc', 'mcdonald', 'hotel', 'restaurant', 'zomato', 'swiggy', 'cafe', 'food', 'lunch', 'dinner', 'breakfast'],
  Transport: ['uber', 'ola', 'bus', 'fuel', 'petrol', 'diesel', 'train', 'auto', 'taxi', 'metro', 'flight', 'cab', 'parking'],
  Shopping: ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mall', 'store', 'clothes', 'nykaa'],
  Entertainment: ['netflix', 'prime', 'movie', 'hotstar', 'spotify', 'cinema', 'pvr', 'game', 'concert'],
  Bills: ['electricity', 'wifi', 'eb', 'water', 'gas', 'bill', 'recharge', 'broadband', 'rent'],
  Health: ['hospital', 'medicine', 'apollo', 'doctor', 'clinic', 'pharmacy', 'medical', 'health'],
  Education: ['college', 'course', 'udemy', 'book', 'fees', 'tuition', 'exam', 'coursera'],
}

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '💡',
  Health: '🏥',
  Education: '📚',
  Others: '📦',
}

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.Others
}

/**
 * Predicts a category for an expense description.
 * Returns { category, confidence, matchedKeyword }.
 * Confidence is a simple heuristic: 95% for a direct keyword hit,
 * scaled down slightly for longer descriptions (more "noise" words),
 * and 40% fallback confidence for "Others".
 */
export function predictCategory(description) {
  const text = description.toLowerCase().trim()

  if (!text) {
    return { category: 'Others', confidence: 0, matchedKeyword: null }
  }

  for (const category of Object.keys(CATEGORY_KEYWORDS)) {
    for (const keyword of CATEGORY_KEYWORDS[category]) {
      if (text.includes(keyword)) {
        const wordCount = text.split(/\s+/).length
        const confidence = Math.max(70, 97 - (wordCount - 1) * 4)
        return { category, confidence, matchedKeyword: keyword }
      }
    }
  }

  return { category: 'Others', confidence: 40, matchedKeyword: null }
}
