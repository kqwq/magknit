const fs = require('fs')
const path = require('path')
const process = require('process')


const [, , cmd, ...args] = process.argv

function showHelp() {
  console.log('Usage: magknit <command>')
  console.log('Commands:')
  console.log('  init                Initialize a new magknit project')
  console.log('  switch <branch>     Switch to the specified branch')
}

function makeFileRecursive(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8')
  }
  return filePath
}

function initProject() {
  if (fs.existsSync(`.magknit`)) {
    console.log('Project already initialized.')
    return
  }
  fs.mkdirSync('.magknit', { recursive: true })
  fs.writeFileSync(`.magknit/config.json`, JSON.stringify({ branches: ['main'], current: 'main' }, null, 2))
  fs.writeFileSync('.magknit_ignore', '# Top-level files and directories to ignore\nnode_modules/\ndist/\n')
  console.log('Magknit project initialized.')
}

function switchBranch(branch) {
  const configPath = path.join(process.cwd(), '.magknit/config.json')
  if (!fs.existsSync(configPath)) {
    console.log('No magknit project found. Run "magknit init" first.')
    return
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  if (!config.branches.includes(branch)) {
    config.branches.push(branch)
  }
  const lastBranch = config.current
  if (branch === lastBranch) {
    console.log(`Already on branch "${branch}".`)
    return
  }
  config.current = branch
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

  // Save all files in current directory (excluding hidden files and files in .magknit_ignore) to .magknit/branches/<branch>/*
  let ignoreFiles = []
  if (fs.existsSync('.magknit_ignore')) {
    ignoreFiles = fs.readFileSync('.magknit_ignore', 'utf8').split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'))
  }
  const files = fs.readdirSync(process.cwd()).filter(file => !file.startsWith('.') && !ignoreFiles.includes(file))
  files.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (fs.lstatSync(filePath).isFile()) {
      const destPath = makeFileRecursive(path.join('.magknit', 'branches', lastBranch, file))
      fs.copyFileSync(filePath, destPath)
    }
  })

  // If the branch you are switch to exists, copy files from that branch
  const branchPath = path.join('.magknit', 'branches', branch)
  if (fs.existsSync(branchPath)) {
    const branchFiles = fs.readdirSync(branchPath)
    branchFiles.forEach(file => {
      const srcPath = path.join(branchPath, file)
      const destPath = makeFileRecursive(path.join(process.cwd(), file))
      fs.copyFileSync(srcPath, destPath)
    })
  }

  console.log(`Switched to branch "${branch}".`)
}

if (cmd === 'init') {
  initProject()
} else if (cmd === 'switch' && args[0]) {
  switchBranch(args[0])
} else {
  showHelp()
}