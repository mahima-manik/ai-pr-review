const core = require('@actions/core')
import { parsePR } from './parse'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const pr_diff = await parsePR()
    console.log('PR diff is: ', pr_diff)

    const files_to_ignore = core.getInput('files-to-ignore')
    core.setOutput('comments', files_to_ignore)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
