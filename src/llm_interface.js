import OpenAI from 'openai'

import { PROMPT_FOR_PR_REVIEW } from './constants'

class OpenAIInterface {
  GPT_MODEL = 'gpt-3.5-turbo'

  constructor(api_key) {
    this.openai = new OpenAI({
      apiKey: api_key
    })
  }

  async getCommentsonPR(code_changes) {
    const response = await this.openai.chat.completions.create({
      model: this.GPT_MODEL,
      messages: [
        {
          role: 'system',
          content: PROMPT_FOR_PR_REVIEW
        },
        { role: 'user', content: JSON.stringify(code_changes) }
      ]
    })
    try {
      console.log('Response from OpenAI: ', response.choices[0].message.content)
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
