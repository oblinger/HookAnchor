# Programmer's Reference

Advanced configuration guide for extending HookAnchor with scripting. Covers the template variable system, action type catalog, JavaScript built-in functions, custom action authoring, and grabber rule writing.

For config field definitions, see [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md). For practical examples, see [CONFIG_BY_EXAMPLE.md](CONFIG_BY_EXAMPLE.md).

---

**Contents**

**Part I — [Scripting in config.yaml](#part-i--scripting-in-configyaml)**

Template expressions and the action type catalog — everything you configure directly in `config.yaml`.

1. [Template Variables and Expressions](#1-template-variables-and-expressions)
2. [Action Types](#2-action-types)

**Part II — [Extending HookAnchor via config.js](#part-ii--extending-hookanchor-via-configjs)**

Custom behavior authored in `~/.config/hookanchor/config.js` — the ctx object, built-in function library, custom actions, grabber rules, and cloud integrations.

3. [The ctx Object](#3-the-ctx-object)
4. [Built-in Functions](#4-built-in-functions)
5. [Writing Custom Actions](#5-writing-custom-actions)
6. [Writing Grabber Rules](#6-writing-grabber-rules)
7. [Cloud Scan Roots](#7-cloud-scan-roots)

---

# Part I — Scripting in config.yaml

Template fields in `config.yaml` use `{{...}}` expressions with full JavaScript evaluation. This section covers the available variables and the catalog of action types you can reference.

## 1 Template Variables and Expressions

Templates use JavaScript evaluation inside `{{...}}` expressions. Any valid JavaScript expression that returns a string can be used.

### Variable Objects

#### `input` (String)

The text the user typed when the template was triggered.

```yaml
name: "{{input}}"
name: "{{input.trim()}}"
name: "{{input.replace(/ /g, '_')}}"
name: "{{input.toUpperCase()}}"
name: "{{input || 'Untitled'}}"
```

#### `raw_input` (String)

The unprocessed user input before any template transformation.

#### `last_executed` (Object)

The last command that was actually executed (launched). This is the command the user ran before triggering the template.

| Property | Description |
|----------|-------------|
| `last_executed.name` | Command name |
| `last_executed.action` | Action type (e.g., `anchor`, `markdown`, `app`) |
| `last_executed.arg` | Command argument / path |
| `last_executed.patch` | Command group/patch |
| `last_executed.folder` | Extracted folder path (throws if empty) |
| `last_executed.flags` | Command flags string |
| `last_executed.path` | Alias for `arg` |

```yaml
# Create a child file under the last executed command's folder
arg: "{{last_executed.folder}}/{{input}}/{{input}}.md"
patch: "{{last_executed.patch}}"
```

#### `selected` (Object)

The currently highlighted command in the popup (may differ from `last_executed` if the user moved the selection without launching).

Same properties as `last_executed`: `name`, `action`, `arg`, `patch`, `folder`, `flags`, `path`.

```yaml
# Modify the selected command in place
name: "{{selected.name}}"
arg: "{{selected.arg}}"
```

#### `last_anchor` (Object)

The last anchor command that was executed. Same properties as `last_executed`. Useful for creating siblings — items at the same level as the last anchor rather than children under it.

```yaml
# Create a sibling alongside the last anchor
arg: "{{last_anchor.folder}}/{{input}}/{{input}}.md"
```

> **Sibling vs Child**: `last_executed.folder` creates children *under* the last command. `last_anchor.folder` creates siblings *alongside* the last anchor. Choose based on your hierarchy intent.

#### `date` (Object)

Current date and time components.

| Property | Example | Description |
|----------|---------|-------------|
| `date.year` | `"2025"` | 4-digit year |
| `date.year2` | `"25"` | 2-digit year |
| `date.month` | `"03"` | Month, zero-padded |
| `date.month_short` | `"3"` | Month, no padding |
| `date.month_name` | `"March"` | Full month name |
| `date.month_abbr` | `"Mar"` | 3-letter abbreviation |
| `date.day` | `"05"` | Day, zero-padded |
| `date.day_short` | `"5"` | Day, no padding |
| `date.weekday` | `"Monday"` | Full weekday name |
| `date.weekday_abbr` | `"Mon"` | 3-letter abbreviation |
| `date.hour` | `"14"` | Hour, 24h, zero-padded |
| `date.hour12` | `"2"` | Hour, 12h |
| `date.minute` | `"30"` | Minute, zero-padded |
| `date.second` | `"45"` | Second, zero-padded |
| `date.ampm` | `"PM"` | AM/PM indicator |
| `date.timestamp` | `"1640995200"` | Unix timestamp |
| `date.iso` | `"2025-03-05T14:30:45"` | ISO 8601 format |

```yaml
name: "{{date.year}}-{{date.month}}-{{date.day}} {{input}}"
```

#### `grabbed` (Object)

Context captured by the grabber when the template uses `grab: <seconds>`.

| Property | Description |
|----------|-------------|
| `grabbed.action` | Detected action type (e.g., `open_url`, `app`) |
| `grabbed.arg` | Captured argument (URL, file path, etc.) |
| `grabbed.app` | Application name |
| `grabbed.title` | Window title |
| `grabbed.text` | Selected text or content |
| `grabbed.suffix` | Suffix from `grabber_suffix_map` |

```yaml
grab: 3
action: "{{grabbed.action}}"
arg: "{{grabbed.arg}}"
```

#### `env` (Object)

System environment information.

| Property | Description |
|----------|-------------|
| `env.home` | User home directory |
| `env.user` | Current username |
| `env.hostname` | Machine hostname |
| `env.os` | Operating system |
| `env.config_dir` | HookAnchor config directory |

### JavaScript Expressions in Templates

Since `{{...}}` uses full JavaScript evaluation, standard string methods and operators work:

```yaml
# String methods
name: "{{input.toLowerCase().replace(/[^a-z0-9]+/g, '-')}}"

# Conditional / default values
name: "{{input || 'Untitled'}}"
patch: "{{last_executed.patch || 'MISC'}}"

# Ternary operator
name: "{{input.length > 20 ? input.slice(0,20) + '...' : input}}"

# Chained fallback
arg: "{{last_executed.folder || selected.folder || env.home + '/Documents'}}/{{input}}.md"
```

### Migration from Old Variable Format

If you have templates using the old `{{YYYY}}` style variables, update them:

| Old | New |
|-----|-----|
| `{{YYYY}}` | `{{date.year}}` |
| `{{MM}}` | `{{date.month}}` |
| `{{DD}}` | `{{date.day}}` |
| `{{hh}}` | `{{date.hour}}` |
| `{{mm}}` | `{{date.minute}}` |
| `{{ss}}` | `{{date.second}}` |
| `{{previous_name}}` | `{{last_executed.name}}` |
| `{{previous_folder}}` | `{{last_executed.folder}}` |
| `{{previous_patch}}` | `{{last_executed.patch}}` |
| `{{previous_action}}` | `{{last_executed.action}}` |
| `{{previous_arg}}` | `{{last_executed.arg}}` |
| `{{selected_patch}}` | `{{selected.patch}}` |
| `{{grabbed_action}}` | `{{grabbed.action}}` |
| `{{grabbed_arg}}` | `{{grabbed.arg}}` |
| `{{grabbed_app}}` | `{{grabbed.app}}` |
| `{{grabbed_text}}` | `{{grabbed.text}}` |

---

## 2 Action Types

Actions define behaviors triggered by keyboard shortcuts, popup commands, or other actions. There are two categories.

### Built-in Action Types (Rust)

These are handled natively by the launcher:

| Type | Argument | Description |
|------|----------|-------------|
| `noop` | — | No operation |
| `template` | *(template fields)* | Create commands from templates |
| `popup` | `popup_action` | Control popup: `show`, `hide`, `toggle`, `next_page`, etc. |
| `open_url` | URL | Open URL in browser (use `browser` param for specific browser) |
| `app` | app name | Launch or activate application |
| `open_folder` | path | Open folder in Finder |
| `open_file` | path | Open file with default application |
| `shell` | command | Execute shell command |
| `obsidian` | file path | Open in Obsidian |
| `alias` | command name | Execute another command by name |
| `grab` | — | Trigger the grabber |
| `watcher` | — | Trigger file watcher |

### JavaScript Action Types (config.js)

Any action type not in the built-in list is dispatched to `config.js` by looking for a function named `action_<type>`. For example, action type `markdown` calls `action_markdown(ctx)`.

Standard JavaScript action types shipped with the default config:

| Type | Description |
|------|-------------|
| `markdown` | Open markdown file (in Obsidian if in vault, else default app) |
| `folder` | Open folder (resolves relative paths against vault root) |
| `cmd` | Execute shell command (supports `W` flag for Terminal window) |
| `console` | Execute with terminal modes: background (no flags), interactive (`I`), auto-close (`C`) |
| `doc` | Open document with default application |
| `text` | Type text via keyboard simulation (reads from file) |
| `insert` | Type text directly from argument |
| `contact` | Search and open in Contacts app |
| `slack` | Navigate to Slack channel |
| `1pass` | Open 1Password Quick Access with search term |
| `notion` | Open Notion page |
| `chrome` | Open URL in Chrome |
| `work` | Open URL in Chrome Beta |
| `anchor` | Smart dispatch: infers action type from argument (URL → browser, `.md` → markdown, directory → folder) and saves last anchor |
| `activate_tmux` | Create/attach tmux session for a project folder |
| `edit` | Open file in `$EDITOR` or default text editor |
| `rescan` | Trigger command database rescan |
| `wrap` | Wrap a file into a same-named folder and add `A` flag |
| `grab` | Perform grab operation via CLI |
| `clear_log` | Truncate `anchor.log` |

### How Commands Reference Actions

Commands in `commands.txt` have an action field that names the action type:

```
CommandName  action_type  /path/or/argument  GroupName  Flags
```

When a command is executed, HookAnchor looks up the action type, first checking built-in types, then falling back to `config.js`.

---

# Part II — Extending HookAnchor via config.js

Custom actions, grabber rules, and cloud integrations are authored in `~/.config/hookanchor/config.js`. Functions in this file receive a `ctx` object and have access to all built-in functions through `ctx.builtins`.

## 3 The ctx Object

Actions defined in `config.js` receive a `ctx` object with full command context.

### ctx Properties

| Property | Type | Description |
|----------|------|-------------|
| `ctx.arg` | `string` | Primary argument (file path, URL, etc.) |
| `ctx.input` | `string` | User's search input |
| `ctx.command_name` | `string` | Name of the command being executed |
| `ctx.flags` | `string` | Command flags (e.g., `"A"`, `"IC"`) |
| `ctx.params` | `object` | Action parameters from config (e.g., `delay`, `direct`, `browser`) |
| `ctx.selected` | `object` | Currently selected command — `{name, arg, action, patch, flags, folder}` |
| `ctx.previous` | `object` | Previously executed command — `{name, folder, patch}` |
| `ctx.grabbed` | `object` | Grabber capture — `{action, arg}` |
| `ctx.date` | `object` | Date components — `{YYYY, MM, DD}` |
| `ctx.last_anchor_input` | `string` | Last anchor input text |
| `ctx.builtins` | `object` | All built-in functions (see [§ 4](#4-built-in-functions)) |

### Accessing Builtins

In `config.js`, built-in functions are accessed through `ctx.builtins`:

```javascript
action_example: function(ctx) {
    const { log, shell, expandHome, fileExists } = ctx.builtins;

    log("EXAMPLE", `Processing: ${ctx.arg}`);
    const path = expandHome(ctx.arg);

    if (fileExists(path)) {
        shell(`open "${path}"`);
    }
}
```

### Return Values

- Return a string for status messages
- Return `{ exit: true }` to close the popup after execution
- Return nothing (or `undefined`) for no-op
- Throw an error to trigger the error dialog

---

## 4 Built-in Functions

These functions are available through `ctx.builtins` in `config.js` actions.

### Logging

| Function | Description |
|----------|-------------|
| `log(message)` | General log output (to `anchor.log`) |
| `log(tag, message)` | Tagged log output |
| `debug(message)` | Debug log output (verbose mode only) |
| `error(message)` | Error log + shows error dialog to user |

### File Operations

| Function | Returns | Description |
|----------|---------|-------------|
| `readFile(path)` | `string` | Read file contents |
| `writeFile(path, content)` | — | Write content to file |
| `fileExists(path)` | `boolean` | Check if file exists |
| `isDirectory(path)` | `boolean` | Check if path is a directory |
| `listFiles(dir, pattern)` | `string[]` | List files matching optional pattern |

### Path Utilities

| Function | Returns | Description |
|----------|---------|-------------|
| `joinPath(a, b)` | `string` | Join path components |
| `dirname(path)` | `string` | Get parent directory |
| `basename(path)` | `string` | Get filename component |
| `expandHome(path)` | `string` | Expand `~` to home directory |
| `getExtension(path)` | `string` | Get file extension |

### Launcher Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `launch_app(name, arg?)` | — | Launch macOS application |
| `open_folder(path)` | — | Open folder in Finder |
| `open_url(url, browser?)` | — | Open URL in browser |
| `launch(command)` | — | Execute another HookAnchor command |

### Shell Execution

| Function | Returns | Description |
|----------|---------|-------------|
| `shell(command)` | `string` | Execute command asynchronously |
| `shellSync(command)` | `string` | Execute command synchronously, return output |
| `shellWithExitCode(cmd)` | `string` | Returns JSON: `{exitCode, stdout, stderr}` |
| `spawnDetached(command)` | — | Launch long-running process |
| `commandExists(name)` | `boolean` | Check if command is in PATH |
| `change_directory(path)` | — | Change working directory |

### Application Control

| Function | Returns | Description |
|----------|---------|-------------|
| `activateApp(name)` | — | Bring application to foreground |
| `appIsRunning(name)` | `boolean` | Check if application is running |
| `runAppleScript(script)` | `string` | Execute AppleScript |

### Keyboard Simulation

| Function | Description |
|----------|-------------|
| `sendKeystroke(key, modifiers[])` | Send keystroke with modifiers (`"cmd"`, `"shift"`, `"ctrl"`, `"alt"`) |
| `typeString(text)` | Type text via keyboard simulation |
| `pressKey(key)` | Press a single key (e.g., `"return"`, `"escape"`) |
| `testAccessibility()` | Check if Accessibility permission is granted |

### Configuration Access

| Function | Returns | Description |
|----------|---------|-------------|
| `getConfigString(key)` | `string` | Read config value by dotted path (e.g., `"launcher_settings.obsidian_vault_name"`) |
| `getObsidianVault()` | `string` | Vault name |
| `getObsidianApp()` | `string` | Obsidian app name |
| `getObsidianVaultPath()` | `string` | Vault path |

### Data Processing

| Function | Returns | Description |
|----------|---------|-------------|
| `testRegex(text, pattern)` | `boolean` | Test text against regex |
| `parseYaml(text)` | `string` | Parse YAML to JSON string |
| `encodeURIComponent(text)` | `string` | URL-encode a string |

### HookAnchor Integration

| Function | Description |
|----------|-------------|
| `saveAnchor(name)` | Save a command as the "last anchor" |
| `updateCommand(name, newName, action, arg, patch, flags)` | Update a command in the database |

### tmux

| Function | Returns | Description |
|----------|---------|-------------|
| `has_tmux_session(name)` | `boolean` | Check if tmux session exists |
| `start_tmux_session(config)` | — | Start session from `.tmuxp.yaml` |
| `activate_iterm()` | — | Bring iTerm2 to foreground |
| `start_claude_code()` | — | Start Claude Code in current directory |

---

## 5 Writing Custom Actions

### In config.js

Create a new JavaScript action by adding a function to `~/.config/hookanchor/config.js`:

```javascript
module.exports = {
    // ... existing actions ...

    action_myaction: function(ctx) {
        const { log, shell, expandHome, fileExists } = ctx.builtins;
        const path = expandHome(ctx.arg);

        log("MYACTION", `Processing: ${path}`);

        if (!fileExists(path)) {
            ctx.builtins.error(`File not found: ${path}`);
            return;
        }

        // Your logic here
        shell(`open "${path}"`);
        return "Done";
    }
};
```

Then reference it in config.yaml actions:

```yaml
actions:
  my_custom_action:
    action_type: myaction
    key: "Cmd+M"
    description: "My custom action"
```

Or use it as a command action type in `commands.txt`.

### Action Parameters

Actions can receive extra parameters through the `params` field in the action definition:

```yaml
actions:
  slow_text:
    action_type: text
    key: "Cmd+T"
    description: "Type text with slow delay"
    params:
      delay: 2.0
      direct: true
```

These are accessible as `ctx.params.delay`, `ctx.params.direct`, etc.

### Accessing the Selected Command

Actions that operate on the currently selected command use `ctx.selected`:

```javascript
action_inspect: function(ctx) {
    const { log } = ctx.builtins;
    log("INSPECT", `Name: ${ctx.selected.name}`);
    log("INSPECT", `Action: ${ctx.selected.action}`);
    log("INSPECT", `Arg: ${ctx.selected.arg}`);
    log("INSPECT", `Patch: ${ctx.selected.patch}`);
    log("INSPECT", `Flags: ${ctx.selected.flags}`);
}
```

### Updating Commands Programmatically

The `updateCommand` builtin modifies a command in the database:

```javascript
action_retag: function(ctx) {
    const { updateCommand, log } = ctx.builtins;
    const name = ctx.selected.name;
    const newPatch = "NewGroup";

    updateCommand(name, name, ctx.selected.action, ctx.selected.arg, newPatch, ctx.selected.flags);
    log("RETAG", `Moved '${name}' to group '${newPatch}'`);
}
```

---

## 6 Writing Grabber Rules

Grabber rules detect what application the user is in and extract context (URL, file path, etc.) for command creation.

### Rule Structure

Each rule in the `grabber_rules` array has:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Display name for the rule |
| `matcher` | `string` | JavaScript expression that evaluates to `true` when this rule matches |
| `action` | `string` | Action type to assign (e.g., `open_url`, `app`, `anchor`) |
| `patch` | `string` | Group to assign (alias: `group`) |

### Matcher Expressions

The matcher is a JavaScript expression with access to `props`:

| Property | Description |
|----------|-------------|
| `props.bundleId` | Application bundle identifier (e.g., `"com.google.Chrome"`) |
| `props.url` | Current URL (browsers) |
| `props.title` | Window title |
| `props.selection` | Selected text or file selection (Finder) |
| `props.path` | File path (Finder) |
| `props.recommendedAction` | Suggested action type (Finder) |

### Step-by-Step: Writing a New Rule

**1. Identify the bundleId.**

Run a grab with diagnostic output. Trigger the grabber (usually the `+` key) while the target app is focused. Check `anchor.log` for the captured properties:

```
tail -f ~/.config/hookanchor/anchor.log
```

Look for lines showing `props.bundleId`, `props.url`, `props.title`, etc.

**2. Write the matcher.**

Match on `bundleId` and optionally filter by URL or title:

```yaml
grabber_rules:
  - name: "Figma"
    matcher: "props.bundleId === 'com.figma.Desktop'"
    action: "app"
    patch: "Design"
```

For browsers, match the URL:

```yaml
  - name: "GitHub"
    matcher: "props.bundleId === 'com.google.Chrome' && props.url && props.url.includes('github.com')"
    action: "open_url"
    patch: "Dev"
```

**3. Choose the action type.**

- `open_url` — for URLs (browser context)
- `app` — for applications (just activate the app)
- `anchor` — for file-based content
- `markdown` — for markdown files
- `folder` — for directories

**4. Test the rule.**

Trigger the grabber from the target app and check that the correct action type and argument are captured.

### Suffix Mapping

The `grabber_suffix_map` automatically appends suffixes to command names based on URL patterns:

```yaml
grabber_suffix_map:
  "github.com": "@github"
  "docs.google.com": "@gdocs"
  "stackoverflow.com": "@stack"
```

When grabbing a URL matching `github.com`, the suggested command name gets `@github` appended.

### Example: IDE File Capture

Extract filenames from IDE window titles using string splitting:

```yaml
  - name: "VS Code"
    matcher: "props.bundleId === 'com.microsoft.VSCode'"
    action: "anchor"
    patch: "Dev"
```

The grabber extracts the file path from VS Code's window title (which typically shows the open file).

### Example: Finder Context

Finder provides rich context through multiple properties:

```yaml
  - name: "Finder Folder"
    matcher: "props.bundleId === 'com.apple.finder' && props.recommendedAction === 'folder'"
    action: "folder"
    patch: "Files"

  - name: "Finder File"
    matcher: "props.bundleId === 'com.apple.finder' && props.recommendedAction !== 'folder'"
    action: "anchor"
    patch: "Files"
```

---

## 7 Cloud Scan Roots

Cloud scan roots allow HookAnchor to discover commands from cloud services like Notion.

### Configuration

Cloud scan roots are defined in `popup_settings.cloud_scan_roots`:

```yaml
popup_settings:
  cloud_scan_roots:
    - type: notion
      enabled: true
      root: "Workspace Name"
      api_key: "ntn_xxxxxxxxxxxxx"
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | `string` | Service type (currently: `notion`) |
| `enabled` | `boolean` | Enable/disable this scan root |
| `root` | `string` | Root name or workspace identifier |
| `api_key` | `string` | API authentication key |
| `credentials` | `string` | Alternative credentials field |

### Notion Setup

1. Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Copy the API key (starts with `ntn_`)
3. Share the desired Notion pages/databases with your integration
4. Add the cloud scan root to your config
5. HookAnchor will discover Notion pages and create commands for them

---

## See Also

- [USER_GUIDE.md](USER_GUIDE.md) — Getting started and basic usage
- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) — Complete configuration field reference
- [CONFIG_BY_EXAMPLE.md](CONFIG_BY_EXAMPLE.md) — Practical configuration examples
