import { Octokit as OctokitRest } from '@octokit/rest'

const { shouldIgnoreFile } = require('./helper')
const core = require('@actions/core')

const octokit = new OctokitRest({
  auth: core.getInput('github-token')
})

async function getDiffString(owner, repo, pull_number) {
  console.log('Getting diff for: ', owner, repo, pull_number)

  const response = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number,
    mediaType: {
      format: 'diff'
    }
  })
  return response.data
}

function parseDiff(diffString, files_to_ignore) {
  const fileDiffRegex = /^diff --git a\/(.+?) b\/\1\nindex/gm
  let match
  const changes = []

  while ((match = fileDiffRegex.exec(diffString)) !== null) {
    const filename = match[1] // Extract filename directly from the regex match

    if (shouldIgnoreFile(filename, files_to_ignore)) {
      console.log(`Ignoring file: ${filename}`)
      continue
    }

    const start = match.index
    const end = diffString.indexOf('diff --git', start + 1)
    const fileDiff = diffString.substring(start, end > -1 ? end : undefined)

    const lines = fileDiff.split('\n')
    let codeBeforeChange = ''
    let codeAfterChange = ''
    let inChangeBlock = false

    for (const line of lines) {
      if (
        line.startsWith('--- a/') ||
        line.startsWith('+++ b/') ||
        line.startsWith('@@')
      ) {
        inChangeBlock = true
      } else if (inChangeBlock) {
        if (line.startsWith('-')) {
          codeBeforeChange += `${line.slice(1)}\n`
        } else if (line.startsWith('+')) {
          codeAfterChange += `${line.slice(1)}\n`
        } else {
          codeBeforeChange += `${line}\n`
          codeAfterChange += `${line}\n`
        }
      }
    }

    changes.push({
      filename,
      code_before_change: codeBeforeChange,
      code_after_change: codeAfterChange
    })
  }

  return changes
}

export async function parsePR(pullRequest, file_paths_to_ignore) {
  const owner = pullRequest.base.repo.owner.login
  const repo = pullRequest.base.repo.name
  const pull_number = pullRequest.number
  const diffString = await getDiffString(owner, repo, pull_number)
  const changes = parseDiff(diffString, file_paths_to_ignore)
  return {
    title: pullRequest.title,
    body: pullRequest.body,
    changes
  }
}
