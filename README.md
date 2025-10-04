# Sprout

A tiny worktree CLI for managing git worktrees efficiently.

## Installation

### From npm registry
```bash
npm install -g @yodart/sproutkit
```

### From GitHub Packages
```bash
npm config set @yodart:registry https://npm.pkg.github.com
npm install -g @yodart/sproutkit
```

## Tech Stack

- **Node.js** - Runtime environment
- **Chalk** - Terminal string styling
- **Inquirer** - Interactive command line prompts
- **Git** - Worktree management

## Commands

### `sprout spawn` (default)

Create a new worktree via interactive prompts.

```bash
sprout spawn
sprout  # same as spawn
```

### `sprout prune`

Remove all worktrees under `~/.sprout/<repo>/`

```bash
sprout prune     # with confirmation prompt
sprout prune -f  # force removal without confirmation
```

**Flags:**

- `-f` - Force removal without confirmation prompt

### `sprout code`

Pick a worktree and open it in VS Code.

```bash
sprout code
```

### `sprout open`

Pick a worktree and cd into it.

```bash
sprout open
```

### `sprout close`

Pick a worktree and remove it (single worktree removal).

```bash
sprout close
```

### `sprout help`

Show usage information.

```bash
sprout help
sprout -h
sprout --help
```

## Usage

Navigate to any git repository and run:

```bash
sprout spawn
```

This will:

1. Prompt you for a branch name
2. Prompt you for a folder name (defaults to branch name)
3. Create a new worktree in `~/.sprout/<repo-name>/<folder-name>`
4. Copy dotfiles from the main repository
5. Change directory to the new worktree

## Features

- **Interactive prompts** - Easy worktree creation with guided input
- **Automatic dotfile copying** - Copies all dotfiles from main repo to worktree
- **Clean organization** - All worktrees stored under `~/.sprout/<repo-name>/`
- **VS Code integration** - Direct VS Code opening support
- **Batch operations** - Remove all worktrees at once with `prune`
- **Cross-platform** - Works on macOS, Linux, and Windows

## Directory Structure

```
~/.sprout/
└── <repo-name>/
    ├── <worktree-1>/
    ├── <worktree-2>/
    └── <worktree-3>/
```

## Requirements

- **Node.js** >= 14.0.0
- **Git** with worktree support (Git 2.5+)
- **VS Code** (optional, for `sprout code` command)

## Examples

```bash
# Create a new feature worktree
sprout spawn
# Enter: "feature/new-login"
# Enter: "login-feature" (or press enter for default)

# Open existing worktree in VS Code
sprout code

# Remove all worktrees for current repo
sprout prune

# Remove single worktree
sprout close
```
