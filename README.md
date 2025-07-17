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
  - Defaults to branch "main"

- `magknit switch <branch>` - Switch to a different branch
  - Saves current files to `.magknit/branches/<current-branch>/`
  - Only saves top-level files (respects `.magknit_ignore`)
  - Copies files from `.magknit/branches/<branch>/` to the current directory

## How it works

Magknit stores your project states in `.magknit/branches/` directories.

## Limitations

- Only handles top-level files (no subdirectories yet)
- No other commands than the ones listed above

**WARNING: This was vibe-coded in about an hour. LET THAT SCARE YOU.**