import { Octokit as OctokitRest } from '@octokit/rest'
const core = require('@actions/core')

const GITHUB_TOKEN = core.getInput('github-token')

/**
 * Adds list of comments to a PR.
 * @param {string} owner The owner of the PR.
 * @param {string} repo The repo of the PR.
 * @param {number} pr_number The number of the PR.
 * @param {object[]} list_of_comments The list of comments to add to the PR.
 * @returns {Promise<boolean>} True if the comment was added successfully, false otherwise.
 */
export async function addCommentToPR(owner, repo, pr_number, list_of_comments) {
  const octokit = new OctokitRest({
    auth: GITHUB_TOKEN
  })

  const response = await octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pr_number,
    event: 'COMMENT',
    comments: list_of_comments
  })

  console.log('Response from adding comment: ', response)

  // Check that the comment was added successfully
  if (response.status === 201) {
    console.log('Successfully added comment to PR')
    return true
  } else {
    console.log('Failed to add comment to PR')
    return false
  }
}
