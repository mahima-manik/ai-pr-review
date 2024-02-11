class AIReviewer {
  constructor(pull_request) {
    this.pull_request = pull_request
    this.fomatted_changes = []
  }

  async getIgnoreList() {
    const content = await this.pull_request.getFileContent('.reviewignore')
    const files_to_ignore = content
      .split('\n')
      .filter(line => !line.startsWith('#') && line !== '')
    return files_to_ignore
  }

  shouldIgnoreFile(filename, files_to_ignore) {
    // Check if filename matches any pattern in files_to_ignore
    return files_to_ignore.some(pattern => {
      // Exact match for files or starts with match for directories
      return filename === pattern || filename.startsWith(`${pattern}`)
    })
  }

  async formatPrChanges() {
    const diffString = await this.pull_request.getDiffString()
    const files_to_ignore = await this.getIgnoreList()

    const fileDiffRegex = /^diff --git a\/(.+?) b\/\1\nindex/gm
    let match
    const changes = []

    while ((match = fileDiffRegex.exec(diffString)) !== null) {
      const filename = match[1] // Extract filename directly from the regex match

      if (this.shouldIgnoreFile(filename, files_to_ignore)) {
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
        before_change: codeBeforeChange,
        after_change: codeAfterChange
      })
    }
    this.fomatted_changes = changes
  }
}

module.exports = { AIReviewer }
