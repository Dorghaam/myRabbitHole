// ============================================
// OPEN LIBRARY BOOK SERVICE
// ============================================

export async function searchBookCover(
  title: string,
  author?: string
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      title,
      fields: 'cover_i',
      limit: '1',
    })
    if (author) {
      params.set('author', author)
    }

    const response = await fetch(
      `https://openlibrary.org/search.json?${params.toString()}`
    )

    if (!response.ok) return null

    const data = await response.json()
    const coverId = data.docs?.[0]?.cover_i

    if (!coverId) return null

    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
  } catch (error) {
    console.error('Book cover search failed:', error)
    return null
  }
}
