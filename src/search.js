import { Octokit as OctokitRest } from '@octokit/rest'

const { shouldIgnoreFile, getFileContent } = require('./helper')
const core = require('@actions/core')

const octokit = new OctokitRest({
  auth: core.getInput('github-token')
})

async function getAllFilePathsInRepo(owner, repo, ref = 'HEAD') {
  const tree = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: ref,
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
  branch_name,
  list_of_queries,
  file_paths_to_review,
  file_paths_to_ignore
) {
  const all_file_paths = await getAllFilePathsInRepo(owner, repo, branch_name)
  console.log('All file paths are: ', all_file_paths)
  console.log('Files to ignore: ', file_paths_to_ignore)
  console.log('Files to review: ', file_paths_to_review)
  const files_to_search = []
  for (const file of all_file_paths) {
    if (shouldIgnoreFile(file, file_paths_to_ignore)) {
      console.log(`Ignoring file: ${file} because it is in the ignore list`)
      continue
    }
    if (file_paths_to_review.includes(file)) {
      console.log(`File ${file} is in the list of files to review`)
      continue
    }
    files_to_search.push(file)
  }

  console.log('Files to search all queries inside: ', files_to_search)

  const results = []
  for (const query of list_of_queries) {
    console.log('Searching for: ', query)

    for (const file_path of files_to_search) {
      // If file_path already exists in results, skip
      const file_path_exists = results.some(result => result.path === file_path)
      if (file_path_exists) continue

      const file_content = await getFileContent(
        owner,
        repo,
        file_path,
        branch_name
      )
      if (file_content.includes(query)) {
        console.log('Found reference for: ', query, ' in ', file_path)
        results.push({
          path: file_path,
          content: file_content
        })
      } else {
        console.log('No reference found for: ', query, ' in ', file_path)
      }
    }
  }
  return results
}
