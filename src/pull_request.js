const github = require('@actions/github')
const core = require('@actions/core')

const GITHUB_TOKEN = core.getInput('github-token')

class PullRequest {
  constructor(pr_context) {
    this.repo_owner = pr_context.base.repo.owner.login
    this.repo_name = pr_context.base.repo.name
    this.pr_number = pr_context.number
    this.pr_branch_name = pr_context.head.ref
    this.pr_base_branch_name = pr_context.base.ref
    this.pr_title = pr_context.title
    this.pr_body = pr_context.body
  }

  async getDiffString() {
    const octokit = github.getOctokit(GITHUB_TOKEN)
    const response = await octokit.rest.pulls.get({
      owner: this.repo_owner,
      repo: this.repo_name,
      pull_number: this.pr_number,
      mediaType: {
        format: 'diff'
      }
    })
    this.diff_string = response.data
    return this.diff_string
  }

  async getFileContent(file_path) {
    const octokit = github.getOctokit(GITHUB_TOKEN)
    const response = await octokit.rest.repos.getContent({
      owner: this.repo_owner,
      repo: this.repo_name,
      path: file_path,
      ref: this.pr_branch_name,
      mediaType: {
        format: 'raw'
      }
    })
    return response.data
  }

  async addReview(list_of_comments) {
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const response = await octokit.rest.pulls.createReview({
      owner: this.repo_owner,
      repo: this.repo_name,
      pull_number: this.pr_number,
      event: 'COMMENT',
      comments: list_of_comments
    })

    if (response.status !== 200) {
      throw new Error('Failed to add review')
    }
  }
}

module.exports = { PullRequest }
