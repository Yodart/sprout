const path = require('path');
const colors = require('../../lib/colors');
const { getRepoRoot, removeWorktree } = require('../../lib/git-utils');
const { getWorktreesDir, getWorktrees, removeDirectory, isEmptyDirectory } = require('../../lib/worktree-utils');
const { confirmAction } = require('../../lib/interactive');

async function prune(options = {}) {
  try {
    const repoRoot = getRepoRoot();
    const repoName = path.basename(repoRoot);
    const worktreesDir = getWorktreesDir(repoName);
    const worktrees = getWorktrees(worktreesDir);

    if (worktrees.length === 0) {
      console.log(`${colors.yellow('⚠ No pool at')} ${colors.bold(worktreesDir)}`);
      return;
    }

    if (!options.force) {
      const confirmed = await confirmAction(
        `⚠ This will remove ALL worktrees under ${colors.bold(worktreesDir)}. Proceed?`
      );
      if (!confirmed) {
        console.log(`${colors.red('✖ Aborted')}`);
        return;
      }
    }

    console.log(`${colors.bold(colors.yellow('🌪 Pruning worktrees in:'))} ${worktreesDir}`);

    let removedAny = false;
    for (const wt of worktrees) {
      const name = path.basename(wt);
      console.log(`   ${colors.yellow('→ Removing worktree:')} ${name}`);

      removeWorktree(wt);
      removeDirectory(wt);

      console.log(`   ${colors.green('✔ Removed')} ${name}`);
      removedAny = true;
    }

    if (isEmptyDirectory(worktreesDir)) {
      console.log(`${colors.green('✔ Pool is now empty:')} ${worktreesDir}`);
    }

    if (removedAny) {
      console.log(`${colors.bold(colors.green('✅ All worktrees cleared'))}`);
    } else {
      console.log(`${colors.yellow('⚠ No worktrees to remove')}`);
    }

  } catch (error) {
    console.error(`${colors.red('❌ Error:')} ${error.message}`);
    process.exit(1);
  }
}

module.exports = prune;