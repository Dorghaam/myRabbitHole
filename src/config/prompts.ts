import { PromptType, PromptConfig } from '../types'

export const PROMPT_CONFIG: PromptConfig[] = [
  // ========== BASIC UNDERSTANDING ==========
  {
    type: PromptType.WHAT,
    label: 'What',
    description: 'Get a basic explanation of the concept',
    generatesTerms: false,
    systemPrompt: `Explain what the given topic is in a clear, comprehensive paragraph.
Provide a foundational understanding that someone unfamiliar with the topic could grasp.
Be informative but concise. Do not use bullet points or lists - write in flowing prose.
Maximum 150 words.`,
  },
  {
    type: PromptType.HOW,
    label: 'How',
    description: 'Understand how it works or functions',
    generatesTerms: false,
    systemPrompt: `Explain how the given topic works, functions, or operates.
Describe the mechanisms, processes, or methods involved.
Write in clear, flowing prose without bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.WHO,
    label: 'Who',
    description: 'Key people, figures, or entities involved',
    generatesTerms: false,
    systemPrompt: `Describe the key people, figures, or entities associated with the given topic.
Explain who they are and their significance to this topic.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.ORIGIN,
    label: 'Origin',
    description: 'Historical origin and development',
    generatesTerms: false,
    systemPrompt: `Explain the historical origin and development of the given topic.
When and where did it originate? How did it develop over time?
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.ELABORATE,
    label: 'Elaborate',
    description: 'Deeper, more detailed explanation',
    generatesTerms: false,
    systemPrompt: `Provide a deeper, more detailed explanation of the given topic.
Expand on the nuances, complexities, and important details.
Write in flowing prose, no bullet points.
Maximum 200 words.`,
  },

  // ========== ANALYSIS ==========
  {
    type: PromptType.PROS,
    label: 'Pros',
    description: 'Advantages and benefits',
    generatesTerms: false,
    systemPrompt: `Explain the advantages, benefits, and positive aspects of the given topic.
Write in flowing prose, integrating multiple advantages naturally.
Do not use bullet points or numbered lists.
Maximum 150 words.`,
  },
  {
    type: PromptType.CONS,
    label: 'Cons',
    description: 'Disadvantages and drawbacks',
    generatesTerms: false,
    systemPrompt: `Explain the disadvantages, drawbacks, and negative aspects of the given topic.
Write in flowing prose, integrating multiple disadvantages naturally.
Do not use bullet points or numbered lists.
Maximum 150 words.`,
  },
  {
    type: PromptType.EXAMPLE,
    label: 'Example',
    description: 'Concrete examples and cases',
    generatesTerms: false,
    systemPrompt: `Provide concrete examples or cases related to the given topic.
Use specific, real-world examples to illustrate the concept.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.RESEARCH,
    label: 'Research',
    description: 'Academic and scientific findings',
    generatesTerms: false,
    systemPrompt: `Describe relevant academic research, scientific findings, or scholarly perspectives on the given topic.
Reference general research trends without citing specific papers.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },

  // ========== EXTRACTION ==========
  {
    type: PromptType.EXTRACT,
    label: 'Extract',
    description: 'Extract key terms and vocabulary',
    generatesTerms: true,
    systemPrompt: `Extract the key terms, vocabulary, and important words related to the given topic.
Return ONLY a valid JSON array with 4-8 items in this exact format:
[
  {"name": "Term", "description": "Brief 5-10 word definition"},
  ...
]
No other text, just the JSON array.`,
  },
  {
    type: PromptType.CONCEPTS,
    label: 'Concepts',
    description: 'Related concepts and ideas',
    generatesTerms: true,
    systemPrompt: `Identify concepts and ideas closely related to the given topic.
Return ONLY a valid JSON array with 4-6 items in this exact format:
[
  {"name": "Concept Name", "description": "Brief 5-10 word description"},
  ...
]
No other text, just the JSON array.`,
  },

  // ========== COMPARATIVE ==========
  {
    type: PromptType.COMPARE,
    label: 'Compare',
    description: 'Compare with similar concepts',
    generatesTerms: false,
    systemPrompt: `Compare the given topic with similar or related concepts.
Highlight similarities and differences.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.ANALOGY,
    label: 'Analogy',
    description: 'Analogies to explain the concept',
    generatesTerms: false,
    systemPrompt: `Create helpful analogies to explain the given topic.
Use familiar concepts to make the topic easier to understand.
Write in flowing prose, no bullet points.
Maximum 120 words.`,
  },

  // ========== CRITICAL THINKING ==========
  {
    type: PromptType.CONTROVERSY,
    label: 'Controversy',
    description: 'Debates and controversies',
    generatesTerms: false,
    systemPrompt: `Describe any debates, controversies, or differing viewpoints surrounding the given topic.
Present multiple perspectives fairly.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.IMPLICATIONS,
    label: 'Implications',
    description: 'Consequences and implications',
    generatesTerms: false,
    systemPrompt: `Explain the implications, consequences, and potential impacts of the given topic.
Consider both immediate and long-term effects.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.SIGNIFICANCE,
    label: 'Significance',
    description: 'Why it matters',
    generatesTerms: false,
    systemPrompt: `Explain why the given topic is significant and why it matters.
What is its importance in the broader context?
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
  {
    type: PromptType.INTERESTING,
    label: 'Interesting',
    description: 'Interesting facts and trivia',
    generatesTerms: false,
    systemPrompt: `Share interesting, surprising, or lesser-known facts about the given topic.
Focus on engaging and memorable information.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },

  // ========== SIMPLIFICATION ==========
  {
    type: PromptType.EXPLAIN,
    label: 'Explain',
    description: 'Simple explanation (ELI5)',
    generatesTerms: false,
    systemPrompt: `Explain the given topic in very simple terms, as if explaining to a beginner.
Use plain language and avoid jargon.
Write in flowing prose, no bullet points.
Maximum 120 words.`,
  },

  // ========== INQUIRY ==========
  {
    type: PromptType.QUESTIONS,
    label: 'Questions',
    description: 'Thought-provoking questions',
    generatesTerms: true,
    systemPrompt: `Generate thought-provoking questions about the given topic that encourage deeper exploration.
Return ONLY a valid JSON array with 4-6 items in this exact format:
[
  {"name": "Question text here?", "description": "Why this question matters in 5-10 words"},
  ...
]
No other text, just the JSON array.`,
  },

  // ========== DECOMPOSITION ==========
  {
    type: PromptType.SPLIT,
    label: 'Split',
    description: 'Break into sub-components',
    generatesTerms: true,
    systemPrompt: `Break down the given topic into its main sub-components or parts.
Return ONLY a valid JSON array with 3-6 items in this exact format:
[
  {"name": "Component Name", "description": "Brief 5-10 word description"},
  ...
]
No other text, just the JSON array.`,
  },
  {
    type: PromptType.JOIN,
    label: 'Join',
    description: 'Connect to broader context',
    generatesTerms: false,
    systemPrompt: `Explain how the given topic connects to broader themes, fields, or contexts.
What is it part of? What does it relate to?
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },

  // ========== CUSTOM ==========
  {
    type: PromptType.CUSTOM,
    label: 'Custom Prompt',
    description: 'Ask your own question',
    generatesTerms: false,
    systemPrompt: `Answer the user's custom question about the given topic.
Be helpful and informative.
Write in flowing prose, no bullet points.
Maximum 150 words.`,
  },
]

export const getPromptConfig = (type: PromptType): PromptConfig | undefined => {
  return PROMPT_CONFIG.find((p) => p.type === type)
}

export const CHAT_SYSTEM_PROMPT = `You are a helpful assistant that has access to a user's concept map.
The concept map is about: {topic}

Here are all the nodes in the concept map:
{nodeContents}

Answer the user's question based on this context. You can synthesize information across nodes,
find connections, or provide additional insights. Be helpful and informative.
Keep responses concise but thorough.`
