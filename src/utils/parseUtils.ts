// ============================================
// PARSE LLM RESPONSES
// ============================================

export interface TermItem {
  name: string
  description?: string
  author?: string
}

/**
 * Parse JSON array from LLM response for term-generating prompts
 */
export function parseTermsFromResponse(response: string): TermItem[] {
  try {
    // Try to find JSON array in the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.warn('No JSON array found in response')
      return []
    }

    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed)) {
      console.warn('Parsed result is not an array')
      return []
    }

    // Validate and normalize items
    return parsed
      .filter((item) => item && typeof item === 'object' && item.name)
      .map((item) => ({
        name: String(item.name).trim(),
        description: item.description
          ? String(item.description).trim()
          : undefined,
        author: item.author
          ? String(item.author).trim()
          : undefined,
      }))
  } catch (error) {
    console.error('Failed to parse terms from response:', error)
    return []
  }
}

/**
 * Strip markdown formatting from text
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // bold italic
    .replace(/\*\*(.*?)\*\*/g, '$1')     // bold
    .replace(/\*(.*?)\*/g, '$1')         // italic
    .replace(/__(.*?)__/g, '$1')         // bold alt
    .replace(/_(.*?)_/g, '$1')           // italic alt
    .replace(/~~(.*?)~~/g, '$1')         // strikethrough
    .replace(/`(.*?)`/g, '$1')           // inline code
    .replace(/^#{1,6}\s+/gm, '')         // headers
    .replace(/```[\s\S]*?```/g, '')      // code blocks
}

/**
 * Clean up streaming text chunks
 */
export function cleanStreamChunk(chunk: string): string {
  // Remove markdown code block markers if present
  return chunk.replace(/```json\s*/g, '').replace(/```\s*/g, '')
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}
