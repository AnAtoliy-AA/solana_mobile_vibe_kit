# Claude Code Configuration

This directory contains configuration for Claude Code.

## Structure

- `commands/` - Custom slash commands for this project
- `.claudeignore` - Files and directories to exclude from Claude's context

## Available Commands

- `/review` - Review code changes for quality, security, and best practices
- `/explain` - Explain the project architecture and structure

## Adding Custom Commands

Create a new `.md` file in the `commands/` directory. The filename becomes the command name.
For example, `commands/test.md` creates the `/test` command.
