const core = require('@actions/core')
const github = require('@actions/github')

const { parsePR } = require('./parse')
const { generateComments } = require('./reviewer')
const { addCommentToPR } = require('./comments')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const files_to_ignore = core.getInput('files-to-ignore')

    const pr_diff = await parsePR(
      github.context.payload.pull_request,
      files_to_ignore
    )
    console.log('PR diff is: ', pr_diff)

    const OPENAI_KEY = core.getInput('openai-key')

    const comments_list = await generateComments(pr_diff, OPENAI_KEY)
    console.log('PR comments are: ', comments_list)

    const response = await addCommentToPR(
      github.context.payload.pull_request.base.repo.owner.login,
      github.context.payload.pull_request.base.repo.name,
      github.context.payload.pull_request.number,
      comments_list
    )
    console.log('Response is: ', response)
    if (response) {
      core.setOutput('comment-added', true)
    } else {
      core.setOutput('comment-added', false)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}
