const inquirer = require('inquirer');
const { execSync } = require('child_process');

function hasCommand(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function selectWorktree(worktrees, message = 'Select a worktree:') {
  if (worktrees.length === 0) {
    return null;
  }

  const choices = worktrees.map(wt => ({
    name: `🌿 ${path.basename(wt)} (${wt})`,
    value: wt
  }));

  const { selected } = await inquirer.prompt([{
    type: 'list',
    name: 'selected',
    message,
    choices
  }]);

  return selected;
}

async function promptForBranch() {
  const { branch } = await inquirer.prompt([{
    type: 'input',
    name: 'branch',
    message: '👉 Enter branch name:',
    validate: input => input.trim() ? true : 'Branch name is required'
  }]);

  return branch.trim();
}

async function promptForFolder(defaultName) {
  const { folder } = await inquirer.prompt([{
    type: 'input',
    name: 'folder',
    message: `📂 Enter folder name (default: ${defaultName}):`,
    default: defaultName
  }]);

  return folder.trim() || defaultName;
}

async function confirmAction(message) {
  const { confirmed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmed',
    message,
    default: false
  }]);

  return confirmed;
}

module.exports = {
  hasCommand,
  selectWorktree,
  promptForBranch,
  promptForFolder,
  confirmAction
};