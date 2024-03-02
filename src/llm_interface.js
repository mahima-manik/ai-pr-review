import OpenAI from 'openai'
import { FUNCTION_CALL_SCHEMA, ModelNames } from './constants'

const PROMPT_FOR_PR_REVIEW = process.env.PROMPT_FOR_PR_REVIEW

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
    console.log(
      'Getting comments from OpenAI for PR: ',
      JSON.stringify(code_changes)
    )
    console.log('Prompt for PR review: ', PROMPT_FOR_PR_REVIEW)
    const response = await this.openai.chat.completions.create({
      model: this.gpt_model,
      messages: [
        {
          role: 'system',
          content: PROMPT_FOR_PR_REVIEW
        },
        { role: 'user', content: JSON.stringify(code_changes) }
      ],
      tools: FUNCTION_CALL_SCHEMA,
      tool_choice: {
        type: 'function',
        function: { name: 'add_comments_to_pr' }
      }
    })

    try {
      console.log(
        'OpenAI response: ',
        JSON.stringify(response.choices[0].message)
      )
      const comments = this.execute_function_call(response)
      return comments
    } catch (error) {
      console.log(
        'Error parsing response from OpenAI: ',
        response.choices[0].message,
        error
      )
      return []
    }
  }

  execute_function_call(openai_response) {
    const function_details =
      openai_response.choices[0].message.tool_calls[0].function
    if (function_details.name === 'add_comments_to_pr') {
      const function_arguments = JSON.parse(function_details.arguments)
      return function_arguments.list_of_comments
    }
    throw new Error('Invalid function call')
  }
}

export { OpenAIInterface }
