const colors = require('../lib/colors');
const spawn = require('./commands/spawn');
const prune = require('./commands/prune');
const code = require('./commands/code');
const open = require('./commands/open');
const close = require('./commands/close');

function showUsage() {
  console.log(`${colors.bold('sprout')} - worktree helper`);
  console.log('');
  console.log(`  ${colors.bold('sprout spawn')}        Create a new worktree via prompts`);
  console.log(`  ${colors.bold('sprout prune [-f]')}  Remove all worktrees under ~/.sprout/<repo>/ (-f to skip confirm)`);
  console.log(`  ${colors.bold('sprout code')}         Pick a worktree and open it in VS Code`);
  console.log(`  ${colors.bold('sprout open')}         Pick a worktree and cd into it`);
  console.log(`  ${colors.bold('sprout close')}        Pick a worktree and remove it`);
}

async function run() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'spawn';
  const options = {};

  // Parse flags
  if (args.includes('-f')) {
    options.force = true;
  }

  try {
    switch (cmd) {
      case 'spawn':
      case '':
        await spawn();
        break;
      case 'prune':
        await prune(options);
        break;
      case 'code':
        await code();
        break;
      case 'open':
        await open();
        break;
      case 'close':
        await close();
        break;
      case '-h':
      case '--help':
      case 'help':
        showUsage();
        break;
      default:
        console.error(`${colors.red('Unknown subcommand:')} ${cmd}`);
        showUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red('❌ Error:')} ${error.message}`);
    process.exit(1);
  }
}

module.exports = { run, showUsage };