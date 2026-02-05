# HookAnchor Configuration Reference

Complete reference for `~/.config/hookanchor/config.yaml`. Each section below corresponds to a top-level key in the config file.

## Sections

1. [Popup Settings](#1-popup-settings) — Display layout, behavior, timeouts
2. [Launcher Settings](#2-launcher-settings) — Execution config, Obsidian integration, tmux
3. [History Viewer](#3-history-viewer) — History viewer display and key bindings
4. [Scanner Settings](#4-scanner-settings) — File discovery, scan roots, skip patterns
5. [Anchor File Settings](#5-anchor-file-settings) — Electric Anchor processing, triggers, link blocks
6. [Actions & Templates](#6-actions--templates) — Action settings, unified action system, template variables
7. [Grabber Rules](#7-grabber-rules) — Application context capture and suffix mapping

---

## 1. Popup Settings

Controls the popup window appearance and behavior. Config key: `popup_settings`

### Popup Display

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `max_rows` | integer | 20 | Maximum rows displayed in the command list |
| `max_columns` | integer | 3 | Columns in multi-column grid layout |
| `max_characters` | integer | 30 | Maximum characters for command names before truncation |
| `max_window_size` | string | `"1700x1100"` | Maximum window dimensions (`"widthxheight"`) |
| `default_window_size` | string | `"600x400"` | Initial popup window size (`"widthxheight"`) |
| `show_popup_on_startup` | boolean | false | Show popup when app launches (false = run silently in background) |

### Popup Behavior

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `global_hotkey` | string | `"Option+Space"` | Global hotkey to show popup (e.g., `"Command+Shift+Space"`, `"Option+\``") |
| `run_in_background` | boolean | false | Keep popup_server running for instant activation |
| `idle_timeout_seconds` | integer | 60 | Seconds of inactivity before auto-hiding popup |
| `anchor_timeout_seconds` | integer | 180 | Seconds to remember last executed anchor |
| `countdown_seconds` | integer | 5 | Grabber countdown duration in seconds |
| `popup_server_retries` | integer | 3 | Times to retry showing popup before rebuilding |
| `merge_similar` | boolean | true | Group commands with shared prefixes into submenus |
| `word_separators` | string | `" ._-"` | Characters that define word boundaries for merging |
| `preferred_anchor` | string | `"markdown"` | Preferred action type when multiple anchors exist for a patch |
| `listed_actions` | string | `"app,url,folder,cmd,chrome"` | Comma-separated list of action types shown in the editor dropdown |

- **`global_hotkey`** — Read by the Swift supervisor process. Supports modifier+key combinations like `"Option+Space"`, `"Command+Shift+Space"`, `"Control+Option+Command+Space"`. Changes require app restart.
- **`listed_actions`** — Can use YAML block scalar for long lists: `listed_actions: > alias,app,console,...`

### Rename Behavior

Controls what gets renamed when a command name is edited in the popup.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `rename_doc` | boolean | false | Rename the document file when its command name changes |
| `rename_folder` | boolean | false | Rename anchor folder when its command name changes |
| `rename_patch` | boolean | false | Update patch name and all child commands when patch is renamed |
| `rename_prefix` | boolean | false | Update commands sharing a prefix when the prefix command is renamed |

### Logging & Developer

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `verbose_logging` | boolean | false | Enable detailed debug logging to `~/.config/hookanchor/anchor.log` |
| `max_log_file_size` | integer | 1000000 | Log file size threshold (bytes) before clearing (default: 1MB) |
| `skip_permissions_check` | boolean | false | Skip macOS Accessibility permission check on startup |
| `show_command_server_terminal` | boolean | false | Show Terminal window for command server |
| `developer_mode` | string | *(null)* | `"true"`, `"false"`, or a hostname to enable on a specific machine |

- **`developer_mode`** — When set to a hostname string (e.g., `"Daniels-MacBook-Pro.local"`), developer mode activates only on that machine. Controls build verification behavior.

---

## 2. Launcher Settings

Controls command execution, JavaScript runtime, and application integration. Config key: `launcher_settings`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `js_timeout_ms` | integer | 5000 | Maximum milliseconds for JavaScript action execution |
| `obsidian_app_name` | string | `"Obsidian"` | Obsidian application name |
| `obsidian_vault_name` | string | `"kmr"` | Obsidian vault name for wiki link resolution |
| `obsidian_vault_path` | string | `"~/Documents"` | File path to Obsidian vault root (tilde-expanded) |
| `flip_focus` | boolean | false | Flip focus to previous app and back during grabber countdown |
| `use_javascript_tmux_activation` | string | *(null)* | Use JavaScript-based tmux activation (`"true"` or null) |
| `tmux_startup_command` | string | *(null)* | Command to run in tmux session after activation |

- **`flip_focus`** — When true, the grabber flips to the previous application and back during the countdown so it can capture that app's context. When false, the user manually switches focus during the countdown.
- **`obsidian_vault_path`** — Supports `~` for home directory. Used to resolve file paths for Obsidian integration.

---

## 3. History Viewer

Settings for the history viewer GUI. Config key: `history_viewer`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `viewable_history_limit` | integer | 50000 | Maximum history entries to load |
| `tree_sidebar_width` | float | 250.0 | Tree sidebar width in pixels |
| `tree_sidebar_min_width` | float | 50.0 | Minimum sidebar width in pixels |
| `tree_indent_pixels` | float | 10.0 | Indentation per tree level in pixels |
| `tree_show_guides` | boolean | true | Show tree indent guide lines |
| `peek_on_hover` | boolean | true | Show history details on tree item hover |

### Key Bindings

```yaml
history_viewer:
  key_bindings:
    edit_selection: ";"    # Key to edit the selected history item
```

---

## 4. Scanner Settings

Controls filesystem scanning for commands, anchors, and documents. Config key: `scanner_settings`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `file_roots` | list | *(none)* | Directories to scan recursively for files and commands (tilde-expanded) |
| `scan_interval_seconds` | integer | 600 | Seconds between automatic filesystem rescans |
| `doc_file_extensions` | string | `"pdf,doc,docx,xls,xlsx,ppt,pptx,` | Comma-separated file extensions that generate DOC-type commands |
| | | `txt,rtf,pages,numbers,key"` | |
| `display_file_extensions` | string | *(defaults to doc_file_extensions)* | Comma-separated file extensions shown in anchor file `$ ls` listings |
| `anchor_tree_root` | string | `"~/ob/anchors"` | Root path for the anchor tree (tilde-expanded) |
| `delete_broken_aliases` | boolean | true | Automatically remove aliases whose targets no longer exist |
| `anchor_delegation` | boolean | true | Follow `(See [[NAME]])` patterns to delegate anchor status |
| `realtime_watch` | boolean | true | Enable filesystem watcher for live `.md` change detection |
| `realtime_debounce_ms` | integer | 500 | Debounce interval (ms) for file watcher events |
| `self_write_suppress_ms` | integer | 1000 | Suppress re-processing files HookAnchor just wrote (ms) |

- **`realtime_watch`** — When true, HookAnchor watches `file_roots` for `.md` file changes and processes anchor files automatically. When false, anchor files are only processed on manual rescan.
- **`self_write_suppress_ms`** — Prevents infinite loops: after HookAnchor writes an anchor file, it ignores changes to that file for this duration.
- **`display_file_extensions`** — If not set, falls back to `doc_file_extensions`. Controls which files appear in `$ ls` file list triggers.

### Skip Patterns

Glob patterns to exclude from scanning:

```yaml
scanner_settings:
  skip_patterns:
    - "**/.*/**"           # Hidden folders
    - "**/Yore/**"         # Historical/archived content
    - "**/*backups*/**"    # Backup directories
    - "**/node_modules/**" # Node.js dependencies
    - "**/target/**"       # Rust build artifacts
    - "**/.git/**"         # Git internals
```

Default skip patterns (when none are configured): `node_modules`, `target`, `__pycache__`, `.git`, `.svn`, `*[Tt]rash*`, `*_TO_TRASH_*`, `*.Trash*`, `*[Rr]ecycle*`

### Cloud Scan Roots

Optional cloud service scanning. Currently supports Notion.

```yaml
scanner_settings:
  cloud_scan_roots:
    - type: notion
      limit: 0                # Pages to scan (0 = disabled)
      incremental: false       # Only scan changes since last scan
      root: ""                 # Page/workspace ID (empty = all)
      api_key: ""              # Notion API key (ntn_ or secret_)
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Cloud service type (currently only `"notion"`) |
| `limit` | integer | Pages to scan per cycle (0 = disabled) |
| `incremental` | boolean | Only scan pages changed since last scan |
| `root` | string | Page or workspace ID to scope scanning (empty = all accessible) |
| `api_key` | string | API key for the service |

---

## 5. Anchor File Settings

Controls Electric Anchor — automatic processing of anchor markdown files. Config key: `anchor_file`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `page_width` | integer | 120 | Target line width for word-wrapping link blocks |
| `line_width_tolerance` | integer | 20 | Allow lines to exceed `page_width` by this many chars before reflowing |
| `prefer_wiki_links` | boolean | true | Use `[[wiki links]]` instead of `hook://` URLs |
| `yaml_desc_field` | string | `"desc"` | YAML front matter field name for descriptions |
| `create_front_matter` | boolean | true | Create YAML front matter if missing in anchor files |
| `breadcrumb_children` | string | `"auto"` | When to show child breadcrumbs: `auto`, `always`, or `never` |
| `breadcrumb_width` | integer | 0 | Line width for breadcrumb children wrapping (0 = no limit, all on one line) |
| `mark_broken_links` | boolean | false | Wrap broken `[[links]]` in `~~strikethrough~~` in user text |
| `obsidian_wiki_extensions` | string | `"pdf,png,jpg,..."` | Comma-separated file extensions that Obsidian can open via `[[wiki links]]` |
| `redirect_indicator` | string | *(regex)* | Regex pattern to detect redirect/delegation files |
| `file_update_delay` | integer | 15 | Seconds to wait after a non-trigger file edit before processing |
| `trigger_update_delay` | integer | 0 | Seconds to wait after a trigger change before processing (0 = immediate) |

- **`breadcrumb_children`** — Accepts `false`/`"never"` (never show), `true`/`"auto"` (show only when no link_block/link_list/broken_links triggers exist), or `"always"` (always show regardless of other triggers). Config key is `breadcrumb_children` (alias: `show_breadcrumb_children`).
- **`breadcrumb_width`** — When non-zero, overrides `page_width` specifically for breadcrumb children lines. When 0, all children appear on one line.
- **`line_width_tolerance`** — Provides slack before reflowing to reduce git diff noise. A line won't be reflowed unless it exceeds `page_width + line_width_tolerance`.
- **`file_update_delay`** — Resets on each new edit. Only processes after the user stops typing for this many seconds. Prevents processing mid-edit.
- **`obsidian_wiki_extensions`** — Default: `"pdf,png,jpg,jpeg,gif,svg,mp3,mp4,webm,wav,ogv,webp,xlsx,xls,docx,doc,pptx,ppt,csv,txt"`. Files with these extensions use `[[wiki link]]` format; others use `hook://` URLs.

### Triggers

Triggers define regex patterns that identify managed sections in anchor files. Each trigger has a `type` and a `trigger` pattern.

| Trigger Type | Purpose |
|-------------|---------|
| `breadcrumb` | Ancestor path line (e.g., `:>>`) |
| `link_block` | Free-form block of wiki links |
| `link_list` | Formatted list of child links with templates |
| `file_list` | Auto-generated file listing from anchor folder |
| `broken_links` | Section listing broken links |
| `terminator` | Pattern that ends managed content (e.g., triple blank line) |

#### Trigger Fields

| Field | Type | Applies To | Description |
|-------|------|-----------|-------------|
| `type` | string | all | Trigger type (see table above) |
| `trigger` | string | all | Regex pattern matching the section header |
| `item` | string | link_list, file_list | Template for each item (e.g., `"{smart_link} - {description}"`) |
| `match` | string | link_list | Regex to filter which children appear by command name |
| `reverse` | boolean | link_list | Reverse sort order (e.g., for reverse-chronological dated entries) |
| `separator` | string | link_list | Separator between items (default: newline). Use `", "` for inline lists |
| `display_file_extensions` | string | file_list | Per-trigger extension filter (overrides global `display_file_extensions`) |

#### Link List Item Templates

Item templates use `{variable}` syntax (single braces, not `{{double}}`):

| Variable | Description |
|----------|-------------|
| `{smart_link}` | Wiki link or hook:// URL depending on `prefer_wiki_links` setting |
| `{description}` | Command's description from YAML front matter |
| `{name}` | File name (used in file_list triggers) |

#### Default Triggers

```yaml
anchor_file:
  triggers:
    - type: breadcrumb
      trigger: "^:>>"

    # . __ . — all children
    - type: link_list
      trigger: '^\.\s__\s\.'
      item: "{smart_link} - {description}"

    # . -- . — non-numeric children only
    - type: link_list
      trigger: '^\.\s--\s\.'
      item: "{smart_link} - {description}"
      match: "^[^0-9]"

    # . == . — numeric children only, reverse chronological
    - type: link_list
      trigger: '^\.\s==\s\.'
      item: "{smart_link} - {description}"
      match: "^[0-9]"
      reverse: true

    # :-> — compact comma-separated, non-numeric
    - type: link_list
      trigger: '^:->'
      item: "{smart_link}"
      match: "^[^0-9]"
      separator: ", "

    # :=> — compact comma-separated, numeric, reverse
    - type: link_list
      trigger: '^:=>'
      item: "{smart_link}"
      match: "^[0-9]"
      reverse: true
      separator: ", "

    # Table variants (. __ ., . -- ., . == . inside markdown tables)
    - type: link_list
      trigger: '^\|\s*\.\s__\s\.\s*\|.*\n\|[-| ]+\|'
      item: "| {smart_link} | {description} |"

    # $ ls — list files in anchor folder
    - type: file_list
      trigger: '^\$\sls'
      item: "{name}"

    - type: broken_links
      trigger: "^Broken links:"

    - type: terminator
      trigger: '^\s*\n\s*\n\s*\n'
```

---

## 6. Actions & Templates

The action system defines all behaviors in HookAnchor — templates for creating commands, keyboard shortcuts, and command actions. This section covers two config keys that work together: `template_settings` for defaults and `actions` for the action definitions themselves.

### Action Settings

Controls default template selection when creating new commands. Config key: `template_settings` (planned rename to `action_settings`)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `default_anchor_template` | string | `"sub_markdown"` | Template used when an active anchor exists but no template is found in the hierarchy |
| `default_no_anchor_template` | string | `"sub_markdown"` | Template used when no active anchor is set |

### Actions

All action definitions. Config key: `actions`

Each action has a name (the YAML key) and a set of fields. Actions are stored internally as a flexible key-value map — any field can be added and accessed from JavaScript.

#### Common Action Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | What this action does |
| `action_type` | string | Behavior type (see Action Types below) |
| `key` | string | Optional keyboard binding (triggers from popup) |
| `arg_type` | string | What the `arg` contains: `"file"`, `"folder"`, or `"url"` |
| `close_popup` | boolean | Whether to close the popup after executing |

#### Action Types

Every command has an action type that determines what happens when it runs. Types marked **JS** are implemented in `config.js` and can be customized (see [Programmer's Reference § 2](PROGRAMMERS_REFERENCE.md#2-action-types)). Any unrecognized type dispatches to `config.js` as `action_<type>()`.

| Type | JS | Description |
|------|----|-------------|
| `1pass` | ✓ | Open 1Password Quick Access with search term |
| `alias` | | Execute another command by name |
| `anchor` | ✓ | Smart dispatch: infers type from argument and saves last anchor |
| `app` | | Launch or activate application |
| `chrome` | ✓ | Open URL in Chrome |
| `cmd` | ✓ | Execute shell command (`W` flag for Terminal window) |
| `console` | ✓ | Terminal modes: background, interactive (`I`), auto-close (`C`) |
| `contact` | ✓ | Search and open in Contacts app |
| `doc` | ✓ | Open document with default application |
| `edit` | ✓ | Open file in `$EDITOR` or default text editor |
| `folder` | ✓ | Open folder (resolves relative paths against vault root) |
| `insert` | ✓ | Type text directly from argument |
| `markdown` | ✓ | Open markdown file (Obsidian if in vault, else default app) |
| `noop` | | No operation (virtual anchors) |
| `notion` | ✓ | Open Notion page |
| `obsidian` | | Open file in Obsidian |
| `open_file` | | Open file with default application |
| `open_folder` | | Open folder in Finder |
| `open_url` | | Open URL in browser (`browser` param for specific browser) |
| `popup` | | Control popup: show, hide, toggle, navigate, etc. |
| `shell` | | Execute shell command |
| `slack` | ✓ | Navigate to Slack channel |
| `template` | | Create commands from templates |
| `text` | ✓ | Type text via keyboard simulation (reads from file) |
| `work` | ✓ | Open URL in Chrome Beta |

**Config.yaml wrapper actions** — These are defined in the `actions:` section as wrappers around base types. You can modify or add your own:

| Name | Base Type | Parameters |
|------|-----------|------------|
| `brave` | `open_url` | `browser: "Brave Browser"` |
| `firefox` | `open_url` | `browser: "Firefox"` |
| `obs_url` | `app` | `app: "Obsidian"` |
| `safari` | `open_url` | `browser: "Safari"` |
| `tmux` | `activate_tmux` | *(delegates to JS)* |
| `url` | `open_url` | *(default browser)* |

#### Template Action Fields

| Field | Type | Description |
|-------|------|-------------|
| `operations` | list | List of operations to perform (see Template Operations) |
| `edit` | boolean | Open editor dialog before saving |
| `use_existing` | boolean | Reference existing command if name matches |
| `grab` | integer | Grabber countdown seconds before capture |
| `file_rescan` | boolean | Rescan filesystem after creation |
| `validate_last_executed_folder` | boolean | Require the last executed command to have a folder |
| `lookup_anchor_template` | boolean | Look up template from anchor hierarchy instead of using this one |

#### Popup Action Fields

| Field | Type | Description |
|-------|------|-------------|
| `popup_action` | string | Popup command: `execute_command`, `navigate`, `show_history_viewer`, `activate_anchor`, `navigate_up_hierarchy`, `navigate_down_hierarchy`, `show_folder`, `show_keys`, `exit`, `force_load`, `force_rebuild`, `toggle_show_files`, `tmux`, `show_contact` |
| `dx` | integer | Horizontal navigation offset (for `navigate` action) |
| `dy` | integer | Vertical navigation offset (for `navigate` action) |
| `search` | string | Search text template (for `show_contact` action) |

#### Open URL Action Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | URL to open (supports `{{variables}}`) |
| `browser` | string | Browser application name (e.g., `"Google Chrome"`, `"Safari"`) |

#### Shell Action Fields

| Field | Type | Description |
|-------|------|-------------|
| `command` | string | Shell command to execute |
| `windowed` | boolean | Execute in a Terminal window instead of headless |

#### Text Action Fields

| Field | Type | Description |
|-------|------|-------------|
| `delay` | float | Seconds to wait before typing (default: 1.0) |

### Template Operations

Templates use an `operations` list to define what to create. Each operation has a `type` field.

#### Operation Types

| Type | Purpose | Fields |
|------|---------|--------|
| `command` | Create a new command | `name`, `action`, `arg`, `patch`, `flags`, `edit`, `use_existing` |
| `create` | Create a new file | `file`, `contents` |
| `append` | Append to existing file | `file`, `contents`, `after` |
| `clip` | Copy text to clipboard | `contents` |

- **`command`** — All string fields support `{{variable}}` expansion. The `flags` field can include `"A"` to mark the command as an anchor.
- **`create`** — Creates parent directories automatically. If the file already exists, it is overwritten.
- **`append`** — If `after` is specified, the content is inserted after the first line matching that text. If the `after` line isn't found, it is added first, then content appended below it.
- **`clip`** — Copies the expanded `contents` to the system clipboard.

#### Example: Multi-operation template

```yaml
add_paper_markdown:
  action_type: template
  key: "Cmd+Shift+P"
  edit: true
  operations:
    - type: create
      file: "~/papers/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
      contents: ""
    - type: command
      name: "{{date.year}}-{{date.month}}-{{date.day}} {{input}}"
      action: "markdown"
      arg: "~/papers/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
      patch: "Papers"
    - type: append
      file: "~/papers/Papers.md"
      after: "## Papers"
      contents: |
        - [[{{date.year}}-{{date.month}}-{{date.day}} {{input}}]]
    - type: clip
      contents: '[[{{date.year}}-{{date.month}}-{{date.day}} {{input}}]] '
```

### Template Variables

Templates use `{{expression}}` syntax with JavaScript evaluation. Variables are organized as objects:

#### `input` / `raw_input` (strings)

| Variable | Description |
|----------|-------------|
| `input` | User-typed text (with alias expansion in popup) |
| `raw_input` | Original text before alias expansion |

#### `selected` (command object)

The currently selected command in the popup.

| Property | Description |
|----------|-------------|
| `selected.name` | Command name |
| `selected.path` | File path (same as `arg`) |
| `selected.arg` | Alias for `path` |
| `selected.patch` | Patch/category name |
| `selected.action` | Action type (e.g., `"markdown"`, `"url"`) |
| `selected.flags` | Command flags (e.g., `"A"` for anchor) |
| `selected.folder` | Parent folder of path (throws error if empty) |

#### `last_executed` (command object)

The most recently executed command. Same properties as `selected`.

#### `last_anchor` (command object)

The most recently activated anchor. Same properties as `selected`. Persists for `anchor_timeout_seconds`.

#### `date` (date/time object)

| Property | Example | Description |
|----------|---------|-------------|
| `date.year` | `"2026"` | Four-digit year |
| `date.year2` | `"26"` | Two-digit year |
| `date.month` | `"02"` | Zero-padded month |
| `date.month_short` | `"2"` | Month without padding |
| `date.month_name` | `"February"` | Full month name |
| `date.month_abbr` | `"Feb"` | Abbreviated month name |
| `date.day` | `"04"` | Zero-padded day |
| `date.day_short` | `"4"` | Day without padding |
| `date.weekday` | `"Tuesday"` | Full weekday name |
| `date.weekday_abbr` | `"Tue"` | Abbreviated weekday |
| `date.hour` | `"14"` | 24-hour format, zero-padded |
| `date.hour12` | `"2"` | 12-hour format |
| `date.minute` | `"30"` | Zero-padded minute |
| `date.second` | `"05"` | Zero-padded second |
| `date.ampm` | `"PM"` | AM or PM |
| `date.timestamp` | `1738682400` | Unix timestamp (number) |
| `date.iso` | `"2026-02-04T14:30:05"` | ISO 8601 format |

#### `grabbed` (grabber context object)

Available after a grab operation (when template has `grab` field set).

| Property | Description |
|----------|-------------|
| `grabbed.action` | Captured action type (e.g., `"url"`, `"folder"`) |
| `grabbed.arg` | Captured argument (URL, path, etc.) |
| `grabbed.app` | Application name that was captured |
| `grabbed.title` | Window title of captured app |
| `grabbed.text` | Selected text (if available) |
| `grabbed.suffix` | Suffix from grabber_suffix_map match |

#### `env` (environment object)

| Property | Description |
|----------|-------------|
| `env.home` | Home directory path |
| `env.user` | Username |
| `env.hostname` | Machine hostname |
| `env.os` | Operating system (e.g., `"macos"`) |
| `env.config_dir` | HookAnchor config directory path |

#### JavaScript Expressions

Template expressions are full JavaScript. Examples:

```yaml
name: "{{input.toUpperCase()}}"
arg: "{{last_executed.folder}}/{{input}}.md"
name: "{{date.year}}-{{date.month}} {{input}}"
contents: "Created by {{env.user}} on {{date.iso}}"
```

### Key Format

Keys can be specified as:
- **Single characters**: `"a"`, `"1"`, `"/"`, `"="`, `"'"`, `"!"`, `"*"`, `">"`, `"+"`
- **Special keys**: `"Escape"`, `"Enter"`, `"Tab"`, `"Delete"`
- **Arrow keys**: `"ArrowUp"`, `"ArrowDown"`, `"ArrowLeft"`, `"ArrowRight"`
- **Named keys**: `"Backtick"`, `"Plus"`, `"Minus"`
- **With modifiers**: `"Cmd+D"`, `"Cmd+Shift+P"`, `"Cmd+F"`, `"Cmd+/"`, `"Cmd+Shift+2"`

---

## 7. Grabber Rules

Rules for capturing context from the active application to create new commands. Config key: `grabber_rules`

Each rule is evaluated in order. The first rule whose `matcher` returns a non-null value wins.

### Rule Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Rule display name |
| `matcher` | string | JavaScript expression returning captured value or `null` |
| `action` | string | Action type for the created command |
| `group` | string | Patch/group for the created command |

### Matcher Context

Variables available in matcher expressions:

| Variable | Description |
|----------|-------------|
| `bundleId` | Application bundle identifier (e.g., `"com.google.Chrome"`) |
| `app` | Application display name |
| `title` | Window title |
| `props.url` | Current URL (browsers) |
| `props.selection` | Selected file path (Finder) |
| `props.path` | Current directory path (Finder) |
| `props.recommendedAction` | Suggested action type based on selection (e.g., `"folder"`, `"anchor"`, `"markdown"`) |
| `props.channel` | Channel name (Slack) |

### Grabber Suffix Map

Optional mapping from regex patterns to command name suffixes. Config key: `grabber_suffix_map`

```yaml
grabber_suffix_map:
  "@github": "github\\.com"
  "@docs": "docs\\.google\\.com"
  "@stack": "stackoverflow\\.com"
```

When a grabbed URL matches a pattern, the corresponding suffix is appended to the command name.

---

## Configuration File Location

The config file is at `~/.config/hookanchor/config.yaml`. HookAnchor creates it with defaults on first run. A companion JavaScript file at `~/.config/hookanchor/config.js` defines custom action functions.

Environment variables can be used in config values with `${VAR_NAME}` syntax (e.g., `${HOME}`). Tilde (`~`) is expanded in path fields.
