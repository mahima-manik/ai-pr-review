import OpenAI from 'openai'

/**
 * Generate comments for a code change.
 * @param {object} code_changes The code changes to review.
 * @param {string} openai_key The OpenAI API key.
 * @returns {Promise<object[]>} The list of comments to add to the PR.
 */
export async function generateComments(code_changes, openai_key) {
  const system_prompt =
    'You are reviewing a code change. ' +
    'The code change is a list of dictionary. ' +
    'Each dictionary has a key called filename which has changed, before_change, and after_change. ' +
    'Review the changes and give PR comments as list of dictionary with the following format: ' +
    '[{"path": "path/to/file", "position": line_number, "body": "change comment"}].' +
    'If you have no comments, return an empty list. '

  const openai = new OpenAI({
    apiKey: openai_key
  })

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    max_tokens: 4096,
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: JSON.stringify(code_changes) }
    ]
  })

  const comments_list = JSON.parse(response.choices[0].message.content)
  return comments_list
}
