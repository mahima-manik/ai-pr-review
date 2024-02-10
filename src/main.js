import { PullRequest } from './pull_request'
import { AIReviewer } from './ai_reviewer'

const core = require('@actions/core')
const github = require('@actions/github')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const pull_request = new PullRequest(github.context.payload.pull_request)
    const reviewer = new AIReviewer(pull_request)
    reviewer.formatPrChanges()

    console.log('Response is: ', reviewer.fomatted_changes)
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.error(error)
    core.setFailed(error.message)
  }
}
