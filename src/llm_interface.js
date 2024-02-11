import OpenAI from 'openai'

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
          content:
            'Review the PR code and return your comments ONLY as list of dict. Each dict should contain path, position and body'
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

module.exports = { OpenAIInterface }
