const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function getRepoRoot() {
  try {
    const gitCommon = execSync('git rev-parse --git-common-dir', { encoding: 'utf8' }).trim();
    let gitPath = gitCommon;

    if (!path.isAbsolute(gitPath)) {
      gitPath = path.resolve(process.cwd(), gitPath);
    }

    return path.dirname(gitPath);
  } catch (error) {
    throw new Error('Not inside a git repository');
  }
}

function branchExists(branch) {
  try {
    execSync(`git show-ref --quiet --verify "refs/heads/${branch}"`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function createWorktree(wtDir, branch, isNewBranch = false) {
  if (isNewBranch) {
    execSync(`git worktree add -b "${branch}" "${wtDir}" HEAD`);
  } else {
    execSync(`git worktree add -f "${wtDir}" "${branch}"`);
  }
}

function removeWorktree(wtDir) {
  try {
    execSync(`git worktree remove --force "${wtDir}"`, { stdio: 'pipe' });
  } catch {
    // Continue even if git worktree remove fails
  }
}

function getCurrentBranch(cwd) {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
      cwd
    }).trim();
  } catch {
    return null;
  }
}

function copyDotfiles(repoRoot, targetDir) {
  const copied = [];

  try {
    const files = fs.readdirSync(repoRoot);

    for (const file of files) {
      if (file.startsWith('.') && file !== '.' && file !== '..') {
        const srcPath = path.join(repoRoot, file);
        const destPath = path.join(targetDir, file);

        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
          copied.push(file);
        }
      }
    }
  } catch (error) {
    // Continue even if copying fails
  }

  return copied;
}

module.exports = {
  getRepoRoot,
  branchExists,
  createWorktree,
  removeWorktree,
  getCurrentBranch,
  copyDotfiles
};