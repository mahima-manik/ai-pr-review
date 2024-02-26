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
    const raw_diff_string = await this.pull_request.getDiffString()
    const files_to_ignore = await this.getIgnoreList()
    const diff_lines = raw_diff_string.split('\n')
    // Remove the file and its diff from raw_diff_string if it is in files_to_ignore
    let current_file = ''
    let current_diff = []
    this.fomatted_changes = []

    for (const line of diff_lines) {
      if (line.startsWith('diff --git')) {
        if (
          current_file !== '' &&
          !this.shouldIgnoreFile(current_file, files_to_ignore)
        ) {
          this.fomatted_changes.push({
            filename: current_file,
            diff: current_diff
          })
        }
        current_file = line.split(' b/')[1]
        current_diff = []
      }
      current_diff.push(line)
    }
    // Add the last file
    if (
      current_file !== '' &&
      !this.shouldIgnoreFile(current_file, files_to_ignore)
    ) {
      this.fomatted_changes.push({
        filename: current_file,
        diff: current_diff
      })
    }
    return this.fomatted_changes
  }
}

module.exports = { AIReviewer }
