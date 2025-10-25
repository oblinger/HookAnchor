# HookAnchor User Guide

HookAnchor is a powerful command launcher for macOS that provides instant access to applications, files, URLs, and custom commands through a keyboard-driven popup interface.

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Basic Usage](#basic-usage)
4. [Key Features](#key-features)
5. [Command Types](#command-types)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Creating Commands](#creating-commands)
8. [Tips and Tricks](#tips-and-tricks) 
9. [Troubleshooting](#troubleshooting)

## Installation

### Requirements

- macOS 11.0 or later
- A keyboard trigger method (see Setup Keyboard Trigger below)

### Installation Steps

1. **Download HookAnchor**
   - Download the latest `HookAnchor-{version}.dmg` from [releases](https://github.com/oblinger/hookanchor/releases)
   
2. **Install the Application**
   - Open the DMG file
   - Drag HookAnchor.app to your Applications folder
   
3. **First Launch**
   - Open HookAnchor from Applications
   - The app will create configuration files in `~/.config/hookanchor/`
   
4. **Setup Keyboard Trigger** (choose one method below)

## Setting Up Keyboard Triggers

You can trigger HookAnchor using any of these methods:

### Option 1: macOS Native Keyboard Shortcuts (Simplest)

Use macOS's built-in keyboard shortcut system:

1. **Open System Settings** → **Keyboard** → **Keyboard Shortcuts**
2. Select **App Shortcuts** in the left sidebar
3. Click the **+** button to add a new shortcut
4. Configure as follows:
   - **Application**: Select "HookAnchor" (navigate to /Applications)
   - **Menu Title**: Leave blank or type "Show"
   - **Keyboard Shortcut**: Press your desired key combo (e.g., ⌥Space for Option+Space)
5. Click **Add**

**Recommended shortcuts:**
- **⌥Space** (Option+Space) - Easy to reach, rarely conflicts
- **⌃Space** (Control+Space) - If not used by Spotlight
- **⌘⇧Space** (Command+Shift+Space) - Alternative option

### Option 2: Keyboard Maestro (Power Users)

If you use Keyboard Maestro:

1. Create a new macro
2. Set trigger to your desired key (e.g., Caps Lock, F13, or any combo)
3. Add action: **Open a File, Folder or Application**
4. Select: `/Applications/HookAnchor.app`
5. Enable "Reopen" option for instant triggering

### Option 3: Karabiner-Elements (Caps Lock)

For using Caps Lock as trigger:

1. Download [Karabiner-Elements](https://karabiner-elements.pqrs.org/)
2. Install and grant permissions
3. Add this rule to use Caps Lock:
   ```json
   {
     "description": "Caps Lock opens HookAnchor",
     "manipulators": [{
       "type": "basic",
       "from": { "key_code": "caps_lock" },
       "to": [{ "shell_command": "open /Applications/HookAnchor.app" }]
     }]
   }
   ```

### Option 4: Other Automation Tools

HookAnchor works with any tool that can launch applications:
- **BetterTouchTool**: Assign to gestures or keys
- **Alfred**: Create a workflow to launch HookAnchor
- **Raycast**: Add as a script command
- **Hammerspoon**: Configure in Lua script

## Getting Started

### Triggering HookAnchor

Once you've set up your keyboard trigger, press your chosen key combination to open the HookAnchor popup. The popup displays a searchable list of all your commands.

### Basic Navigation

- **Type to search** - Start typing to filter commands
- **Arrow keys** - Navigate through commands
- **Enter** - Execute selected command
- **Escape** - Close the popup

## Basic Usage

### Searching Commands

1. Press Caps Lock to open HookAnchor
2. Start typing part of a command name
3. Matching commands appear instantly
4. Use arrow keys to select
5. Press Enter to execute

### Command Organization

Commands are organized into **patches** (groups). When you see a command like:
```
Work > Project Setup
```
This means "Project Setup" is in the "Work" patch.

### Submenus

Similar commands are automatically grouped into submenus. For example:
```
Git >
```
Pressing Enter on this opens a submenu with all Git-related commands.

## Key Features

### 1. Universal Command Launcher

Launch anything from one place:
- Applications
- Websites
- Folders
- Shell commands
- Custom scripts

### 2. Smart Search

- **Fuzzy matching** - Type "prj" to find "Project"
- **Case insensitive** - "TERMINAL" matches "Terminal"
- **Partial matching** - "doc" matches "Documents"

### 3. Markdown Integration

HookAnchor scans configured folders for markdown files and creates commands from:
- Anchor files (markdown files matching folder names)
- Code blocks in markdown
- Links in markdown files

### 4. URL Scheme Support

Use `hook://` URLs from anywhere:
```bash
open "hook://terminal"    # Opens Terminal
open "hook://slack"       # Opens Slack
```

### 5. Context Grabber

Capture context from any application:
1. Press `+` in the popup
2. Enter a name for the command
3. Wait for countdown
4. Click on any window/application
5. HookAnchor creates a command for it

## Command Types

### Applications (`app`)
Launch macOS applications:
```
Terminal : app Terminal
Chrome : app Google Chrome
```

### URLs (`url`)
Open websites in your default browser:
```
GitHub : url https://github.com
Google : url https://google.com
```

### Folders (`folder`)
Open folders in Finder:
```
Downloads : folder ~/Downloads
Projects : folder ~/Documents/Projects
```

### Shell Commands (`cmd`)
Execute shell commands:
```
List Files : cmd ls -la
Server : cmd npm run dev
```

### Anchors (`anchor`)
Navigate to project folders with associated markdown files:
```
My Project : anchor ~/Projects/MyProject/MyProject.md
```

### Aliases (`alias`)
Reference other commands:
```
Term : alias Terminal
GH : alias GitHub
```

## Keyboard Shortcuts

### In the Popup

| Key | Action |
|-----|--------|
| **Escape** | Close popup |
| **Enter** | Execute command |
| **Arrow Keys** | Navigate commands |
| **/** | Open folder of selected command |
| **=** | Open command editor |
| **;** | Edit selected command |
| **`** | Force rescan |
| **?** | Show keyboard help |
| **Delete** | Remove command |

### Templates

| Key | Template | Description |
|-----|----------|-------------|
| **%** | Default | Create new anchor |
| **$** | Note | Create dated note |
| **+** | Grab | Capture application |
| **>** | Alias | Create alias |

## Creating Commands

### Method 1: Using Templates

1. Open HookAnchor (Caps Lock)
2. Press a template key (e.g., `%` for anchor)
3. Enter the command name
4. Edit details if needed
5. Save the command

### Method 2: Using the Grabber

1. Open HookAnchor
2. Press `+`
3. Enter a name
4. Wait for countdown
5. Click the target window
6. Command is created automatically

### Method 3: Markdown Files

Create commands in markdown files within your configured `markdown_roots`:

```markdown
# My Commands

Terminal : cmd open -a Terminal
Chrome : app Google Chrome
GitHub : url https://github.com
```

### Method 4: Direct Configuration

Edit `~/.config/hookanchor/config.yaml` to add custom functions and templates.

## Tips and Tricks

### Quick Access Patterns

1. **Two-letter shortcuts**: Name frequently used commands with 2-3 letters
   - `gh` → GitHub
   - `tm` → Terminal
   - `sl` → Slack

2. **Patch prefixes**: Use consistent prefixes for groups
   - `dev-server` → Development server
   - `dev-build` → Development build
   - `dev-test` → Development tests

3. **Smart naming**: Use descriptive but searchable names
   - Instead of: "Open"
   - Use: "Open Project Folder"

### Advanced Search

- **Patch search**: Type patch name to see all commands in that group
- **Action filter**: Type action name (app, url, cmd) to filter by type
- **Recent filter**: Recently used commands appear first

### Workflow Integration

1. **Project Anchors**: Create anchor commands for each project
   - Automatically opens folder
   - Can launch associated tools
   - Integrates with tmux if configured

2. **URL Shortcuts**: Create shortcuts for frequently visited sites
   - Work sites with work browser
   - Personal sites with personal browser

3. **Script Launchers**: Turn complex scripts into simple commands
   - Build processes
   - Deployment scripts
   - Testing suites

## Troubleshooting

### Popup Doesn't Appear

1. Verify your keyboard trigger is properly configured:
   - **macOS Shortcuts**: Check System Settings → Keyboard → Keyboard Shortcuts → App Shortcuts
   - **Keyboard Maestro**: Ensure macro is enabled and trigger is set
   - **Karabiner**: Check Karabiner-Elements is running and rule is active
   
2. Test launching manually:
   ```bash
   open /Applications/HookAnchor.app
   ```
   
3. Check HookAnchor process is running:
   ```bash
   ps aux | grep HookAnchor
   ```
   
4. Check logs for errors:
   ```bash
   tail -f ~/.config/hookanchor/anchor.log
   ```

### Commands Not Found

1. Check markdown_roots configuration
2. Force rescan with `` ` `` key
3. Verify file permissions
4. Check scanner is finding files:
   ```bash
   ha --rescan
   ```

### URL Handling Issues

- HookAnchor uses a separate URLHandler app for stability
- Check URL handler registration:
  ```bash
  /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -dump | grep hook:
  ```
- Should show `com.hookanchor.urlhandler`

### Performance Issues

1. Reduce `max_rows` in configuration
2. Disable `merge_similar` if not needed
3. Increase `scan_interval_seconds`
4. Check log file size (auto-rotates at 10MB)

### Reset Configuration

To start fresh:
```bash
# Backup current config
cp ~/.config/hookanchor/config.yaml ~/.config/hookanchor/config.backup.yaml

# Remove config (will regenerate defaults)
rm ~/.config/hookanchor/config.yaml

# Restart HookAnchor
```

## Getting Help

- **Configuration**: See [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)
- **Templates**: See [TEMPLATES_AND_SCRIPTING.md](TEMPLATES_AND_SCRIPTING.md)
- **Issues**: Report at https://github.com/oblinger/hookanchor/issues
- **Logs**: Check `~/.config/hookanchor/anchor.log` for debugging

## Quick Command Reference

| Want to... | Command Type | Example |
|------------|--------------|---------|
| Open an app | `app` | `Terminal : app Terminal` |
| Open a website | `url` | `GitHub : url https://github.com` |
| Open a folder | `folder` | `Downloads : folder ~/Downloads` |
| Run a shell command | `cmd` | `List : cmd ls -la` |
| Create a project bookmark | `anchor` | `Project : anchor ~/Project/Project.md` |
| Create a shortcut | `alias` | `GH : alias GitHub` |