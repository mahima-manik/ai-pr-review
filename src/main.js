/* eslint-disable import/extensions */
const { PullRequest } = require('./pull_request.js')
const { AIReviewer } = require('./ai_reviewer.js')

const core = require('@actions/core')
const github = require('@actions/github')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const pr_context = github.context.payload.pull_request
    const pull_request = new PullRequest(pr_context)
    console.log('Pull request is: ', pull_request.pr_branch_name)
    const reviewer = new AIReviewer(pull_request)
    await reviewer.formatPrChanges()

    console.log('Response is: ', reviewer.fomatted_changes)
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.error(error)
    core.setFailed(error.message)
  }
}
