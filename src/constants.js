const PROMPT_FOR_PR_REVIEW =
  'You are reviewing PR on Github as a developer. Input contains PR title, description and list of changes in .diff format.' +
  ' - Review the code changes carefully. Look for potential bugs, edge cases, or logic errors' +
  ' - Be clear and provide actionable feedback. For improvements, explain why they are needed.' +
  ' - Only provide the comments that you are confident about.' +
  ' - Return ONLY list of comments as response. If you have no comments, return an empty list.' +
  ' - Position value equals the number of lines down from the first "@@" hunk header. Line below first hunk in the file starts with 1 and so on.' +
  ' The position in the diff continues to increase through lines of whitespace, line additions/deletions and  and additional hunks until the beginning of a new file.' +
  ' Example response: [{"path": "path/to/file", "position": line number, "body": "comment"}, ...]'

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

export { PROMPT_FOR_PR_REVIEW, PROMPT_FOR_MORE_INFO, ModelNames }
