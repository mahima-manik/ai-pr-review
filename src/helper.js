import { Octokit as OctokitRest } from '@octokit/rest'
const core = require('@actions/core')

const octokit = new OctokitRest({
  auth: core.getInput('github-token')
})

export async function get_ignore_list(owner, repo, file_path) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: file_path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      mediaType: {
        format: 'raw'
      }
    })

    const content = response.data
    const files_to_ignore = content
      .split('\n')
      .filter(line => !line.startsWith('#') && line !== '')
    return files_to_ignore
  } catch (error) {
    console.log(error)
    return []
  }
}
