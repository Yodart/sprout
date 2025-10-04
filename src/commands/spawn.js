const path = require('path');
const colors = require('../../lib/colors');
const { getRepoRoot, branchExists, createWorktree, copyDotfiles } = require('../../lib/git-utils');
const { getWorktreesDir, ensureWorktreesDir } = require('../../lib/worktree-utils');
const { promptForBranch, promptForFolder } = require('../../lib/interactive');

async function spawn() {
  console.log(`${colors.bold(colors.blue('🌱 Create a new git worktree'))}`);

  try {
    const repoRoot = getRepoRoot();
    const repoName = path.basename(repoRoot);
    const worktreesDir = getWorktreesDir(repoName);
    ensureWorktreesDir(worktreesDir);

    const branch = await promptForBranch();
    const folder = await promptForFolder(branch);
    const wtDir = path.join(worktreesDir, folder);

    console.log(`${colors.blue('🔧 Setting up worktree in:')} ${colors.bold(wtDir)}`);

    const isNewBranch = !branchExists(branch);
    createWorktree(wtDir, branch, isNewBranch);

    console.log(`${colors.green('✔ Worktree created at:')} ${colors.bold(wtDir)} ${colors.green(`(branch: ${branch})`)}`);

    const copiedFiles = copyDotfiles(repoRoot, wtDir);
    if (copiedFiles.length > 0) {
      copiedFiles.forEach(file => {
        console.log(`   ${colors.green('→ Copied')} ${file}`);
      });
      console.log(`${colors.green('✔ Copied dotfiles into worktree')}`);
    } else {
      console.log(`${colors.yellow('⚠ No dotfiles found to copy')}`);
    }

    process.chdir(wtDir);
    console.log(`${colors.green('✔ Changed directory to:')} ${colors.bold(wtDir)}`);

  } catch (error) {
    console.error(`${colors.red('❌ Error:')} ${error.message}`);
    process.exit(1);
  }
}

module.exports = spawn;