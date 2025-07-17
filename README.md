# magknit

A simple yet buggy version control CLI for your project.

## Installation

```bash
npm install -g magknit
```

Or run locally:
```bash
npm install
node index.js <command>
```

## Commands

- `magknit help` - Show available commands

- `magknit init` - Initialize a new magknit project
  - Creates `.magknit/` directory with config
  - Creates `.magknit_ignore` file (like `.gitignore`)

- `magknit switch <branch>` - Switch to a different branch
  - Saves current files to `.magknit/branches/<current-branch>/`
  - Only saves top-level files (respects `.magknit_ignore`)
  - Copies files from `.magknit/branches/<branch>/` to the current directory

## How it works

Magknit stores your project states in `.magknit/branches/` directories. When you switch branches, it:
1. Saves your current files to the current branch folder
2. Switches the active branch in the config
3. You manually restore files from the new branch as needed

## Limitations

- Only handles top-level files (no subdirectories yet)
- No other commands than the ones listed above

**WARNING: This was vibe-coded in about an hour. LET THAT SCARE YOU.**