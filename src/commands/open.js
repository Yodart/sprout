const path = require('path');
const colors = require('../../lib/colors');
const { getRepoRoot, getCurrentBranch } = require('../../lib/git-utils');
const { getWorktreesDir, getWorktrees } = require('../../lib/worktree-utils');
const { selectWorktree } = require('../../lib/interactive');

async function open() {
  try {
    const repoRoot = getRepoRoot();
    const repoName = path.basename(repoRoot);
    const worktreesDir = getWorktreesDir(repoName);
    const worktrees = getWorktrees(worktreesDir);

    if (worktrees.length === 0) {
      console.log(`${colors.yellow('⚠ No worktrees to enter')}`);
      return;
    }

    console.log(`${colors.bold(colors.blue('🧭 Pick a worktree to cd into'))}`);
    console.log(`   ${colors.bold('Repo:')} ${repoRoot}`);
    console.log(`   ${colors.bold('Pool:')} ${worktreesDir}`);

    const choice = await selectWorktree(worktrees, 'Select worktree to enter:');
    if (!choice) {
      console.log(`${colors.yellow('⚠ No selection')}`);
      return;
    }

    console.log(`${colors.blue('📂 Switching directory:')} ${colors.bold(choice)}`);
    process.chdir(choice);

    const branch = getCurrentBranch(choice);
    if (branch) {
      console.log(`${colors.green('✔ Now on branch:')} ${colors.bold(branch)}`);
    }

    console.log(process.cwd());

  } catch (error) {
    console.error(`${colors.red('❌ Error:')} ${error.message}`);
    process.exit(1);
  }
}

module.exports = open;