# Templates and Scripting Guide

This guide covers HookAnchor's powerful template system and JavaScript scripting capabilities for creating dynamic commands and custom automation.

## Table of Contents

1. [Templates Overview](#templates-overview)
2. [Template Variables](#template-variables)
3. [Built-in Templates](#built-in-templates)
4. [Creating Custom Templates](#creating-custom-templates)
5. [JavaScript Functions](#javascript-functions)
6. [Writing Custom Functions](#writing-custom-functions)
7. [Advanced Examples](#advanced-examples)
8. [Best Practices](#best-practices)

## Templates Overview

Templates are dynamic command generators that prompt for input and create customized commands. They're triggered by specific keys in the popup interface.

### How Templates Work

1. User presses template key (e.g., `%`)
2. Template prompts for input
3. Variables are replaced with actual values
4. Command is created or executed

### Template Structure

```yaml
templates:
  template_name:
    key: "%"                    # Trigger key
    name: "{{input}}"          # Command name with variables
    action: "type"             # Action type (app, url, cmd, etc.)
    arg: "{{input}}"           # Command argument
    patch: "Group"             # Command group
    edit: true                 # Open editor before saving
    description: "What it does" # Template description
```

## Template Variables

### User Input Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `{{input}}` | User-provided text | "My Project" |

### Date/Time Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{YYYY}}` | 4-digit year | "2024" |
| `{{YY}}` | 2-digit year | "24" |
| `{{MM}}` | Month (padded) | "03" |
| `{{M}}` | Month (no pad) | "3" |
| `{{DD}}` | Day (padded) | "05" |
| `{{D}}` | Day (no pad) | "5" |
| `{{hh}}` | Hour (24h, padded) | "14" |
| `{{h}}` | Hour (24h, no pad) | "14" |
| `{{mm}}` | Minute (padded) | "30" |
| `{{m}}` | Minute (no pad) | "30" |
| `{{ss}}` | Second (padded) | "45" |

### Context Variables

| Variable | Description | When Available |
|----------|-------------|----------------|
| `{{selected_patch}}` | Currently selected patch/group | Always |
| `{{previous_name}}` | Last executed command name | After command execution |
| `{{previous_folder}}` | Last command's folder path | After folder command |
| `{{previous_patch}}` | Last command's patch | After command execution |
| `{{previous_action}}` | Last command's action type | After command execution |
| `{{previous_arg}}` | Last command's argument | After command execution |

### Grabber Variables

| Variable | Description | When Available |
|----------|-------------|----------------|
| `{{grabbed_action}}` | Detected action type | After grabber capture |
| `{{grabbed_arg}}` | Captured argument/path | After grabber capture |
| `{{grabbed_app}}` | Application name | After grabber capture |
| `{{grabbed_text}}` | Window title or selection | After grabber capture |

## Built-in Templates

HookAnchor includes several pre-configured templates:

### Default Template (`%`)
Creates a new anchor command:
```yaml
default:
  key: "%"
  name: "{{input}}"
  action: "anchor"
  arg: "/path/to/{{input}}/{{input}}.md"
  patch: "{{selected_patch}}"
  edit: true
  description: "Create new anchor command"
```

### Note Template (`$`)
Creates dated notes:
```yaml
note:
  key: "$"
  name: "{{YYYY}}-{{MM}}-{{DD}} {{input}}"
  action: "markdown"
  arg: "~/Notes/{{YYYY}}/{{MM}}/{{YYYY}}-{{MM}}-{{DD}} {{input}}.md"
  patch: "Notes"
  file: "~/Notes/{{YYYY}}/{{MM}}"  # Creates directory
  contents: |
    # {{YYYY}}-{{MM}}-{{DD}} {{input}}
    
    Created: {{YYYY}}-{{MM}}-{{DD}} {{hh}}:{{mm}}
  description: "Create dated note"
```

### Grabber Template (`+`)
Captures application context:
```yaml
grab:
  key: "+"
  grab: 3  # Countdown seconds
  name: "{{input}}"
  action: "{{grabbed_action}}"
  arg: "{{grabbed_arg}}"
  edit: true
  group: "Apps"
  description: "Capture window/app after countdown"
```

### Alias Template (`>`)
Creates command shortcuts:
```yaml
alias:
  key: ">"
  name: "{{input}}"
  action: "alias"
  arg: "{{previous_name}}"
  patch: "{{previous_patch}}"
  edit: true
  description: "Create alias to last command"
```

### Sub-Anchor Template (`!`)
Creates nested anchors:
```yaml
sub_anchor:
  key: "!"
  name: "{{input}}"
  action: "anchor"
  arg: "{{previous_folder}}/{{input}}/{{input}}.md"
  patch: "{{previous_patch}}"
  file: "{{previous_folder}}/{{input}}"
  validate_previous_folder: true
  contents: |
    .[[{{input}}]].  >[[{{previous_name}}]]
  description: "Create sub-anchor of last folder"
```

## Creating Custom Templates

### Example 1: GitHub Issue Template
```yaml
templates:
  github_issue:
    key: "g"
    name: "Issue: {{input}}"
    action: "url"
    arg: "https://github.com/user/repo/issues/new?title={{input}}&body=Created%20from%20HookAnchor"
    patch: "GitHub"
    description: "Create GitHub issue"
```

### Example 2: Meeting Notes Template
```yaml
templates:
  meeting:
    key: "m"
    name: "Meeting: {{input}}"
    action: "markdown"
    arg: "~/Meetings/{{YYYY}}/{{MM}}/{{YYYY}}-{{MM}}-{{DD}}-{{input}}.md"
    patch: "Meetings"
    file: "~/Meetings/{{YYYY}}/{{MM}}"
    contents: |
      # Meeting: {{input}}
      **Date:** {{YYYY}}-{{MM}}-{{DD}}
      **Time:** {{hh}}:{{mm}}
      
      ## Attendees
      - 
      
      ## Agenda
      - 
      
      ## Notes
      
      ## Action Items
      - [ ] 
    description: "Create meeting notes"
```

### Example 3: Project Setup Template
```yaml
templates:
  project:
    key: "p"
    name: "Project: {{input}}"
    action: "cmd"
    arg: |
      mkdir -p ~/Projects/{{input}} &&
      cd ~/Projects/{{input}} &&
      git init &&
      echo "# {{input}}" > README.md &&
      code .
    patch: "Projects"
    description: "Initialize new project"
```

## JavaScript Functions

HookAnchor supports JavaScript functions for complex command logic.

### Function Definition

Functions are defined in the `functions` section of config.yaml:

```yaml
functions:
  # Simple function mapping
  action_app:
    fn: launch_app
    name: "{{arg}}"
  
  # JavaScript function
  action_smart: |
    const path = "{{arg}}";
    if (fileExists(path)) {
      if (path.endsWith('.md')) {
        launch_app("Obsidian", path);
      } else {
        open_folder(dirname(path));
      }
    }
```

### Available JavaScript APIs

#### File System
```javascript
// File operations
readFile(path)                   // Read file contents
writeFile(path, content)         // Write to file
fileExists(path)                // Check if exists
isDirectory(path)               // Check if directory
listFiles(dir, pattern)         // List matching files

// Path utilities
joinPath(part1, part2)          // Join paths
dirname(path)                   // Get directory
basename(path)                  // Get filename
expandHome(path)                // Expand ~/
getExtension(path)              // Get extension
```

#### System Operations
```javascript
// Shell execution
shell(command)                  // Run command
shell_sync(command)             // Run synchronously
spawnDetached(command)          // Launch detached
commandExists(command)          // Check command exists
shellWithExitCode(command)      // Get exit code

// Directory
change_directory(path)          // Change working dir
```

#### Application Control
```javascript
// Launch and control
launch_app(name, arg)           // Launch app
open_folder(path)               // Open in Finder
open_url(url, browser)          // Open URL
activateApp(name)               // Bring to front
appIsRunning(name)              // Check if running
runAppleScript(script)          // Run AppleScript
```

#### Configuration Access
```javascript
// Get configuration values
getObsidianVault()              // Vault name
getObsidianApp()                // App name
getObsidianVaultPath()          // Vault path
```

#### Utilities
```javascript
// Logging
log(message)                    // General log
debug(message)                  // Debug log
error(message)                  // Error log

// Text processing
testRegex(text, pattern)        // Test regex
parseYaml(text)                 // Parse YAML

// Command execution
launch(command)                 // Run HookAnchor command
```

## Writing Custom Functions

### Example 1: Smart File Handler
```yaml
functions:
  action_smart_open: |
    const file = "{{arg}}";
    const ext = getExtension(file);
    
    if (!fileExists(file)) {
      error("File not found: " + file);
      return;
    }
    
    switch(ext) {
      case "md":
        // Open markdown in Obsidian if in vault
        const vaultPath = getObsidianVaultPath();
        if (file.startsWith(expandHome(vaultPath))) {
          launch("obs " + file);
        } else {
          launch_app("Typora", file);
        }
        break;
      
      case "js":
      case "ts":
      case "py":
        launch_app("Visual Studio Code", file);
        break;
      
      case "pdf":
        launch_app("Preview", file);
        break;
      
      default:
        // Open containing folder for unknown types
        open_folder(dirname(file));
    }
```

### Example 2: Project Launcher
```yaml
functions:
  action_project: |
    const name = "{{arg}}";
    const projectPath = expandHome("~/Projects/" + name);
    
    if (!isDirectory(projectPath)) {
      error("Project not found: " + name);
      return;
    }
    
    // Change to project directory
    change_directory(projectPath);
    
    // Open in editor
    launch_app("Visual Studio Code", projectPath);
    
    // Check for project-specific setup
    if (fileExists(joinPath(projectPath, ".tmuxp.yaml"))) {
      // Has tmux config
      shell("tmuxp load " + projectPath + "/.tmuxp.yaml");
      activateApp("iTerm");
    } else if (fileExists(joinPath(projectPath, "package.json"))) {
      // Node project - install deps
      shell("cd " + projectPath + " && npm install");
    } else if (fileExists(joinPath(projectPath, "Cargo.toml"))) {
      // Rust project - build
      shell("cd " + projectPath + " && cargo build");
    }
    
    log("Opened project: " + name);
```

### Example 3: Conditional Browser
```yaml
functions:
  action_smart_browse: |
    const url = "{{arg}}";
    
    // Detect URL type and choose browser
    if (testRegex(url, "github\\.com")) {
      // Development sites in dev browser
      open_url(url, "Google Chrome Beta");
    } else if (testRegex(url, "localhost|127\\.0\\.0\\.1")) {
      // Local development
      open_url(url, "Google Chrome");
    } else if (testRegex(url, "youtube\\.com|netflix\\.com")) {
      // Media sites in Safari for better battery
      open_url(url, "Safari");
    } else {
      // Default browser
      open_url(url);
    }
```

## Advanced Examples

### Dynamic Command Creation
```yaml
functions:
  action_create_command: |
    const name = "{{arg}}";
    const configPath = expandHome("~/.config/hookanchor/custom_commands.yaml");
    
    // Read existing commands
    let commands = {};
    if (fileExists(configPath)) {
      const content = readFile(configPath);
      commands = JSON.parse(parseYaml(content));
    }
    
    // Add new command
    commands[name] = {
      action: "cmd",
      arg: "echo 'Running " + name + "'"
    };
    
    // Write back
    writeFile(configPath, JSON.stringify(commands, null, 2));
    log("Created command: " + name);
    
    // Force rescan to pick up new command
    launch("rescan");
```

### Tmux Integration
```yaml
functions:
  action_tmux_project: |
    const project = "{{arg}}";
    const projectPath = expandHome("~/Projects/" + project);
    
    if (!isDirectory(projectPath)) {
      error("Project not found");
      return;
    }
    
    // Check for tmux config
    const tmuxConfig = joinPath(projectPath, ".tmuxp.yaml");
    if (fileExists(tmuxConfig)) {
      // Load existing config
      shell_sync("tmuxp load " + tmuxConfig);
    } else {
      // Create new tmux session
      const script = `
        tmux new-session -d -s ${project} -c ${projectPath}
        tmux rename-window -t ${project}:0 'editor'
        tmux send-keys -t ${project}:0 'vim .' Enter
        tmux new-window -t ${project}:1 -n 'terminal'
        tmux select-window -t ${project}:0
      `;
      shell(script);
    }
    
    // Attach to session
    shell("tmux attach-session -t " + project);
    activateApp("iTerm");
```

## Best Practices

### 1. Error Handling
Always check for file/directory existence:
```javascript
if (!fileExists(path)) {
  error("File not found: " + path);
  return;
}
```

### 2. Path Expansion
Always expand paths with `~`:
```javascript
const fullPath = expandHome("~/Documents");
```

### 3. Logging
Use appropriate log levels:
```javascript
log("Normal operation");      // General info
debug("Variable: " + value);  // Debug info
error("Failed: " + reason);   // Errors
```

### 4. Synchronous vs Asynchronous
- Use `shell()` for fire-and-forget commands
- Use `shell_sync()` when you need the output
- Use `spawnDetached()` for long-running processes

### 5. Template Organization
Group related templates:
```yaml
templates:
  # Development templates
  dev_project: { ... }
  dev_test: { ... }
  
  # Note templates
  note_daily: { ... }
  note_meeting: { ... }
```

### 6. Function Naming
Use consistent prefixes:
```yaml
functions:
  action_app: { ... }      # Standard actions
  helper_validate: { ... }  # Helper functions
  custom_workflow: { ... }  # Custom workflows
```

### 7. Variable Validation
Validate template variables:
```javascript
const input = "{{input}}";
if (!input || input.trim() === "") {
  error("Input required");
  return;
}
```

## Debugging

### Enable Verbose Logging
```yaml
popup_settings:
  verbose_logging: true
```

### Check Logs
```bash
tail -f ~/.config/hookanchor/anchor.log
```

### Test Functions
Create a test function:
```yaml
functions:
  test_function: |
    log("Test started");
    log("Home: " + expandHome("~"));
    log("Obsidian: " + getObsidianVault());
    const result = shell_sync("echo 'Hello'");
    log("Shell result: " + result);
    return "Test complete";
```

## See Also

- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) - Complete configuration reference
- [USER_GUIDE.md](USER_GUIDE.md) - General usage guide
- [JavaScript API Source](../../src/js_runtime.rs) - Implementation details