const path = require('path');
const colors = require('../../lib/colors');
const { getRepoRoot, removeWorktree } = require('../../lib/git-utils');
const { getWorktreesDir, getWorktrees, removeDirectory, isEmptyDirectory } = require('../../lib/worktree-utils');
const { selectWorktree, confirmAction } = require('../../lib/interactive');

async function close() {
  try {
    const repoRoot = getRepoRoot();
    const repoName = path.basename(repoRoot);
    const worktreesDir = getWorktreesDir(repoName);
    const worktrees = getWorktrees(worktreesDir);

    if (worktrees.length === 0) {
      console.log(`${colors.yellow('⚠ No worktrees to close')}`);
      return;
    }

    console.log(`${colors.bold(colors.yellow('🌪 Pick a worktree to remove'))}`);
    console.log(`   ${colors.bold('Repo:')} ${repoRoot}`);
    console.log(`   ${colors.bold('Pool:')} ${worktreesDir}`);

    const choice = await selectWorktree(worktrees, 'Select worktree to remove:');
    if (!choice) {
      console.log(`${colors.yellow('⚠ No selection')}`);
      return;
    }

    const name = path.basename(choice);
    console.log(`${colors.yellow('⚠ About to remove worktree:')} ${colors.bold(name)} (${choice})`);

    const confirmed = await confirmAction('Proceed?');
    if (!confirmed) {
      console.log(`${colors.red('✖ Aborted')}`);
      return;
    }

    console.log(`   ${colors.yellow('→ Removing worktree:')} ${name}`);
    removeWorktree(choice);
    removeDirectory(choice);
    console.log(`   ${colors.green('✔ Removed')} ${name}`);

    if (isEmptyDirectory(worktreesDir)) {
      console.log(`${colors.green('✔ Pool is now empty:')} ${worktreesDir}`);
    }

  } catch (error) {
    console.error(`${colors.red('❌ Error:')} ${error.message}`);
    process.exit(1);
  }
}

module.exports = close;