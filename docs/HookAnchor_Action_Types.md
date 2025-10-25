# HookAnchor Action Types Reference

## Overview
Actions in HookAnchor define behaviors that can be triggered via keyboard shortcuts, commands, or other actions. Each action has a type that determines its behavior.

## Action Types Summary

### Command Actions
These actions are designed to be used as the action type for commands in your commands.txt file.

| Action Type | Description | Grab? | Primary Arguments |
|------------|-------------|-------|------------------|
| [open_url](#open_url) | Opens URLs in default browser | No | url |
| [open_app](#open_app) | Opens/activates applications | No | app, arg |
| [open_folder](#open_folder) | Opens folders in Finder | No | folder |
| [open_file](#open_file) | Opens files in default app | No | file |
| [shell](#shell) | Executes shell commands | No | command, wait |
| [obsidian](#obsidian) | Opens files in Obsidian | No | file, line |
| [alias](#alias) | Executes another command | No | command |
| [1pass](#1pass) | 1Password Quick Access | No | query |
| [slack](#slack) | Navigates to Slack channels | No | channel |
| [text](#text) | Types text via keyboard | No | text |
| [cmd](#cmd) | JavaScript shell commands | No | JS expression |
| [contact](#contact) | Opens contacts | No | query |
| [doc](#doc) | Opens documentation | No | arg |
| [folder](#folder) | Folder operations | No | path |
| [js](#js) | JavaScript evaluation | No | code |
| [markdown](#markdown) | Markdown file operations | No | file |

### Control Actions
These actions control HookAnchor itself and are typically bound to keyboard shortcuts.

| Action Type | Description | Grab? | Primary Arguments |
|------------|-------------|-------|------------------|
| [template](#template) | Creates new commands with templates | Yes | name, action, arg, patch |
| [popup](#popup) | Controls the popup window | No | popup_action |
| [rescan](#rescan) | Rescans command database | No | - |

---

## template
Creates new commands from templates with variable substitution.

**Arguments:**
- `name` - Command name (supports {{input}} substitution)
- `action` - Action type for the new command
- `arg` - Argument for the action (supports {{input}})
- `patch` - Optional patch text to prepend
- `flags` - Optional flags
- `grab` - Grabber timeout in seconds
- `edit` - Edit timeout in seconds
- `contents` - File contents if creating a file

**Example:**
```yaml
doc_page:
  action_type: template
  name: "Doc{{input}}"
  action: "doc"
  arg: "~/Documents/Notes/T/DOC/Doc{{input}}.md"
  patch: "DOC"
```

---

## popup
Controls the popup window state.

**Arguments:**
- `popup_action` - Action to perform: "show", "hide", "toggle"

**Example:**
```yaml
show_popup:
  action_type: popup
  popup_action: "show"
```

---

## open_url
Opens URLs in the default web browser.

**Arguments:**
- `url` - URL to open (required)

**Example:**
```yaml
github:
  action_type: open_url
  url: "https://github.com"
```

---

## open_app
Opens or activates an application, optionally with arguments.

**Arguments:**
- `app` - Application name or path (required)
- `arg` - Optional argument to pass to the app

**Example:**
```yaml
vscode:
  action_type: open_app
  app: "Visual Studio Code"
  arg: "~/projects"
```

---

## open_folder
Opens a folder in Finder.

**Arguments:**
- `folder` - Folder path to open (required)

**Example:**
```yaml
downloads:
  action_type: open_folder
  folder: "~/Downloads"
```

---

## open_file
Opens a file in its default application.

**Arguments:**
- `file` - File path to open (required)

**Example:**
```yaml
readme:
  action_type: open_file
  file: "~/projects/README.md"
```

---

## shell
Executes shell commands with optional waiting.

**Arguments:**
- `command` - Shell command to execute (required)
- `wait` - Whether to wait for completion (optional, default: false)

**Example:**
```yaml
rebuild:
  action_type: shell
  command: "cargo build --release"
  wait: true
```

---

## obsidian
Opens files in Obsidian vault, with optional line navigation.

**Arguments:**
- `file` - File path to open (required)
- `line` - Optional line number to navigate to

**Example:**
```yaml
notes:
  action_type: obsidian
  file: "~/Documents/Notes/notes.md"
  line: 42
```

---

## alias
Executes another existing command by name.

**Arguments:**
- `command` - Name of command to execute (required)

**Example:**
```yaml
g:
  action_type: alias
  command: "github"
```

---

## JavaScript Actions

The following action types are implemented in JavaScript via the config file:

### 1pass
Opens 1Password Quick Access with a search query.

**Arguments:**
- `query` - Search query for 1Password (required)

---

### slack
Navigates to a specific Slack channel.

**Arguments:**
- `channel` - Channel name to navigate to (required)

---

### text
Types text via keyboard simulation.

**Arguments:**
- `text` - Text to type (required)

---

### cmd
Executes JavaScript expressions that can run shell commands.

**Arguments:**
- JavaScript expression as the action body

---

### contact
Opens contact information.

**Arguments:**
- `query` - Contact search query (required)

---

### doc
Opens documentation files.

**Arguments:**
- `arg` - Documentation file path (required)

---

### folder
Performs folder-related operations.

**Arguments:**
- `path` - Folder path (required)

---

### js
Evaluates JavaScript code.

**Arguments:**
- `code` - JavaScript code to evaluate (required)

---

### markdown
Operations on markdown files.

**Arguments:**
- `file` - Markdown file path (required)

---

### rescan
Rescans the command database for changes.

**Arguments:**
- None

---

## Grabber Support

Actions that support grabbers can capture context from the current application when invoked with the grab modifier (typically 'g'). The grabbed context is used to create commands that can recreate the current state.

Currently, the `template` action type has full grabber support, allowing it to capture application context and create commands based on grabber rules defined in the configuration.

## Command Usage

Most action types can be used as command actions, meaning they can be assigned to commands in the commands.txt file or created dynamically. Actions marked as "Can Use as Command: No" are typically system actions that control the HookAnchor interface itself.

## Configuration Example

```yaml
actions:
  # Template action bound to Cmd+D
  doc_page:
    action_type: template
    key: "Cmd+D"
    description: "Create documentation page"
    name: "Doc{{input}}"
    action: "doc"
    arg: "~/Documents/Notes/T/DOC/Doc{{input}}.md"
    
  # Simple URL opener
  github:
    action_type: open_url
    key: "Cmd+G"
    url: "https://github.com"
    
  # TMUX session creator
  new_session:
    action_type: tmux_create
    key: "Cmd+T"
    folder: "{{current_folder}}"
    command: "claude --continue"
```