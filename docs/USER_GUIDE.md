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

3. **First Launch - Bypass Security Warning**
   Because HookAnchor is not signed with an Apple Developer certificate, macOS will block it on first launch.

   **If you get "Move to Trash" dialog:**
   a. Click **Cancel** (do NOT move to trash)
   b. Open **System Settings** → **Privacy & Security**
   c. Scroll down to the **Security** section
   d. You should see: *"HookAnchor.app was blocked from use because it is not from an identified developer"*
   e. Click **Open Anyway**
   f. In the confirmation dialog, click **Open**

   **Alternative method:**
   - Right-click `HookAnchor.app` in Applications folder
   - Hold **Option** key and select **Open**
   - Click **Open** in the security dialog

   This security bypass is only needed once. After the first successful launch, HookAnchor opens normally and creates configuration files in `~/.config/hookanchor/`

4. **Launch HookAnchor**: Open HookAnchor from Applications to complete initial setup

5. **Grant Permissions**: Allow accessibility permissions when prompted

6. **Setup Keyboard Trigger** (choose one method below - **Option 1 is recommended**)

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
- **⌥`** (Option+Backtick) - Good alternative if Option+Space is taken
- **⌃Space** (Control+Space) - If not used by Spotlight
- **⌘⇧Space** (Command+Shift+Space) - Alternative option

**Testing the trigger:**
After setting up your shortcut, test it immediately by pressing your chosen key combination. The HookAnchor popup should appear instantly. If not, verify the shortcut was added correctly in System Settings.

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

1. Press your configured trigger key to open HookAnchor
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

| Type | Description | Example |
|------|-------------|---------|
| **app** | Launch macOS applications | `Terminal : app Terminal`<br>`Chrome : app Google Chrome` |
| **url** | Open websites in default browser | `GitHub : url https://github.com`<br>`Google : url https://google.com` |
| **folder** | Open folders in Finder | `Downloads : folder ~/Downloads`<br>`Projects : folder ~/Documents/Projects` |
| **cmd** | Execute shell commands | `List Files : cmd ls -la`<br>`Server : cmd npm run dev` |
| **anchor** | Navigate to project folders with markdown files | `My Project : anchor ~/Projects/MyProject/MyProject.md` |
| **alias** | Reference other commands | `Term : alias Terminal`<br>`GH : alias GitHub` |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Escape** | Close popup |
| **Enter** | Execute command |
| **Arrow Keys** | Navigate commands |
| **/** | Launch first folder matching search |
| **=** | Template: Edit command from current input |
| **;** | Template: Edit currently selected command |
| **+** | Template (Grab): Capture window/app after countdown |
| **>** | Template (Alias): Create alias to last executed command |
| **!** | Template (Sub Anchor): Create anchor as subfolder of last executed |
| **&** | Template (Sub Markdown): Create markdown note in same folder as last executed |
| **`** | Show history viewer |
| **?** | Show keyboard shortcuts |
| **Cmd+Shift+H** | Open User Guide (HTML documentation) |

## Creating Commands

### Method 1: Using Templates

1. Open HookAnchor (your configured trigger key)
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

Terminal : app Terminal
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

To start fresh with default configuration:
```bash
# Backup current config, then remove it to regenerate defaults
cp ~/.config/hookanchor/config.yaml ~/.config/hookanchor/config.backup.yaml && rm ~/.config/hookanchor/config.yaml
# Restart HookAnchor to load defaults
```

### Restore from Backup

To restore commands from a previous backup:
```bash
# Copy an earlier version of commands.txt from backups folder
# This will load previous commands over the existing commands
cp ~/.config/hookanchor/backups/commands_YYYYMMDD_HHMMSS.txt ~/.config/hookanchor/commands.txt

# Or restore the cache file to replace current commands with earlier version
cp ~/.config/hookanchor/backups/cache_YYYYMMDD_HHMMSS.json ~/.config/hookanchor/commands_cache.json
```

Both files in the backups folder use matching timestamps, so you can restore both from the same point in time.

## Getting Help

Use the CLI help system for detailed information:

```bash
ha --help              # General help and command overview
ha --help-config       # Configuration reference
ha --help-templates    # Templates and scripting guide
```

Additional resources:
- **Logs**: Check `~/.config/hookanchor/anchor.log` for debugging
- **Issues**: Report bugs at https://github.com/oblinger/hookanchor/issues

## Action Reference

Action types specify what kind of command to execute. These are used in command definitions to tell HookAnchor how to handle the command.

| Action Type | Description | Example |
|-------------|-------------|---------|
| `app` | Launch macOS applications | `Terminal : app Terminal` |
| `url` | Open websites in default browser | `GitHub : url https://github.com` |
| `folder` | Open folders in Finder | `Downloads : folder ~/Downloads` |
| `cmd` | Execute shell commands | `List : cmd ls -la` |
| `anchor` | Navigate to project folders with markdown files | `Project : anchor ~/Project/Project.md` |
| `alias` | Reference other commands | `GH : alias GitHub` |
| `markdown` | Open markdown files in Obsidian | `Notes : markdown ~/Documents/notes.md` |
| `doc` | Open document files (Word, Excel, etc.) | `Report : doc ~/Documents/report.docx` |
| `chrome` | Open URL in Chrome | `Gmail : chrome https://mail.google.com` |
| `safari` | Open URL in Safari | `News : safari https://news.ycombinator.com` |
| `brave` | Open URL in Brave browser | `Web3 : brave https://ethereum.org` |
| `notion` | Open Notion pages | `Tasks : notion https://notion.so/tasks` |
| `slack` | Open Slack channels | `Team : slack https://team.slack.com/archives/...` |
| `contact` | Open contact cards | `John : contact john@example.com` |
| `text` | Open text files | `Todo : text ~/Documents/todo.txt` |
| `console` | Open Google Cloud Console | `GCP : console https://console.cloud.google.com` |
| `obs_url` | Open Obsidian URLs | `Daily : obs_url obsidian://open?vault=MyVault` |