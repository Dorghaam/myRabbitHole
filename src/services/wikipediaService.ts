// ============================================
// WIKIPEDIA API SERVICE
// ============================================

export interface WikipediaSearchResult {
  title: string
  extract: string
  pageUrl: string
}

const SUMMARY_API = 'https://en.wikipedia.org/api/rest_v1/page/summary'
const SEARCH_API = 'https://en.wikipedia.org/w/api.php'

export async function searchWikipedia(query: string): Promise<WikipediaSearchResult[]> {
  // Use MediaWiki API opensearch to find matching articles
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srlimit: '8',
    format: 'json',
    origin: '*',
  })

  const response = await fetch(`${SEARCH_API}?${params}`)
  if (!response.ok) {
    throw new Error('Failed to search Wikipedia')
  }

  const data = await response.json()
  const searchResults = data.query?.search || []

  // Fetch summaries for each result
  const results: WikipediaSearchResult[] = await Promise.all(
    searchResults.map(async (result: { title: string }) => {
      try {
        const summaryRes = await fetch(
          `${SUMMARY_API}/${encodeURIComponent(result.title)}`,
          { headers: { 'Accept': 'application/json' } }
        )
        if (!summaryRes.ok) {
          return {
            title: result.title,
            extract: '',
            pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
          }
        }
        const summary = await summaryRes.json()
        return {
          title: summary.title || result.title,
          extract: summary.extract || '',
          pageUrl: summary.content_urls?.desktop?.page ||
            `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        }
      } catch {
        return {
          title: result.title,
          extract: '',
          pageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
        }
      }
    })
  )

  return results.filter((r) => r.extract.length > 0)
}
