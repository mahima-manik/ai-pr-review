import OpenAI from 'openai'

const github = require('@actions/github')
const core = require('@actions/core')

const { getAllReferences } = require('./search')

const OPENAI_KEY = core.getInput('openai-key')
const openai = new OpenAI({
  apiKey: OPENAI_KEY
})

async function getMoreInfo(code_changes) {
  const prompt =
    'You are a developer reviewing a Pull request.' +
    'The code change is a list of dictionary. ' +
    'Each dictionary has a key called filename which has changed, before_change, and after_change.' +
    'Return only a list of function names/class/constants that you need more information about to review the code.' +
    'Example: ["function_name", "class_name", "constant_name"]. If no more information is required, return an empty list.'

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: JSON.stringify(code_changes) }
    ]
  })
  try {
    const more_info_list = JSON.parse(response.choices[0].message.content)
    return more_info_list
  } catch (error) {
    console.log('Error parsing response from OpenAI: ', response, error)
    return []
  }
}

/**
 * Generate comments for a code change.
 * @param {object} code_changes The code changes to review.
 * @param {string} openai_key The OpenAI API key.
 * @returns {Promise<object[]>} The list of comments to add to the PR.
 */
export async function generateComments(code_changes) {
  const system_prompt =
    'Act as a developer and review PR changes. Code changes is given as list of dictionary. ' +
    'Each dictionary filename, code snippet before and after change. ' +
    'Some unchanged common lines are present in both before/after change. ' +
    'Review the changes for improvements, correctness, design, clean code, security, performance and other best practices.' +
    'Extra files are provided for reference, but not to review. ' +
    'Return review comments as following: ' +
    '[{"path": "path/to/file", "position": line_number on code_after_change, "body": "comment"}].' +
    'If you have no comments, return an empty list. '

  const more_info_list = await getMoreInfo(code_changes)

  console.log('More information is required on following: ', more_info_list)
  const file_paths_to_review = code_changes.map(change => change.filename)

  const extra_files_context = await getAllReferences(
    github.context.payload.pull_request.base.repo.owner.login,
    github.context.payload.pull_request.base.repo.name,
    more_info_list,
    file_paths_to_review
  )

  const user_prompt = `Files to review: 
    ${JSON.stringify(code_changes)} \n
    Extra files for reference, but not to review:
    ${JSON.stringify(extra_files_context)}`

  console.log('User prompt is: ', user_prompt)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      { role: 'system', content: system_prompt },
      { role: 'user', content: user_prompt }
    ]
  })

  const comments_list = JSON.parse(response.choices[0].message.content)
  return comments_list
}
