import OpenAI from 'openai'

import { PROMPT_FOR_PR_REVIEW } from './constants'

class OpenAIInterface {
  constructor(api_key) {
    this.openai = new OpenAI({
      apiKey: api_key
    })
  }

  async getCommentsonPR(code_changes) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: PROMPT_FOR_PR_REVIEW
        },
        { role: 'user', content: JSON.stringify(code_changes) }
      ]
    })
    try {
      const more_info_list = JSON.parse(response.choices[0].message.content)
      return more_info_list
    } catch (error) {
      console.log(
        'Error parsing response from OpenAI: ',
        response.choices[0].message.content,
        error
      )
      return []
    }
  }
}

export { OpenAIInterface }
