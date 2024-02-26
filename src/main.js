import { PullRequest } from './pull_request'
import { OpenAIInterface } from './llm_interface'
import { AIReviewer } from './ai_reviewer'

const core = require('@actions/core')
const github = require('@actions/github')

const OPENAI_KEY = core.getInput('openai-key')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const pr_context = github.context.payload.pull_request
    const pull_request = new PullRequest(pr_context)
    await pull_request.getDiffString()

    const reviewer = new AIReviewer(pull_request)
    await reviewer.formatPrChanges()

    console.log('Response is: ', reviewer.fomatted_changes)

    const openai_interface = new OpenAIInterface(OPENAI_KEY)
    const comments_list = await openai_interface.getCommentsonPR({
      title: pr_context.title,
      description: pr_context.body,
      changes: reviewer.fomatted_changes
    })
    console.log('Comments are: ', comments_list)
    pull_request.addReview(comments_list)
  } catch (error) {
    // Fail the workflow run if an error occurs
    console.error(error)
    core.setFailed(error.message)
  }
}
