const PROMPT_FOR_PR_REVIEW =
  'You are a software developer and you are given task to review code changes in the PR. ' +
  'Code changes is given as list of dictionary. ' +
  'Each dictionary has filename, code snippet before and after change. ' +
  'Some unchanged common lines are present in both before/after change. ' +
  'Review the changes for improvements, correctness, design, clean code, security, performance and other best practices.' +
  'Only provide the comments that you are confident about. ' +
  'Return ONLY list of comments as response: ' +
  '[{"path": "path/to/file", "position": line_number on code_after_change, "body": "comment"}, ' +
  ' {"path", "path/to/file", "position": line_number on code_after_change, "body": "comment"}]' +
  'If you have no comments, return an empty list.'

const PROMPT_FOR_MORE_INFO =
  'You are a developer reviewing a Pull request.' +
  'The code change is a list of dictionary. ' +
  'Each dictionary has a key called filename which has changed, before_change, and after_change.' +
  'Return only a list of function names/class/constants that you need more information about to review the code.' +
  'ONLY include names in project files, not in inbuild/external libraries' +
  'Example: ["function_name", "class_name", "constant_name"]. If no more information is required, return an empty list.'
