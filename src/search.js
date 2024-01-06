import { Octokit as OctokitRest } from '@octokit/rest'

const { get_ignore_list, shouldIgnoreFile } = require('./helper')
const core = require('@actions/core')

const octokit = new OctokitRest({
  auth: core.getInput('github-token')
})

async function getFileContent(owner, repo, file_path) {
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

async function getAllFilePathsInRepo(owner, repo) {
  const tree = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: 'HEAD',
    recursive: 'true',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  return tree.data.tree
    .filter(file => file.type === 'blob')
    .map(file => file.path)
}

export async function getAllReferences(
  owner,
  repo,
  list_of_queries,
  file_paths_to_review
) {
  const all_file_paths = await getAllFilePathsInRepo(owner, repo)
  const files_paths_to_ignore = await get_ignore_list(
    owner,
    repo,
    '.reveiwignore'
  )

  const files_to_search = all_file_paths.filter(
    file_path =>
      !shouldIgnoreFile(file_path, files_paths_to_ignore) &&
      !file_paths_to_review.includes(file_path)
  )

  console.log('Files to search all queries inside: ', files_to_search)

  const results = []
  for (const query of list_of_queries) {
    console.log('Searching for: ', query)

    for (const file_path of files_to_search) {
      // If file_path already exists in results, skip
      const file_path_exists = results.some(result => result.path === file_path)
      if (file_path_exists) continue

      const file_content = await getFileContent(owner, repo, file_path)
      if (file_content.includes(query)) {
        console.log('Found reference for: ', query, ' in ', file_path)
        results.push({
          path: file_path,
          content: file_content
        })
      }
    }
  }
  return results
}
