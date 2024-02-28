const PROMPT_FOR_PR_REVIEW =
  'You are reviewing PR on Github as a developer. Input contains PR title, description and list of changes in .diff format.' +
  ' - Review the code changes carefully. Look for potential bugs, edge cases, or logic errors' +
  ' - Be clear and provide actionable feedback. For improvements, explain why they are needed.' +
  ' - Only provide the comments that you are confident about.' +
  ' - Each comment has path, position and body. Position is the line number in the diff, starting from 1, where you want to add a review comment.'

const PROMPT_FOR_MORE_INFO =
  'You are a developer reviewing a Pull request.' +
  'The code change is a list of dictionary. ' +
  'Each dictionary has a key called filename which has changed, before_change, and after_change.' +
  'Return only a list of function names/class/constants that you need more information about to review the code.' +
  'ONLY include names in project files, not in inbuild/external libraries' +
  'Example: ["function_name", "class_name", "constant_name"]. If no more information is required, return an empty list.'

class ModelNames {
  static models = {
    GPT_3_5_TURBO: 'gpt-3.5-turbo',
    GPT_3_5_TURBO_16K: 'gpt-3.5-turbo-16k',
    GPT_4: 'gpt-4',
    GPT_4_32K: 'gpt-4-32k'
  }

  static isModelValid(model_name) {
    return Object.values(this.models).includes(model_name)
  }
}

const FUNCTION_CALL_SCHEMA = [
  {
    type: 'function',
    function: {
      name: 'add_comments_to_pr',
      description:
        'Add list of comments to PR reviewed. Each comment has path, position and body.',
      parameters: {
        type: 'object',
        properties: {
          list_of_comments: {
            type: 'array',
            description: 'List of comments to add on a file in the PR',
            items: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description:
                    'The relative path to the file that necessitates a review comment'
                },
                position: {
                  type: 'integer',
                  description:
                    'The position in the diff where you want to add a review comment'
                },
                body: {
                  type: 'string',
                  description: 'Text of the review comment'
                }
              },
              required: ['path', 'position', 'body']
            }
          }
        },
        required: ['list_of_comments']
      }
    }
  }
]

export {
  PROMPT_FOR_PR_REVIEW,
  PROMPT_FOR_MORE_INFO,
  FUNCTION_CALL_SCHEMA,
  ModelNames
}
