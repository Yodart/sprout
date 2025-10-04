const path = require('path');
const { execSync } = require('child_process');
const colors = require('../../lib/colors');
const { getRepoRoot } = require('../../lib/git-utils');
const { getWorktreesDir, getWorktrees } = require('../../lib/worktree-utils');
const { selectWorktree, hasCommand } = require('../../lib/interactive');

async function code() {
  try {
    const repoRoot = getRepoRoot();
    const repoName = path.basename(repoRoot);
    const worktreesDir = getWorktreesDir(repoName);
    const worktrees = getWorktrees(worktreesDir);

    if (worktrees.length === 0) {
      console.log(`${colors.yellow('⚠ No pool at')} ${colors.bold(worktreesDir)}`);
      return;
    }

    console.log(`${colors.bold(colors.blue('🧭 Pick a worktree to open in VS Code'))}`);
    console.log(`   ${colors.bold('Repo:')} ${repoRoot}`);
    console.log(`   ${colors.bold('Pool:')} ${worktreesDir}`);

    const choice = await selectWorktree(worktrees, 'Select worktree to open in VS Code:');
    if (!choice) {
      console.log(`${colors.yellow('⚠ No selection')}`);
      return;
    }

    if (!hasCommand('code')) {
      console.log(`${colors.red('❌ \'code\' command not found')}`);
      console.log(`Open VS Code and run: ${colors.bold('Shell Command: Install \'code\' command in PATH')}`);
      return;
    }

    console.log(`${colors.blue('🚀 Launching VS Code:')} ${colors.bold(choice)}`);
    execSync(`code "${choice}"`);
    console.log(`${colors.green('✔ Opened in VS Code')}`);

  } catch (error) {
    console.error(`${colors.red('❌ Error:')} ${error.message}`);
    process.exit(1);
  }
}

module.exports = code;