import { getInput, setOutput, setFailed } from '@actions/core'
const { parsePR } = require('./parse')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const pr_diff = await parsePR()
    console.log('PR diff is: ', pr_diff)

    const files_to_ignore = getInput('files-to-ignore')
    setOutput('comments', files_to_ignore)
  } catch (error) {
    // Fail the workflow run if an error occurs
    setFailed(error.message)
  }
}

export default {
  run
}
