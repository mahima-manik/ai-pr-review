import { Octokit as OctokitRest } from '@octokit/rest'
const core = require('@actions/core')

const octokit = new OctokitRest({
  auth: core.getInput('github-token')
})

export async function getFileContent(owner, repo, file_path) {
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
    return content
  } catch (error) {
    console.log(error)
    return ''
  }
}

/**
 * Get the list of files to ignore from the .reviewignore file in the repository
 * @param {*} owner
 * @param {*} repo
 * @param {*} file_path
 * @returns {Promise<string[]>} Resolves to the list of files
 */
export async function get_ignore_list(owner, repo, file_path) {
  const content = await getFileContent(owner, repo, file_path)
  const files_to_ignore = content
    .split('\n')
    .filter(line => !line.startsWith('#') && line !== '')
  return files_to_ignore
}

export function shouldIgnoreFile(filename, files_to_ignore) {
  // Check if filename matches any pattern in files_to_ignore
  return files_to_ignore.some(pattern => {
    // Exact match for files or starts with match for directories
    return filename === pattern || filename.startsWith(`${pattern}`)
  })
}
