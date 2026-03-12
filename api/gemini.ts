import type { VercelRequest, VercelResponse } from '@vercel/node'

const GEMINI_MODEL = 'gemini-2.0-flash'
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' })
  }

  const { systemPrompt, userContent } = req.body

  if (!systemPrompt || !userContent) {
    return res.status(400).json({ error: 'Missing systemPrompt or userContent' })
  }

  const url = `${BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userContent }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
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

      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment and try again.' })
      }

      return res.status(response.status).json({ error: errorMessage })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Gemini API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
