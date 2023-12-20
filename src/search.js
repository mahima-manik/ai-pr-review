import { Octokit as OctokitRest } from '@octokit/rest'

const { get_ignore_list } = require('./helper')
const core = require('@actions/core')

const octokit = new OctokitRest({
  auth: core.getInput('github-token')
})

async function searchCode(query, owner, repo) {
  try {
    const response = await octokit.rest.search.code({
      q: `${query} repo:${owner}/${repo}`,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const results = response.data.items
    // Return a list of path from the results
    return results.map(result => result.path)
  } catch (error) {
    console.log(error)
    return []
  }
}

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

export async function getAllReferences(
  owner,
  repo,
  list_of_queries,
  file_paths_to_ignore
) {
  const results = []
  for (const query of list_of_queries) {
    console.log('Searching for: ', query)
    const references = await searchCode(query, owner, repo)
    if (references.length === 0) {
      console.log(`No references found for ${query}`)
      continue
    }
    console.log(`References found for ${query}: `, references)

    const files_to_ignore = await get_ignore_list(owner, repo, '.reveiwignore')

    const filtered_references = references.filter(
      reference =>
        !files_to_ignore.includes(reference) &&
        !file_paths_to_ignore.includes(reference)
    )

    for (const reference of filtered_references) {
      console.log('Getting content for: ', reference)
      const content = await getFileContent(owner, repo, reference)
      // Check if content already exists in results
      const content_exists = results.some(result => result.content === content)
      if (content_exists) continue

      results.push({
        path: reference,
        content
      })
    }
  }
  return results
}
