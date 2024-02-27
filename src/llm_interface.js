import OpenAI from 'openai'

import { PROMPT_FOR_PR_REVIEW, ModelNames } from './constants'

class OpenAIInterface {
  constructor(api_key, gpt_model) {
    if (!api_key) {
      throw new Error('OpenAI API key is required')
    }
    if (!ModelNames.isModelValid(gpt_model)) {
      throw new Error(
        `Invalid GPT model name: ${gpt_model}. Valid models are: ${Object.values(
          ModelNames.models
        )}`
      )
    }
    this.gpt_model = gpt_model
    this.openai = new OpenAI({
      apiKey: api_key
    })
  }

  async getCommentsonPR(code_changes) {
    const response = await this.openai.chat.completions.create({
      model: this.gpt_model,
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
