const core = require('@actions/core')
const github = require('@actions/github')

const { parsePR } = require('./parse')

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
    core.setOutput('comments', files_to_ignore)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}
