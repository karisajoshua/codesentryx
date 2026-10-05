const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  const token = process.env.GITHUB_TOKEN
  const octokit = github.getOctokit(token)
  const { owner, repo } = github.context.repo
  const payload = github.context.payload
  const issue = payload.issue
  const comment = payload.comment
  const actor = payload.sender?.login
  const command = comment?.body?.trim().toLowerCase()

  if (!issue || issue.pull_request || !actor || !['/attempt', '/unassign'].includes(command)) return

  if (command === '/attempt') {
    const assignees = (issue.assignees || []).map((item) => item.login)
    if (assignees.length && !assignees.includes(actor)) {
      await octokit.rest.issues.createComment({
        owner, repo, issue_number: issue.number,
        body: `Thanks @${actor}. This issue is already assigned to @${assignees.join(', @')}. Please choose another open issue or check back if it becomes available.`,
      })
      return
    }

    if (!assignees.includes(actor)) {
      try {
        await octokit.rest.issues.addAssignees({ owner, repo, issue_number: issue.number, assignees: [actor] })
      } catch {
        await octokit.rest.issues.createComment({
          owner, repo, issue_number: issue.number,
          body: `Thanks @${actor}. GitHub could not automatically assign you, but your claim is recorded here. A maintainer can confirm the assignment.`,
        })
        return
      }
    }

    await octokit.rest.issues.createComment({
      owner, repo, issue_number: issue.number,
      body: `Assigned to @${actor}. Please keep the change focused, follow CONTRIBUTING.md, and open a pull request when ready.`,
    })
    return
  }

  const assignees = (issue.assignees || []).map((item) => item.login)
  if (!assignees.includes(actor)) {
    await octokit.rest.issues.createComment({
      owner, repo, issue_number: issue.number,
      body: `@${actor}, you are not currently assigned to this issue.`,
    })
    return
  }

  await octokit.rest.issues.removeAssignees({ owner, repo, issue_number: issue.number, assignees: [actor] })
  await octokit.rest.issues.createComment({
    owner, repo, issue_number: issue.number,
    body: `@${actor} released this issue. It is available for another contributor.`,
  })
}

run().catch((error) => core.setFailed(error.message))
