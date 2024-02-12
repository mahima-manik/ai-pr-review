# AI PR review
[![GitHub Super-Linter](https://github.com/actions/javascript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/javascript-action/actions/workflows/ci.yml/badge.svg)

This action is a GitHub Action that uses the AI to automatically review your pull request. You need to have OPENAI_API_KEY in your secrets to use this action.

### How to use? 🚀

- Obtain your OpenAI API key. You can get it from the OpenAI dashboard [here](https://platform.openai.com/api-keys)
- Add your OPENAI_API_KEY to your repository secrets. Go to your repository settings, then secrets, and add a new secret with the name `OPENAI_API_KEY` and the value of your OpenAI API key. Steps: [here](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)

- Add the action to your workflow. Create a `.github/workflows/ai-pr-review.yml` file in your repository with the following content:
  ```yaml
  name: AI PR Review
  
  on:
    pull_request:
      types: [opened, synchronize]
  
  permissions:
    contents: read
    pull-requests: write
    packages: read

  jobs:
    peer-review:
      runs-on: ubuntu-latest
      name: AI Peer review
      steps:
        - name: Checkout
          uses: actions/checkout@v4
        
        - name: AI Peer review
          id: ai-peer-review
          uses: ./
          with:
            github-token: ${{ secrets.GITHUB_TOKEN }}
            openai-key: ${{ secrets.OPENAI_KEY }}
  ```

### Note 🫡

This action is still in development. Please open an issue if you find any bugs or have any feature requests. You can also contribute to this project by opening a pull request.
