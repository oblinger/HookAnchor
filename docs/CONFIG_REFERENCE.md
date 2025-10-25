# HookAnchor Configuration Reference

This document provides complete reference documentation for the HookAnchor configuration file (`~/.config/hookanchor/config.yaml`).

## Table of Contents

1. [Configuration File Location](#configuration-file-location)
2. [Popup Settings](#popup-settings)
3. [Launcher Settings](#launcher-settings)
4. [Scanner Settings](#scanner-settings)
5. [Markdown Roots](#markdown-roots)
6. [Keyboard Bindings](#keyboard-bindings)
7. [Templates](#templates)
8. [Grabber Rules](#grabber-rules)
9. [Functions](#functions)
10. [Complete Example](#complete-example)

## Configuration File Location

The main configuration file must be located at:
```
~/.config/hookanchor/config.yaml
```

If this file doesn't exist, HookAnchor will create it with default settings on first run.

## Popup Settings

Controls the appearance and behavior of the popup window.

```yaml
popup_settings:
  # Display Configuration
  max_rows: 25                    # Maximum number of rows in command list (1-50)
  max_columns: 4                  # Maximum columns for grid layout (1-10)
  max_window_size: "1700x1100"    # Maximum window size "widthxheight"
  default_window_size: "600x400"  # Default popup size "widthxheight"
  
  # Behavior Settings
  verbose_logging: true           # Enable detailed debug logging
  merge_similar: true             # Merge similar commands into submenus
  word_separators: " ._-"         # Characters that separate words for merging
  idle_timeout_seconds: 60        # Auto-hide after N seconds of inactivity
  countdown_seconds: 5            # Grabber countdown duration
  run_in_background: true         # Keep process running for instant popup
  
  # System Settings
  scan_interval_seconds: 30       # Filesystem rescan interval
  max_log_file_size: 10000000    # Max log size in bytes before rotation
  
  # Action Types
  listed_actions: >               # Comma-separated list of valid action types
    alias,anchor,app,url,folder,cmd,chrome,safari,brave,firefox,
    work,notion,obs,obs_url,1pass,rewrite,doc,contact,slack,text,shutdown
```

### Field Details

| Field                   | Type    | Default     | Description                              |
| ----------------------- | ------- | ----------- | ---------------------------------------- |
| `max_rows`              | integer | 25          | Maximum rows displayed in popup list     |
| `max_columns`           | integer | 4           | Columns in multi-column layout           |
| `max_window_size`       | string  | "1700x1100" | Maximum window dimensions                |
| `default_window_size`   | string  | "600x400"   | Initial window size                      |
| `verbose_logging`       | boolean | true        | Enable debug output to log file          |
| `merge_similar`         | boolean | true        | Group similar commands into submenus     |
| `word_separators`       | string  | " ._-"      | Characters that split words for grouping |
| `idle_timeout_seconds`  | integer | 60          | Seconds before auto-hiding popup         |
| `countdown_seconds`     | integer | 5           | Grabber countdown before capture         |
| `run_in_background`     | boolean | true        | Keep popup_server process running        |
| `scan_interval_seconds` | integer | 3600        | Seconds between filesystem scans         |
| `max_log_file_size`     | integer | 10000000    | Log rotation threshold (bytes)           |
| `listed_actions`        | string  | (see above) | Valid action types for commands          |

## Launcher Settings

Configuration for command execution and application integration.

```yaml
launcher_settings:
  js_timeout_ms: 5000              # JavaScript execution timeout
  obsidian_app_name: "Obsidian"    # Name of Obsidian app
  obsidian_vault_name: "MyVault"   # Your Obsidian vault name
  obsidian_vault_path: "~/Documents/Obsidian" # Path to vault
```

### Field Details

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `js_timeout_ms` | integer | 5000 | Maximum milliseconds for JavaScript execution |
| `obsidian_app_name` | string | "Obsidian" | Obsidian application name |
| `obsidian_vault_name` | string | "MyVault" | Name of your Obsidian vault |
| `obsidian_vault_path` | string | "~/Documents" | File path to Obsidian vault |

## Scanner Settings

Controls filesystem scanning for markdown files and commands.

```yaml
scanner_settings:
  orphans_path: "~/Documents/Orphans"  # Where to move orphaned files
```

### Field Details

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `orphans_path` | string | "~/Documents/Orphans" | Directory for orphaned markdown files |

## Markdown Roots

Directories to scan for markdown files and anchor commands.

```yaml
markdown_roots:
  - "~/Documents/Notes"
  - "~/Projects"
  - "~/Documents/Notes"
```

Each path is recursively scanned for:
- Anchor files (markdown files matching their parent folder name)
- Command definitions in markdown files
- Folder structures for navigation

## Keyboard Bindings

Define keyboard shortcuts for all popup actions.

```yaml
keybindings:
  # Navigation
  exit_app: "Escape"              # Close the popup window
  navigate_down: "ArrowDown"      # Move selection down
  navigate_up: "ArrowUp"          # Move selection up
  navigate_left: "ArrowLeft"      # Move left in grid
  navigate_right: "ArrowRight"    # Move right in grid
  
  # Execution
  execute_command: "Enter"        # Run selected command
  
  # Special Actions
  force_rebuild: "`"               # Force rescan (backtick)
  show_folder: "/"                # Open folder of selected item
  open_editor: "="                # Open command editor
  edit_active_command: ";"        # Edit current selection
  show_keys: "?"                  # Display key bindings help
```

### Key Format

Keys can be specified as:
- **Single keys**: `"a"`, `"b"`, `"1"`, `"2"`
- **Special keys**: `"Escape"`, `"Enter"`, `"Tab"`, `"Delete"`
- **Arrow keys**: `"ArrowUp"`, `"ArrowDown"`, `"ArrowLeft"`, `"ArrowRight"`
- **Punctuation**: `"/"`, `"="`, `";"`, `"?"` (ASCII form)
- **Named keys**: `"Backtick"`, `"Plus"`, `"Minus"`, `"Equals"`
- **With modifiers**: `"cmd+c"`, `"ctrl+shift+f"`, `"alt+enter"`

## Templates

Templates allow dynamic command creation with user input and context.

```yaml
templates:
  # Sub-anchor template (v0.10.0)
  sub_anchor:
    key: "!"                           # Trigger key
    name: "{{input}}"                  # Command name from user input
    action: "anchor"                   # Action type
    arg: "{{last_executed.folder}}/{{input}}/{{input}}.md"  # Create under last folder
    patch: "{{last_executed.patch}}"  # Use same patch as last command
    validate_last_executed_folder: true  # Ensure folder exists
    description: "Create sub-anchor under last executed"
  
  # Alias template
  alias:
    key: ">"                           # Trigger key
    name: "{{input}}"                  # Alias name
    action: "alias"                    # Alias action
    arg: "{{last_executed.name}}"     # Target command
    patch: "{{last_executed.patch}}"  # Same patch
    use_existing: true                 # Reference existing command
    description: "Create alias to last executed"
  
  # Date-based note template
  note:
    key: "$"
    name: "{{date.year}}-{{date.month}}-{{date.day}} {{input}}"
    action: "markdown"
    arg: "~/Notes/{{date.year}}/{{date.month}}/{{input}}.md"
    patch: "Notes"
    edit: true
    file: "~/Notes/{{date.year}}/{{date.month}}"  # Create directory
    contents: |                        # File contents
      # {{input}}
      Created: {{date.year}}-{{date.month}}-{{date.day}} {{date.hour}}:{{date.minute}}
    description: "Create dated note"
  
  # Grabber template
  grab:
    key: "+"
    grab: 3                            # Countdown seconds
    name: "{{input}}"
    action: "{{grabbed.action}}"      # From grabbed context
    arg: "{{grabbed.arg}}"            # From grabbed context
    edit: true
    group: "Apps"
    description: "Capture window context"
```

### Template Fields

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Keyboard trigger for template |
| `name` | string | Command name (supports variables) |
| `action` | string | Action type (app, url, folder, etc.) |
| `arg` | string | Action argument (supports variables) |
| `patch` | string | Command group/patch |
| `flags` | string | Optional execution flags |
| `edit` | boolean | Open editor before saving |
| `grab` | integer | Grabber countdown seconds |
| `group` | string | Command group |
| `file` | string | Directory to create |
| `contents` | string | File contents to write |
| `description` | string | Template description |
| `validate_last_executed_folder` | boolean | Check last_executed folder exists |
| `use_existing` | boolean | Reference existing command (for aliases) |
| `file_rescan` | boolean | Rescan after execution |

### Template Variables (v0.10.0+)

Templates use JavaScript object notation for variables. See [TEMPLATE_JS_VARIABLES.md](TEMPLATE_JS_VARIABLES.md) for complete reference.

#### Core Objects

| Object | Description | Example Usage |
|--------|-------------|--------------|
| `input` | User input text | `{{input}}`, `{{input.toUpperCase()}}` |
| `last_executed` | Last executed command | `{{last_executed.name}}`, `{{last_executed.folder}}` |
| `selected` | Currently selected command | `{{selected.name}}`, `{{selected.patch}}` |
| `date` | Date/time information | `{{date.year}}`, `{{date.month}}`, `{{date.day}}` |
| `grabbed` | Grabbed context | `{{grabbed.action}}`, `{{grabbed.arg}}` |
| `env` | Environment variables | `{{env.home}}`, `{{env.user}}` |

#### Common Properties

| Expression | Description | Example Value |
|------------|-------------|--------------|
| `{{last_executed.name}}` | Last command name | "Terminal" |
| `{{last_executed.folder}}` | Last command's folder | "/Users/name/project" |
| `{{last_executed.patch}}` | Last command's patch | "Dev" |
| `{{last_executed.action}}` | Last command's action | "app" |
| `{{selected.name}}` | Selected command name | "VS Code" |
| `{{date.year}}-{{date.month}}-{{date.day}}` | Current date | "2025-01-20" |
| `{{grabbed.action}}` | Grabbed action type | "url" |
| `{{grabbed.arg}}` | Grabbed argument | "https://example.com" |

## Grabber Rules

Rules for capturing application context to create commands.

```yaml
grabber_rules:
  # Browser URL capture
  - name: "Chrome URL"
    matcher: "bundleId === 'com.google.Chrome' && props.url ? props.url : null"
    action: "chrome"
    group: "Web"
  
  # Finder file selection
  - name: "Finder Anchor"
    matcher: "bundleId === 'com.apple.finder' && props.selection && props.recommendedAction === 'anchor' ? props.selection : null"
    action: "anchor"
    group: "Files"
  
  # Application capture
  - name: "Application Launcher"
    matcher: "app && app.length > 0 ? app : null"
    action: "app"
    group: "Apps"
```

### Grabber Rule Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Rule display name |
| `matcher` | string | JavaScript expression returning captured value or null |
| `action` | string | Action type for created command |
| `group` | string | Group/patch for command |

### Available Context in Matchers

- `bundleId` - Application bundle identifier
- `app` - Application name
- `title` - Window title
- `props.url` - Current URL (browsers)
- `props.selection` - Selected file (Finder)
- `props.path` - Current path (Finder)
- `props.recommendedAction` - Suggested action type
- `props.channel` - Slack channel name

## Functions

Define reusable functions for command execution.

```yaml
functions:
  # Simple function mappings
  action_chrome: 
    fn: open_with
    app: "Google Chrome"
    arg: "{{arg}}"
  
  # JavaScript functions
  action_folder: |
    const folderPath = "{{arg}}";
    log(`Opening folder: ${folderPath}`);
    
    if (folderPath.startsWith('/') || folderPath.startsWith('~')) {
      open_folder(folderPath);
    } else {
      const vaultRoot = getObsidianVaultPath();
      const absolutePath = joinPath(vaultRoot, folderPath);
      open_folder(absolutePath);
    }
  
  action_cmd: |
    const fullCmd = "{{arg}}";
    
    // Check for windowed execution flag
    if (fullCmd.startsWith('W ')) {
      const command = fullCmd.substring(2);
      const escapedCmd = command.replace(/"/g, '\\"');
      shell(`osascript -e 'tell application "Terminal" to do script "${escapedCmd}"'`);
    } else {
      shell(fullCmd);
    }
```

### JavaScript Functions

JavaScript functions are defined in your config.yaml under `js_functions`. These functions have access to the HookAnchor JavaScript API.

For the complete JavaScript API reference, see the actual functions defined in your config:
- Built-in action functions: `action_doc`, `action_folder`, `action_cmd`, etc.
- Helper functions: `openMarkdownFile`, `openAnchor`, `openObsidianFile`, etc.

#### Core API Categories

The JavaScript environment provides these function categories:

**Logging & Debug**
- `log()`, `debug()`, `error()` - Logging at different levels

**File System**
- `readFile()`, `writeFile()`, `fileExists()` - File operations
- `joinPath()`, `dirname()`, `basename()` - Path manipulation
- `expandHome()` - Expand tilde paths

**System Execution**
- `shell()` - Execute shell commands
- `shell_sync()` - Synchronous execution (use `/bin/sleep` not `sleep`!)
- `spawnDetached()` - Launch detached processes

**Application Control**
- `launch_app()` - Launch macOS applications
- `open_folder()` - Open in Finder
- `open_url()` - Open URLs in browser
- `activateApp()` - Bring app to front

**Obsidian Integration**
- `getObsidianVault()`, `getObsidianVaultPath()` - Vault info
- `openObsidianFile()` - Open notes in Obsidian

**Command Execution**
- `launch()` - Execute HookAnchor commands by name
- `change_directory()` - Change working directory

For implementation details, check your `~/.config/hookanchor/config.yaml` js_functions section.

## Complete Example

```yaml
# HookAnchor Configuration
popup_settings:
  max_rows: 25
  max_columns: 4
  verbose_logging: true
  merge_similar: true
  word_separators: " ._-"
  scan_interval_seconds: 30
  idle_timeout_seconds: 60
  countdown_seconds: 5
  run_in_background: true
  max_window_size: "1700x1100"
  default_window_size: "600x400"
  max_log_file_size: 10000000
  listed_actions: >
    alias,anchor,app,url,folder,cmd,chrome,safari,brave,firefox,work,
    notion,obs,obs_url,1pass,rewrite,doc,contact,slack,text,shutdown

launcher_settings:
  js_timeout_ms: 5000
  obsidian_app_name: "Obsidian"
  obsidian_vault_name: "MyVault"
  obsidian_vault_path: "~/Documents/Obsidian"

scanner_settings:
  orphans_path: "~/Documents/Orphans"

markdown_roots:
  - "~/Documents/Notes"
  - "~/Projects"

keybindings:
  exit_app: "Escape"
  navigate_down: "ArrowDown"
  navigate_up: "ArrowUp"
  navigate_left: "ArrowLeft"
  navigate_right: "ArrowRight"
  execute_command: "Enter"
  force_rebuild: "`"
  show_folder: "/"
  open_editor: "="
  edit_active_command: ";"
  show_keys: "?"

templates:
  default:
    key: "%"
    name: "{{input}}"
    action: "anchor"
    arg: "/path/to/{{input}}/{{input}}.md"
    patch: "{{selected_patch}}"
    edit: true
    description: "Create new anchor"

grabber_rules:
  - name: "Chrome URL"
    matcher: "bundleId === 'com.google.Chrome' && props.url ? props.url : null"
    action: "chrome"
    group: "Web"

functions:
  action_app:
    fn: launch_app
    name: "{{arg}}"
  
  action_url:
    fn: open_url
    url: "{{arg}}"
```