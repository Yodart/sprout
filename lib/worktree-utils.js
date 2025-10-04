const fs = require('fs');
const path = require('path');
const os = require('os');

function getWorktreesDir(repoName) {
  return path.join(os.homedir(), '.sprout', repoName);
}

function getWorktrees(worktreesDir) {
  if (!fs.existsSync(worktreesDir)) {
    return [];
  }

  try {
    return fs.readdirSync(worktreesDir)
      .map(name => path.join(worktreesDir, name))
      .filter(dir => fs.statSync(dir).isDirectory())
      .sort();
  } catch {
    return [];
  }
}

function ensureWorktreesDir(worktreesDir) {
  if (!fs.existsSync(worktreesDir)) {
    fs.mkdirSync(worktreesDir, { recursive: true });
  }
}

function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function isEmptyDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    return files.length === 0;
  } catch {
    return true;
  }
}

module.exports = {
  getWorktreesDir,
  getWorktrees,
  ensureWorktreesDir,
  removeDirectory,
  isEmptyDirectory
};