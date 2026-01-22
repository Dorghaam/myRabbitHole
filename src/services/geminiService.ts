// ============================================
// GEMINI API SERVICE
// ============================================

export class GeminiService {
  private apiKey: string
  private model: string = 'gemini-2.0-flash'
  private baseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Stream generate content from Gemini API
   * Using non-streaming endpoint for reliability, yielding result at once
   */
  async *streamGenerate(
    systemPrompt: string,
    userContent: string
  ): AsyncGenerator<string> {
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userContent }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = 'Failed to generate response'

      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message
        }
      } catch {
        // Use default error message
      }

      if (response.status === 400) {
        throw new Error('Invalid API key. Please check your Gemini API key.')
      } else if (response.status === 429) {
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
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userContent }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  }
}
