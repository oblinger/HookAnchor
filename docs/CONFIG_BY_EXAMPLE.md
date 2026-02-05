# HookAnchor Configuration by Example

Practical examples organized by config file section. Each section starts with a table of contents linking to its examples.

See the [Configuration Reference](CONFIG_REFERENCE.md) for the complete field-by-field guide.

## Sections

1. [Popup Settings](#1-popup-settings)
2. [Launcher Settings](#2-launcher-settings)
3. [History Viewer](#3-history-viewer)
4. [Scanner Settings](#4-scanner-settings) 
5. [Anchor File Settings](#5-anchor-file-settings)
6. [Actions & Templates](#6-actions--templates)
7. [Grabber Rules](#7-grabber-rules)

---

## 1. Popup Settings

| # | Example | What it shows |
|---|---------|---------------|
| 1 | [Minimal Startup](#1-1-minimal-startup) | Smallest useful popup config |
| 2 | [Large Grid Display](#1-2-large-grid-display) | Many rows and columns for power users |
| 3 | [Compact Popup](#1-3-compact-popup) | Minimal screen footprint |
| 4 | [Custom Editor Actions](#1-4-custom-editor-actions) | Building the action type dropdown |
| 5 | [Rename Cascade](#1-5-rename-cascade) | Propagating renames to docs, folders, and patches |
| 6 | [Developer Machine](#1-6-developer-machine) | Hostname-based dev mode with verbose logging |
### 1-1 Minimal Startup

The smallest useful config. Set a hotkey, enable background mode for instant activation, and let everything else default.

```yaml
popup_settings:
  global_hotkey: "Option+Space"
  run_in_background: true
```

Everything else — rows, columns, timeouts, window size — uses sensible defaults. This is enough to get started.

### 1-2 Large Grid Display

For power users with hundreds of commands. More rows and columns mean less scrolling.

```yaml
popup_settings:
  max_rows: 25
  max_columns: 4
  max_characters: 35
  max_window_size: "1900x1200"
  default_window_size: "800x600"
```

- `max_characters: 35` gives command names a bit more room before truncating
- `max_window_size` caps the window even on large monitors
- `default_window_size` sets the initial size before the popup auto-sizes to content

### 1-3 Compact Popup

For users who want minimal screen disruption. Small window, few results, quick auto-hide.

```yaml
popup_settings:
  max_rows: 10
  max_columns: 2
  default_window_size: "400x300"
  idle_timeout_seconds: 15
```

The short `idle_timeout_seconds` means the popup disappears quickly if you get distracted.

### 1-4 Custom Editor Actions

When you edit a command in the popup, a dropdown shows the available action types. The `listed_actions` field controls which types appear in that dropdown. Build a list with all the types you actually use (see [Action Types](PROGRAMMERS_REFERENCE.md#4-action-types) for a complete list of built-in and JavaScript action types):

```yaml
popup_settings:
  listed_actions: >
    alias,app,console,doc,edit,folder,insert,markdown,text,tmux,
    1pass,contact,notion,obs_url,slack,
    url,brave,chrome,firefox,safari,work
```

The `>` YAML block scalar lets you split a long comma-separated list across lines for readability. It folds into a single line.

This example includes all the common action types: general-purpose types (`alias`, `app`, `folder`, `markdown`, `doc`), text insertion (`insert`, `text`), developer tools (`console`, `tmux`), browsers (`url`, `brave`, `chrome`, `firefox`, `safari`, `work`), and integrations (`1pass`, `contact`, `notion`, `obs_url`, `slack`). Add or remove types based on what you use. To create your own action types in JavaScript, see [Writing Custom Actions](PROGRAMMERS_REFERENCE.md#5-writing-custom-actions).

### 1-5 Rename Cascade

When you rename a command in the popup editor, HookAnchor can propagate the change to the underlying files and related commands. Enable all four flags for full cascade:

```yaml
popup_settings:
  rename_doc: true
  rename_folder: true
  rename_patch: true
  rename_prefix: true
```

**Example**: You rename command "Project Alpha" to "Project Beta":

- **`rename_doc`** — If the underlying document is `Project Alpha.md` (matching the old command name), it gets renamed to `Project Beta.md`. Only renames when the filename matched the command name before the change.
- **`rename_folder`** — If the anchor folder is `Project Alpha/`, it gets renamed to `Project Beta/`. Again, only renames when the folder name matched the old command name.
- **`rename_patch`** — All commands in the "Project Alpha" group get their group updated to "Project Beta"
- **`rename_prefix`** — Commands like "Project Alpha Notes" that start with the old name get updated to "Project Beta Notes"

### 1-6 Developer Machine

Enable detailed logging and developer features only on your dev machine, identified by hostname:

```yaml
popup_settings:
  developer_mode: "Daniels-MacBook-Pro.local"
  verbose_logging: true
  show_command_server_terminal: false
  max_log_file_size: 10000000
  skip_permissions_check: true
```

- **`developer_mode`** with a hostname string activates dev features only on that machine. The same config file works on other machines without dev behavior.
- **`max_log_file_size: 10000000`** (10MB) gives more log history for debugging before auto-clearing
- **`skip_permissions_check`** skips the Accessibility permission dialog on startup — useful when you've already granted permissions

---

## 2. Launcher Settings

| # | Example | What it shows |
|---|---------|---------------|
| 1 | [Obsidian Vault Setup](#2-1-obsidian-vault-setup) | Wiki link resolution and markdown launching |
| 2 | [Grabber Focus Flip](#2-2-grabber-focus-flip) | Auto-switching focus during grab countdown |
| 3 | [Tmux Integration](#2-3-tmux-integration) | JavaScript tmux activation with startup command |
| 4 | [Extended JS Timeout](#2-4-extended-js-timeout) | More time for slow JavaScript actions |

### 2-1 Obsidian Vault Setup

Configure the Obsidian vault so HookAnchor can open markdown files in Obsidian and resolve wiki links correctly:

```yaml
launcher_settings:
  obsidian_app_name: "Obsidian"
  obsidian_vault_name: "ob"
  obsidian_vault_path: "~/ob"
```

- **`obsidian_vault_name`** must match the vault name in Obsidian's vault switcher
- **`obsidian_vault_path`** is the filesystem path to the vault root (tilde is expanded)
- When a `markdown` command is executed, HookAnchor opens the file via `obsidian://open?vault=ob&file=...`

### 2-2 Grabber Focus Flip

When grabbing, the grabber needs to see the target application. With `flip_focus`, HookAnchor automatically switches focus during the countdown:

```yaml
launcher_settings:
  flip_focus: true
```

**Without `flip_focus`**: You press the grab key, then manually switch to the target app during the countdown.

**With `flip_focus`**: HookAnchor flips to the previous app automatically so the grabber can read its context.

### 2-3 Tmux Integration

Launch a tmux session for any anchor folder, with a startup command that runs in the new session:

```yaml
launcher_settings:
  use_javascript_tmux_activation: "true"
  tmux_startup_command: "claude --continue --dangerously-skip-permissions"
```

When you press the tmux key (`;` by default) on an anchor, HookAnchor creates or attaches to a tmux session named after the anchor, `cd`s to its folder, and runs the startup command.

### 2-4 Extended JS Timeout

Custom JavaScript actions that make network calls or process large datasets may need more than the default 5-second timeout:

```yaml
launcher_settings:
  js_timeout_ms: 15000
```

If a JavaScript action exceeds this timeout, it's killed and an error is logged.

---

## 3. History Viewer

| # | Example | What it shows |
|---|---------|---------------|
| 1 | [Default Setup](#3-1-default-setup) | Standard viewer with all features |
| 2 | [Compact Sidebar](#3-2-compact-sidebar) | Narrow sidebar for small screens |
| 3 | [Custom Edit Key](#3-3-custom-edit-key) | Changing the edit key binding |

### 3-1 Default Setup

The history viewer works well with defaults:

```yaml
history_viewer:
  viewable_history_limit: 50000
  tree_sidebar_width: 250
  tree_show_guides: true
  peek_on_hover: true
```

- **`peek_on_hover`** shows command details when you hover over tree items
- **`tree_show_guides`** draws indent lines in the tree for visual hierarchy

### 3-2 Compact Sidebar

For smaller screens, narrow the sidebar and reduce indent:

```yaml
history_viewer:
  tree_sidebar_width: 150
  tree_sidebar_min_width: 30
  tree_indent_pixels: 6
```

### 3-3 Custom Edit Key

Change which key opens the editor for the selected history item:

```yaml
history_viewer:
  key_bindings:
    edit_selection: "e"
```

Default is `";"`. Any single character works.

---

## 4. Scanner Settings

| # | Example | What it shows |
|---|---------|---------------|
| 1 | [Single Directory Scan](#4-1-single-directory-scan) | Simplest scanning setup |
| 2 | [Multiple Scan Roots](#4-2-multiple-scan-roots) | Scanning vault + applications |
| 3 | [Custom Document Extensions](#4-3-custom-document-extensions) | Controlling which file types become commands and which appear in listings |
| 4 | [Development Skip Patterns](#4-4-development-skip-patterns) | Excluding build artifacts |
| 5 | [Personal Organization Skips](#4-5-personal-organization-skips) | Excluding archives, backups, and specific files |
| 6 | [Realtime Watch Tuning](#4-6-realtime-watch-tuning) | Adjusting file watcher performance |
| 7 | [Notion Cloud Scanning](#4-7-notion-cloud-scanning) | Cloud document discovery via API |

### 4-1 Single Directory Scan

The simplest setup — scan one directory:

```yaml
scanner_settings:
  file_roots: ["~/Documents"]
  scan_interval_seconds: 600
```

HookAnchor recursively scans `~/Documents` every 10 minutes for markdown files (which become commands) and document files (PDFs, Word docs, etc.).

### 4-2 Multiple Scan Roots

Scan your vault for documents and `/Applications` for app commands:

```yaml
scanner_settings:
  file_roots: ["~/ob", "/Applications"]
  anchor_tree_root: "~/anchors"
  delete_broken_aliases: true
```

- **`anchor_tree_root`** is where the anchor tree folder structure is maintained
- **`delete_broken_aliases`** automatically cleans up aliases that point to commands that no longer exist

### 4-3 Custom Document Extensions

Control which file types the scanner picks up, and which appear in anchor file `$ ls` listings:

```yaml
scanner_settings:
  doc_file_extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf,pages,numbers,csv,html,htm,key"
  display_file_extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf,pages,numbers,csv,html,htm,md"
```

- **`doc_file_extensions`** — Files with these extensions generate DOC-type commands during scanning. Add `csv,html,htm` if you want those discoverable.
- **`display_file_extensions`** — Controls what appears in `$ ls` file list triggers in anchor files. Here it includes `md` so markdown files also show in listings, even though they're scanned as markdown commands, not DOC commands.

If `display_file_extensions` is not set, it defaults to `doc_file_extensions`.

### 4-4 Development Skip Patterns

Exclude common build artifacts and dependency directories:

```yaml
scanner_settings:
  skip_patterns:
    - "**/node_modules/**"
    - "**/target/**"
    - "**/__pycache__/**"
    - "**/.git/**"
    - "**/.svn/**"
    - "**/build/**"
    - "**/dist/**"
```

Patterns use glob syntax. `**/` matches any directory depth.

### 4-5 Personal Organization Skips

Exclude archived content, backup directories, temporary files, and specific filenames you never want as commands:

```yaml
scanner_settings:
  skip_patterns:
    - "**/.*/**"                       # All hidden folders
    - "**/Yore/**"                     # Historical/archived content
    - "**/*backups*/**"                # Backup directories
    - "*[Tt]rash*"                     # Trash folders
    - "*_TO_TRASH_*"                   # Items staged for deletion
    - "**/_history/**"                 # History directories
    - "**/CLAUDE.md"                   # Claude Code config files
    - "**/README.md"                   # README files
    - "~/ob/_temp_links/**"            # Temporary symlink directory
    - "~/ob/T/Career/NJ/AI Job Search/outputs/**"  # Specific output directories
```

You can mix broad patterns (`**/.*/**` for all hidden folders) with specific paths (`~/ob/_temp_links/**`). Patterns apply to both files and directories.

### 4-6 Realtime Watch Tuning

The realtime watcher detects `.md` file changes and processes anchor files automatically. Tune it for your workflow:

```yaml
scanner_settings:
  realtime_watch: true
  realtime_debounce_ms: 500
  self_write_suppress_ms: 1000
```

- **`realtime_debounce_ms: 500`** — Waits 500ms after the last file change event before processing. Prevents redundant processing when editors do rapid save-write-save cycles.
- **`self_write_suppress_ms: 1000`** — After HookAnchor writes an anchor file, it ignores changes to that file for 1 second. Prevents infinite loops where a write triggers a re-process.

For large vaults where the watcher causes performance issues:

```yaml
scanner_settings:
  realtime_watch: false
  scan_interval_seconds: 300
```

This disables realtime watching and relies on periodic scanning every 5 minutes instead.

### 4-7 Notion Cloud Scanning

Connect to Notion's API to discover pages as HookAnchor commands:

```yaml
scanner_settings:
  cloud_scan_roots:
    - type: notion
      limit: 100
      incremental: true
      root: ""
      api_key: "ntn_your_api_key_here"
```

- **`limit: 100`** scans up to 100 pages per cycle. Set to `0` to disable without removing the config.
- **`incremental: true`** only scans pages modified since the last scan, which is much faster for large workspaces.
- **`root: ""`** scans all accessible pages. Set to a page ID to scope scanning to one workspace area.

See [Cloud Scan Roots](PROGRAMMERS_REFERENCE.md#7-cloud-scan-roots) in the Programmer's Reference for setup instructions.

---

## 5. Anchor File Settings

| # | Example | What it shows |
|---|---------|---------------|
| 1 | [Basic Anchor File](#5-1-basic-anchor-file) | Breadcrumbs and a simple link list |
| 2 | [Named vs Dated Split](#5-2-named-vs-dated-split) | Two lists with filtering and reverse sort |
| 3 | [Table-Format Link List](#5-3-table-format-link-list) | Children rendered as a markdown table |
| 4 | [Compact Filtered Inline List](#5-4-compact-filtered-inline-list) | Comma-separated, filtered to a subset |
| 5 | [Typed File Listing](#5-5-typed-file-listing) | File listing filtered to specific types |
| 6 | [Broken Link Detection](#5-6-broken-link-detection) | Inline strikethrough + broken links section |
| 7 | [Formatting and Delays](#5-7-formatting-and-delays) | Line width, breadcrumb width, and processing timing |
| 8 | [Custom Trigger Patterns](#5-8-custom-trigger-patterns) | Writing a project-specific trigger |

### 5-1 Basic Anchor File

The simplest anchor setup: a breadcrumb showing the path to the root, and a link list showing all children with descriptions.

**Config:**

```yaml
anchor_file:
  prefer_wiki_links: true
  triggers:
    - type: breadcrumb
      trigger: "^:>>"
    - type: link_list
      trigger: '^\.\s__\s\.'
      item: "{smart_link} - {description}"
    - type: terminator
      trigger: '^\s*\n\s*\n\s*\n'
```

**In the anchor file, you write:**

```markdown
:>>

. __ .
```

**HookAnchor fills in:**

```markdown
:>> [[Root]] / [[Parent]] / [[This Anchor]]

. __ .
[[Child One]] - Description of child one
[[Child Two]] - Description of child two
[[Child Three]] - Description of child three
```

The content between the trigger line and the terminator (triple blank line) is managed automatically. Everything outside that region is your own text.

### 5-2 Named vs Dated Split

Split children into two lists: named entries (alphabetical) and dated entries (reverse chronological). This is useful for anchors that have both permanent sub-topics and time-stamped notes.

**Config (triggers):**

```yaml
    # . -- . — named children only (no leading digit)
    - type: link_list
      trigger: '^\.\s--\s\.'
      item: "{smart_link} - {description}"
      match: "^[^0-9]"

    # . == . — dated children only, newest first
    - type: link_list
      trigger: '^\.\s==\s\.'
      item: "{smart_link} - {description}"
      match: "^[0-9]"
      reverse: true
```

**In the anchor file:**

```markdown
## Topics
. -- .

## Timeline
. == .
```

**Result:**

```markdown
## Topics
. -- .
[[Architecture]] - System design docs
[[Testing]] - Test coverage plans

## Timeline
. == .
[[2026-02-04 Sprint Review]] - Q1 sprint review notes
[[2026-01-28 Kickoff]] - Project kickoff meeting
[[2026-01-15 Planning]] - Initial planning session
```

- **`match: "^[^0-9]"`** shows only children whose names start with a non-digit
- **`match: "^[0-9]"`** shows only children whose names start with a digit
- **`reverse: true`** flips the sort order so newest dates appear first

### 5-3 Table-Format Link List

Render children as a markdown table instead of a bullet list. The trigger pattern matches a table header.

**Config (trigger):**

```yaml
    - type: link_list
      trigger: '^\|\s*\.\s__\s\.\s*\|.*\n\|[-| ]+\|'
      item: "| {smart_link} | {description} |"
```

**In the anchor file:**

```markdown
| . __ . | Description |
|--------|-------------|
```

**Result:**

```markdown
| . __ . | Description |
|--------|-------------|
| [[Architecture]] | System design docs |
| [[Testing]] | Test coverage plans |
| [[Deployment]] | Release process |
```

The trigger regex matches the header row containing `. __ .` followed by a separator row. Table-format triggers also work with `. -- .` and `. == .` patterns for filtered/sorted tables.

### 5-4 Compact Filtered Inline List

Render a subset of children as a comma-separated line. Useful for navigation breadcrumbs or compact reference lists.

**Config (triggers):**

```yaml
    # :-> — compact, non-numeric children only
    - type: link_list
      trigger: '^:->'
      item: "{smart_link}"
      match: "^[^0-9]"
      separator: ", "

    # :=> — compact, numeric children, newest first
    - type: link_list
      trigger: '^:=>'
      item: "{smart_link}"
      match: "^[0-9]"
      reverse: true
      separator: ", "
```

**In the anchor file:**

```markdown
Topics: :->

Recent: :=>
```

**Result:**

```markdown
Topics: :->
[[Architecture]], [[Deployment]], [[Testing]]

Recent: :=>
[[2026-02-04 Sprint Review]], [[2026-01-28 Kickoff]], [[2026-01-15 Planning]]
```

The `separator: ", "` joins items on one line instead of one per line. Combined with `match`, you get a compact filtered view.

You can use `match` with any regex. For example, to show only entries containing "API":

```yaml
    - type: link_list
      trigger: '^API links:'
      item: "{smart_link}"
      match: "API"
      separator: ", "
```

### 5-5 Typed File Listing

List files in the anchor's folder, filtered to specific types. Useful for surfacing spreadsheets, presentations, or other non-markdown files alongside your anchor content.

**Config (trigger):**

```yaml
    # $ ls — all displayable files
    - type: file_list
      trigger: '^\$\sls'
      item: "{name}"

    # $ xl — only Excel and PowerPoint files
    - type: file_list
      trigger: '^\$\sxl'
      item: "{name}"
      display_file_extensions: "xlsx,xls,pptx,ppt"
```

**In the anchor file:**

```markdown
## Spreadsheets
$ xl
```

**Result:**

```markdown
## Spreadsheets
$ xl
Q1 Budget.xlsx
Revenue Forecast.xlsx
Team Roadmap.pptx
```

- The trigger pattern `^\$\sxl` is a custom symbol you choose — it just needs to be a unique regex
- **`display_file_extensions`** on the trigger overrides the global `display_file_extensions` setting, so this trigger only shows Excel and PowerPoint files
- The default `$ ls` trigger (without per-trigger extensions) shows all file types from the global `display_file_extensions` list

### 5-6 Broken Link Detection

Two complementary features for finding broken `[[wiki links]]`:

```yaml
anchor_file:
  mark_broken_links: true
  triggers:
    # ... other triggers ...
    - type: broken_links
      trigger: "^Broken links:"
```

**Inline marking** (`mark_broken_links: true`): Broken links in your text get wrapped in `~~strikethrough~~` automatically. When you fix them (create the missing command), the strikethrough is removed on the next update.

```markdown
See also ~~[[Nonexistent Topic]]~~ and [[Valid Topic]].
```

**Broken links section**: Lists all broken links found in the file in a dedicated section.

```markdown
Broken links:
[[Nonexistent Topic]]
```

You can use either or both. Inline marking is useful for seeing problems in context. The section gives a consolidated list.

### 5-7 Formatting and Delays

Control how HookAnchor formats output and when it processes changes.

**Line width:**

```yaml
anchor_file:
  page_width: 120
  line_width_tolerance: 20
  breadcrumb_width: 0
```

- **`page_width: 120`** — Target line width for link blocks and wrapped lists
- **`line_width_tolerance: 20`** — A line won't be reflowed unless it exceeds 140 characters (120 + 20). This slack reduces git diff noise from minor edits.
- **`breadcrumb_width: 0`** — All breadcrumb children on one line regardless of length. Set to a non-zero value (e.g., `80`) to wrap breadcrumb children.

**Processing timing:**

```yaml
anchor_file:
  file_update_delay: 15
  trigger_update_delay: 0
```

- **`file_update_delay: 15`** — After you edit an anchor file, HookAnchor waits 15 seconds of inactivity before processing. Each new edit resets the timer. This prevents processing while you're actively typing.
- **`trigger_update_delay: 0`** — Changes to trigger content (adding/removing the trigger line itself) are processed immediately.

For frequently-edited files where 15 seconds feels too aggressive, increase `file_update_delay` to 30 or 60.

### 5-8 Custom Trigger Patterns

You can define your own trigger patterns for project-specific sections. A trigger needs: a unique regex, an item template, and optionally a match filter.

**Example: A "Resources" section showing only children with "Ref" in their name, displayed as links without descriptions:**

```yaml
    - type: link_list
      trigger: '^## Resources'
      item: "- {smart_link}"
      match: "Ref"
```

**In the anchor file:**

```markdown
## Resources
```

**Result:**

```markdown
## Resources
- [[API Ref]]
- [[Style Ref]]
- [[Config Ref]]
```

**Example: A status dashboard showing all children in a custom table format:**

```yaml
    - type: link_list
      trigger: '^\|\s*Status\s*\|.*\n\|[-| ]+\|'
      item: "| {smart_link} | {description} |"
```

The trigger regex must match something unique in your file. Use section headers (`^## Resources`), custom symbols (`^:->`, `^$ xl`), or table headers as trigger patterns.

---

## 6. Actions & Templates

| # | Example | What it shows |
|---|---------|---------------|
| | **Getting Started** | |
| 1 | [Simple Child Creation](#6-1-simple-child-creation) | Creating a markdown file under the current context |
| 2 | [Dated Child Entry](#6-2-dated-child-entry) | Using date variables for timestamped entries |
| 3 | [Sub-Anchor Creation](#6-3-sub-anchor-creation) | Creating a subfolder with an anchor file |
| | **Key Features** | |
| 4 | [Grab and Create](#6-4-grab-and-create) | Capturing app context and creating a command |
| 5 | [Multi-Operation Template](#6-5-multi-operation-template) | All four operation types in one template |
| 6 | [Edit Existing Command](#6-6-edit-existing-command) | Modifying a command in place |
| 7 | [Create Alias](#6-7-create-alias) | Creating an alias to another command |
| | **Command Actions** | |
| 8 | [Browser Actions](#6-8-browser-actions) | Opening URLs in specific browsers |
| 9 | [Command Actions](#6-9-command-actions) | How commands reference action definitions |
| 10 | [Text Action with Delay](#6-10-text-action-with-delay) | Typing text with custom timing |
| | **Popup Controls** | |
| 11 | [Popup Navigation Keys](#6-11-popup-navigation-keys) | Keyboard shortcuts for popup control |
| | **Advanced** | |
| 12 | [Dynamic Template Lookup](#6-12-dynamic-template-lookup) | Adapting templates to the current anchor |
| 13 | [Custom JavaScript Action](#6-13-custom-javascript-action) | Calling JavaScript functions from actions |
| 14 | [Sibling vs Child](#6-14-sibling-vs-child) | `last_executed` vs `last_anchor` folder context |

### 6-1 Simple Child Creation

Create a markdown file inside the last-executed command's folder. In the popup, first execute a parent command (navigate to it and press Enter), then press `!` to trigger this template, type a name, and press Enter. This is the most common template pattern — it creates a new item as a child of whatever command you just ran.

```yaml
actions:
  child_create_default:
    description: "Create markdown child of current context"
    action_type: template
    key: "!"
    edit: true
    validate_last_executed_folder: true
    operations:
      - type: create
        file: "{{last_executed.folder}}/{{input}}.md"
        contents: ""
      - type: command
        name: "{{input}}"
        action: "markdown"
        arg: "{{last_executed.folder}}/{{input}}.md"
        patch: "{{last_executed.name}}"
      - type: clip
        contents: '[[{{input}}]] '
```

- **`key: "!"`** — Press `!` in the popup to trigger this template
- **`edit: true`** — Opens the editor dialog so you can type the name and review before creating
- **`validate_last_executed_folder: true`** — Shows an error if the last-executed command doesn't have a folder (e.g., it's a URL command)
- **`patch: "{{last_executed.name}}"`** — The new command is grouped under the parent, making it appear as a child in the hierarchy
- The `clip` operation copies a wiki link to the clipboard so you can paste it immediately

### 6-2 Dated Child Entry

Create a timestamped entry using date variables. In the popup, first navigate to a parent command (like "My Project") and execute it, then press Cmd+D, type a name, and press Enter.

```yaml
  child_dated_markdown:
    description: "Create dated markdown child"
    action_type: template
    key: "Cmd+D"
    edit: true
    operations:
      - type: create
        file: "{{last_executed.folder}}/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
        contents: ""
      - type: command
        name: "{{date.year}}-{{date.month}}-{{date.day}} {{input}}"
        action: "markdown"
        arg: "{{last_executed.folder}}/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
        patch: "{{last_executed.name}}"
```

For example, if you type "Sprint Review" and press Cmd+D on February 4, 2026, this creates:
- File: `My Project/2026-02-04 Sprint Review.md` (inside the last-executed command's folder)
- Command name: `2026-02-04 Sprint Review` (grouped under "My Project")

This date-prefixed naming is designed to work well with the `. == .` anchor trigger, which does a reverse chronological sort of numeric entries — newest entries automatically appear at the top of the list in the anchor file.

### 6-3 Sub-Anchor Creation

Create a new subfolder with its own anchor file. The `"A"` flag marks the new command as an anchor.

```yaml
  create_sub_anchor:
    description: "Create anchor subfolder"
    action_type: template
    key: "Cmd+F"
    edit: true
    validate_last_executed_folder: true
    operations:
      - type: create
        file: "{{last_executed.folder}}/{{input}}/{{input}}.md"
        contents: |
          .[[{{input}}]].  >[[{{last_executed.name}}]]
      - type: command
        name: "{{input}}"
        action: "markdown"
        arg: "{{last_executed.folder}}/{{input}}/{{input}}.md"
        patch: "{{last_executed.name}}"
        flags: "A"
```

- **`flags: "A"`** marks the command as an anchor, so it gets breadcrumbs and managed link lists
- The `create` operation makes a new folder and populates the anchor file with initial content
- The initial content includes a self-link (`. [[name]] .`) and a parent redirect (`>[[parent]]`)

### 6-4 Grab and Create

Capture context from the currently active application, then create a command from it:

```yaml
  grab:
    description: "Capture window/app and create command"
    action_type: template
    key: "*"
    grab: 5
    edit: true
    operations:
      - type: command
        name: "{{input}}"
        action: "{{grabbed.action}}"
        arg: "{{grabbed.arg}}"
```

- **`grab: 5`** starts a 5-second countdown. During the countdown, switch to the app you want to capture (or use `flip_focus` to do it automatically).
- After the countdown, the grabber reads the active app's context (URL, file path, window title) using the grabber rules.
- **`grabbed.action`** and **`grabbed.arg`** are filled in by the matching grabber rule.
- **`edit: true`** lets you name the command before saving.

### 6-5 Multi-Operation Template

A complete workflow using all four operation types. This creates a paper entry, adds it to an index, and copies a wiki link:

```yaml
  add_paper_markdown:
    description: "Create new paper entry"
    action_type: template
    key: "Cmd+Shift+P"
    edit: true
    operations:
      # 1. Create the markdown file
      - type: create
        file: "~/papers/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
        contents: ""

      # 2. Create the command
      - type: command
        name: "{{date.year}}-{{date.month}}-{{date.day}} {{input}}"
        action: "markdown"
        arg: "~/papers/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
        patch: "Papers"

      # 3. Add entry to the index file
      - type: append
        file: "~/papers/Papers.md"
        after: "## Papers"
        contents: |
          - [[{{date.year}}-{{date.month}}-{{date.day}} {{input}}]]

      # 4. Copy wiki link to clipboard
      - type: clip
        contents: '**"[[{{date.year}}-{{date.month}}-{{date.day}} {{input}}]]"** '
```

The `append` operation inserts the new entry after the `## Papers` heading. If the heading doesn't exist, it adds it first. This keeps the index automatically updated.

### 6-6 Edit Existing Command

Open the editor pre-filled with the currently selected command's data, allowing you to modify any field:

```yaml
  edit_selection:
    description: "Edit selected command"
    action_type: template
    key: "'"
    edit: true
    use_existing: true
    operations:
      - type: command
        name: "{{selected.name}}"
        action: "{{selected.action}}"
        arg: "{{selected.arg}}"
        patch: "{{selected.patch}}"
        flags: "{{selected.flags}}"
```

- **`use_existing: true`** means if a command with this name already exists, it updates the existing command instead of creating a duplicate
- The `selected.*` variables provide the current values of the highlighted command in the popup

### 6-7 Create Alias

Create a shortcut command that resolves to another command:

```yaml
  create_alias:
    description: "Create alias to last executed command"
    action_type: template
    key: ">"
    edit: true
    operations:
      - type: command
        name: "{{input}}"
        action: "alias"
        arg: "{{last_executed.name}}"
```

The new command has action type `alias` and its arg points to the target command's name. When executed, HookAnchor resolves the alias and runs the target command.

### 6-8 Browser Actions

Define action types that open URLs in specific browsers. Each browser gets its own action name:

```yaml
  chrome:
    description: "Open URL in Google Chrome"
    action_type: open_url
    arg_type: url
    browser: "Google Chrome"
    url: "{{arg}}"

  safari:
    description: "Open URL in Safari"
    action_type: open_url
    arg_type: url
    browser: "Safari"
    url: "{{arg}}"

  brave:
    description: "Open URL in Brave Browser"
    action_type: open_url
    arg_type: url
    browser: "Brave Browser"
    url: "{{arg}}"

  work:
    description: "Open URL in work browser"
    action_type: open_url
    arg_type: url
    browser: "Google Chrome Beta"
    url: "{{arg}}"
```

- **`arg_type: url`** tells HookAnchor the command's arg is a URL (used for display and validation)
- Commands in `commands.txt` reference these by name: a command with `action: chrome` and `arg: https://github.com` opens that URL in Chrome
- The `work` action routes to a separate browser profile for work URLs

### 6-9 Command Actions

These action definitions are used by commands stored in `commands.txt`. Each defines how a particular action type behaves:

```yaml
  folder:
    description: "Open folder in Finder"
    action_type: folder
    arg_type: folder

  markdown:
    description: "Open markdown in Obsidian"
    action_type: markdown
    arg_type: file

  cmd:
    description: "Execute shell command"
    action_type: cmd

  text:
    description: "Type text into active app"
    action_type: text
    arg_type: file

  alias:
    description: "Alias to another command"
    action_type: alias
    target: "{{arg}}"
```

When a command has `action: folder`, HookAnchor looks up the `folder` action definition above to know how to execute it. The `arg_type` field helps HookAnchor understand what the arg contains for display and validation purposes.

### 6-10 Text Action with Delay

The `text` action types text into the active application. Custom delay variants control how long to wait before typing:

```yaml
  text_slow:
    action_type: text
    description: "Type text with 2 second delay"
    delay: 2.0

  text_fast:
    action_type: text
    description: "Type text with 0.5 second delay"
    delay: 0.5
```

The delay gives you time to position the cursor in the target application after HookAnchor closes the popup.

### 6-11 Popup Navigation Keys

These actions control the popup UI. They're all `action_type: popup` with different `popup_action` values:

```yaml
  kb_execute:
    action_type: popup
    key: "enter"
    popup_action: execute_command
    close_popup: true

  kb_exit_app:
    action_type: popup
    key: "escape"
    popup_action: exit
    close_popup: true

  kb_navigate_down:
    action_type: popup
    key: "arrowdown"
    popup_action: navigate
    dx: 0
    dy: 1
    close_popup: false

  kb_navigate_up_hierarchy:
    action_type: popup
    key: "\\"
    popup_action: navigate_up_hierarchy
    close_popup: false

  kb_navigate_down_hierarchy:
    action_type: popup
    key: "]"
    popup_action: navigate_down_hierarchy
    close_popup: false

  kb_show_folder:
    action_type: popup
    key: "/"
    popup_action: show_folder
    close_popup: true

  kb_show_keys:
    action_type: popup
    key: "?"
    popup_action: show_keys
    close_popup: false

  kb_force_rebuild:
    action_type: popup
    key: "Cmd+Shift+B"
    popup_action: force_rebuild
    close_popup: false
```

- **`navigate`** uses `dx`/`dy` for directional movement in the grid
- **`navigate_up_hierarchy`** and **`navigate_down_hierarchy`** move through the anchor tree
- **`close_popup: false`** keeps the popup open after the action

### 6-12 Dynamic Template Lookup

Instead of hardcoding what the `+` key creates, let the anchor hierarchy decide:

```yaml
  kb_create_child:
    description: "Create child using anchor's template"
    action_type: template
    key: "+"
    lookup_anchor_template: true
    operations: []
```

- **`lookup_anchor_template: true`** tells HookAnchor to find the template action from the current anchor's configuration or its parent hierarchy
- **`operations: []`** is empty because the actual operations come from the looked-up template
- This means pressing `+` under a "Papers" anchor might create a dated paper entry, while `+` under a "Contacts" anchor creates a contact entry — each anchor controls its own child creation pattern

### 6-13 Custom JavaScript Action

Any `action_type` that isn't a built-in Rust type gets dispatched to `~/.config/hookanchor/config.js`, calling a function named `action_{type}()`. For example, an action with `action_type: wrap` calls `action_wrap()`:

```yaml
  wrap_file:
    description: "Wrap file into folder with same name and make anchor"
    action_type: wrap
    key: "Cmd+W"
```

The JavaScript function receives a `ctx` object with the full command context — the command's argument, the selected command, grabbed context, date, and all built-in functions:

```javascript
// In config.js
action_wrap: function(ctx) {
    const { log, error, expandHome, updateCommand } = ctx.builtins;
    const selectedName = ctx.selected.name;
    const selectedArg = ctx.selected.arg;
    log("WRAP", `Wrapping: ${selectedName}`);
    // ... implement wrap logic
}
```

See [Writing Custom Actions](PROGRAMMERS_REFERENCE.md#5-writing-custom-actions) for the full `ctx` object reference and more examples.

### 6-14 Sibling vs Child

A subtle but important distinction: `last_executed` refers to the command you just ran, while `last_anchor` refers to the most recently activated anchor. They determine *where* new files are created.

**Child** — creates under the last-executed command's folder:

```yaml
  child_dated_markdown:
    key: "Cmd+D"
    operations:
      - type: create
        file: "{{last_executed.folder}}/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
      - type: command
        patch: "{{last_executed.name}}"
```

**Sibling** — creates under the anchor's folder (one level up):

```yaml
  sibling_dated_markdown:
    key: "Cmd+Shift+D"
    operations:
      - type: create
        file: "{{last_anchor.folder}}/{{date.year}}-{{date.month}}-{{date.day}} {{input}}.md"
      - type: command
        patch: "{{last_anchor.name}}"
```

Use **child** (`last_executed.folder`) when you want to create something *inside* the current context. Use **sibling** (`last_anchor.folder`) when you want to create something *alongside* other items in the anchor's scope.

---

## 7. Grabber Rules

| # | Example | What it shows |
|---|---------|---------------|
| 1 | [Browser URL Capture](#7-1-browser-url-capture) | Matching a single browser |
| 2 | [Multi-Browser Setup](#7-2-multi-browser-setup) | Routing browsers to different actions |
| 3 | [Finder Context Capture](#7-3-finder-context-capture) | Distinguishing files, folders, and anchors |
| 4 | [IDE File Capture](#7-4-ide-file-capture) | Extracting filenames from window titles |
| 5 | [Suffix Mapping](#7-5-suffix-mapping) | Auto-appending domain suffixes |
| 6 | [Writing a New Rule](#7-6-writing-a-new-rule) | Step-by-step rule creation |

### 7-1 Browser URL Capture

The simplest grabber rule: capture a URL from a browser.

```yaml
grabber_rules:
  - name: Chrome URL
    matcher: 'bundleId === "com.google.Chrome" && props.url ? props.url : null'
    action: chrome
    group: Web
```

- **`matcher`** is a JavaScript expression. It checks `bundleId` to identify the app, then returns `props.url` if available, or `null` if not.
- Returning `null` means "this rule doesn't match" and evaluation continues to the next rule.
- **`action: chrome`** means the created command will use the `chrome` action type (which opens URLs in Chrome).
- **`group: Web`** sets the command's patch/category.

### 7-2 Multi-Browser Setup

Route each browser to its own action type so URLs remember which browser they came from:

```yaml
grabber_rules:
  - name: Chrome URL
    matcher: 'bundleId === "com.google.Chrome" && props.url ? props.url : null'
    action: chrome
    group: Web

  - name: Safari URL
    matcher: "bundleId === 'com.apple.Safari' && props.url ? props.url : null"
    action: safari
    group: Web

  - name: Brave URL
    matcher: "bundleId === 'com.brave.Browser' && props.url ? props.url : null"
    action: brave
    group: Web

  - name: Firefox URL
    matcher: "bundleId === 'org.mozilla.firefox' && props.url ? props.url : null"
    action: firefox
    group: Web

  - name: Chrome Beta URL
    matcher: "bundleId === 'com.google.Chrome.beta' && props.url ? props.url : null"
    action: work
    group: Work
```

Rules are evaluated in order. The first match wins, so put more specific rules before more general ones.

### 7-3 Finder Context Capture

Finder provides rich context through `props`. Different rules handle different selection types:

```yaml
  - name: Finder Anchor
    matcher: >
      bundleId === 'com.apple.finder'
      && props.selection
      && props.recommendedAction === 'anchor'
      ? props.selection : null
    action: tmux
    group: Files

  - name: Finder Markdown
    matcher: >
      bundleId === 'com.apple.finder'
      && props.selection
      && props.recommendedAction === 'markdown'
      ? props.selection : null
    action: markdown
    group: Files

  - name: Finder Selected Folder
    matcher: >
      bundleId === 'com.apple.finder'
      && props.selection
      && props.recommendedAction === 'folder'
      ? props.selection : null
    action: folder
    group: Dir

  - name: Finder Path
    matcher: >
      bundleId === 'com.apple.finder'
      && !props.selection
      && props.path
      ? props.path : null
    action: folder
    group: Dir
```

- **`props.recommendedAction`** tells you what kind of item is selected: `"anchor"` (folder with anchor file), `"markdown"`, `"folder"`, etc.
- **`props.selection`** is the path of the selected item
- **`props.path`** is the current directory (used as fallback when nothing is selected)
- Order matters: check `props.selection` rules before `props.path` so selected items take priority

### 7-4 IDE File Capture

IDEs typically show the filename in the window title. Extract it with string splitting:

```yaml
  - name: VS Code File
    matcher: >
      bundleId === 'com.microsoft.VSCode'
      && title && !title.includes('Welcome')
      ? title.split(' — ')[0] : null
    action: doc
    group: Code

  - name: Xcode Project
    matcher: >
      bundleId === 'com.apple.dt.Xcode'
      && title
      ? title.split(' — ')[0] : null
    action: doc
    group: Code

  - name: Sublime Text File
    matcher: >
      bundleId === 'com.sublimetext.4'
      && title && title !== 'Sublime Text'
      ? title.split(' • ')[0] : null
    action: doc
    group: Code
```

- Each IDE uses a different separator in the title: VS Code uses ` — `, Sublime uses ` • `
- Filter out generic titles like `'Welcome'` or the app name itself to avoid creating useless commands
- `title.split(' — ')[0]` extracts just the filename from titles like `"main.rs — MyProject"`

### 7-5 Suffix Mapping

Automatically append domain-based suffixes to command names when grabbing URLs:

```yaml
grabber_suffix_map:
  "@github": "github\\.com"
  "@docs": "docs\\.google\\.com"
  "@stack": "stackoverflow\\.com"
  "@notion": "notion\\.so"
  "@jira": "atlassian\\.net"
```

When you grab a URL like `https://github.com/user/repo`, the command name gets `@github` appended (e.g., `"user/repo @github"`). This makes it easy to identify the source when browsing commands.

The values are regex patterns (note the escaped dots: `\\.`).

### 7-6 Writing a New Rule

Step-by-step process for adding a grabber rule for a new application.

**Step 1: Find the bundleId.** Grab from the app with no matching rule. HookAnchor logs the context including `bundleId`, `app`, `title`, and available `props`. Check `~/.config/hookanchor/anchor.log` or use the grab diagnostic output.

**Step 2: Identify what to capture.** Look at the window title pattern. For a chat app, the title might be `"#general - MyWorkspace - Slack"`. Decide which part to extract.

**Step 3: Write the matcher.** Use JavaScript string methods to extract the value:

```yaml
  - name: Slack Channel
    matcher: >
      bundleId === 'com.tinyspeck.slackmacgap'
      && props.channel
      ? props.channel : null
    action: slack
    group: Slack
```

For apps without special `props`, parse the window title:

```yaml
  - name: My Custom App
    matcher: >
      bundleId === 'com.example.myapp'
      && title && title !== 'My App'
      ? title.split(' - ')[0].trim() : null
    action: app
    group: Custom
```

**Step 4: Choose action and group.** The `action` determines how the command opens (URL, folder, app, etc.). The `group` organizes captured commands into categories.

**Step 5: Position in the rule list.** Rules are evaluated top-to-bottom. Place specific rules (checking `bundleId`) before general fallback rules. Browser rules typically go first, then Finder, then other apps.

---

## Configuration File Location

The config file is at `~/.config/hookanchor/config.yaml`. A companion JavaScript file at `~/.config/hookanchor/config.js` defines custom action functions. See the [Configuration Reference](CONFIG_REFERENCE.md) for the complete field-by-field guide.
