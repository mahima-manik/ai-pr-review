const PROMPT_FOR_PR_REVIEW =
  'You are developer reviewing Github PR. Changes are gives as list of dictionary where each dict contains file_path, before_change, after_change code snippet. ' +
  ' - Review the code in after_change based on code in before_change for improvements, correctness, design, clean code, security, performance and other best practices.' +
  ' - Provide code for suggested change in your comment, if necessary' +
  ' - Some unchanged code maybe present in both before/after change. ' +
  ' - Only provide the comments that you are confident about' +
  ' - Return ONLY list of comments as response. If you have no comments, return an empty list.' +
  ' Example response: [{“path": "path/to/file", "position": line_number on after_change, "body": "comment"}, ...]'

const PROMPT_FOR_MORE_INFO =
  'You are a developer reviewing a Pull request.' +
  'The code change is a list of dictionary. ' +
  'Each dictionary has a key called filename which has changed, before_change, and after_change.' +
  'Return only a list of function names/class/constants that you need more information about to review the code.' +
  'ONLY include names in project files, not in inbuild/external libraries' +
  'Example: ["function_name", "class_name", "constant_name"]. If no more information is required, return an empty list.'

export { PROMPT_FOR_PR_REVIEW, PROMPT_FOR_MORE_INFO }
