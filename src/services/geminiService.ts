// ============================================
// GEMINI API SERVICE
// ============================================

export class GeminiService {
  private endpoint = '/api/gemini'

  /**
   * Stream generate content from Gemini API (via server proxy)
   * Using non-streaming endpoint for reliability, yielding result at once
   */
  async *streamGenerate(
    systemPrompt: string,
    userContent: string
  ): AsyncGenerator<string> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userContent }),
    })

    if (!response.ok) {
      let errorMessage = 'Failed to generate response'

      try {
        const errorJson = await response.json()
        if (errorJson.error) {
          errorMessage = errorJson.error
        }
      } catch {
        // Use default error message
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (text) {
      // Yield in chunks to simulate streaming effect
      const words = text.split(' ')
      for (let i = 0; i < words.length; i++) {
        yield words[i] + (i < words.length - 1 ? ' ' : '')
        // Small delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 20))
      }
    }
  }

  /**
   * Non-streaming generate for simpler use cases
   */
  async generate(
    systemPrompt: string,
    userContent: string
  ): Promise<string> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userContent }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
}
