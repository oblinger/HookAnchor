# Template JavaScript Variables Reference

**Version 0.10.0** - Variables now use object-based notation for better organization.

## Overview

Templates in HookAnchor use JavaScript evaluation for variable expansion within `{{...}}` expressions. This provides powerful scripting capabilities and access to contextual information through JavaScript objects.

## Variable Syntax

Variables are accessed within double curly braces using JavaScript dot notation:
- `{{last_executed.name}}` - Access the name of the last executed command
- `{{input.toUpperCase()}}` - Transform user input to uppercase
- `{{date.year}}` - Access current year

## Available Objects

### `input` (String)
The user-provided text input when the template is triggered.

**Example:**
```yaml
name: "{{input}}"           # Direct use
name: "{{input.trim()}}"    # Remove whitespace
name: "{{input.replace(' ', '_')}}"  # Replace spaces
```

### `last_executed` (Object)
Information about the last command that was actually executed.

**Properties:**
- `last_executed.name` - Command name
- `last_executed.action` - Action type (app, url, cmd, etc.)
- `last_executed.arg` - Command argument/path
- `last_executed.patch` - Command group/patch
- `last_executed.folder` - Extracted folder path (for file-based commands)
- `last_executed.flags` - Command flags
- `last_executed.flags` - Command flags

**Example:**
```yaml
arg: "{{last_executed.folder}}/{{input}}.md"  # Create in same folder as last_executed
patch: "{{last_executed.patch}}"              # Use same group as last_executed
```

### `selected` (Object)
Information about the currently selected command in the popup.

**Properties:**
- `selected.name` - Command name
- `selected.action` - Action type
- `selected.arg` - Command argument/path
- `selected.patch` - Command group/patch
- `selected.folder` - Extracted folder path
- `selected.flags` - Command flags

**Example:**
```yaml
name: "Sub: {{selected.name}}"
arg: "{{selected.folder}}/subfolder"
```

### `date` (Object)
Current date and time information.

**Properties:**
- `date.year` - 4-digit year (e.g., "2024")
- `date.year2` - 2-digit year (e.g., "24")
- `date.month` - Month padded (e.g., "03")
- `date.month_short` - Month unpadded (e.g., "3")
- `date.month_name` - Month name (e.g., "March")
- `date.month_abbr` - Month abbreviation (e.g., "Mar")
- `date.day` - Day padded (e.g., "05")
- `date.day_short` - Day unpadded (e.g., "5")
- `date.weekday` - Day name (e.g., "Monday")
- `date.weekday_abbr` - Day abbreviation (e.g., "Mon")
- `date.hour` - Hour 24h padded (e.g., "14")
- `date.hour12` - Hour 12h (e.g., "2")
- `date.minute` - Minute padded (e.g., "30")
- `date.second` - Second padded (e.g., "45")
- `date.ampm` - AM/PM indicator
- `date.timestamp` - Unix timestamp
- `date.iso` - ISO 8601 format

**Example:**
```yaml
name: "Note {{date.year}}-{{date.month}}-{{date.day}}"
arg: "/journal/{{date.year}}/{{date.month}}/{{input}}.md"
```

### `grabbed` (Object)
Information captured by the grabber (when using `grab` option).

**Properties:**
- `grabbed.action` - Detected action type
- `grabbed.arg` - Captured argument/path
- `grabbed.app` - Application name
- `grabbed.title` - Window title
- `grabbed.text` - Selected text or content

**Example:**
```yaml
grab: 3  # Wait 3 seconds then grab
name: "{{grabbed.app}}: {{input}}"
action: "{{grabbed.action}}"
arg: "{{grabbed.arg}}"
```

### `env` (Object)
Environment variables and system information.

**Properties:**
- `env.home` - User home directory
- `env.user` - Current username
- `env.hostname` - Machine hostname
- `env.os` - Operating system
- `env.config_dir` - HookAnchor config directory

**Example:**
```yaml
arg: "{{env.home}}/Documents/{{input}}.txt"
```

## JavaScript Functions

Since templates use full JavaScript evaluation, you can use any JavaScript string methods and expressions:

### String Methods
```yaml
name: "{{input.toUpperCase()}}"          # UPPERCASE
name: "{{input.toLowerCase()}}"          # lowercase
name: "{{input.slice(0, 10)}}"          # First 10 chars
name: "{{input.replace(/ /g, '_')}}"    # Replace all spaces
name: "{{input.trim()}}"                # Remove whitespace
name: "{{input.padStart(10, '0')}}"     # Pad with zeros
```

### Conditional Logic
```yaml
name: "{{input || 'Untitled'}}"         # Default value
name: "{{input.length > 20 ? input.slice(0,20) + '...' : input}}"  # Truncate
patch: "{{last_executed.patch || 'MISC'}}"   # Fallback to MISC
```

### Complex Expressions
```yaml
# Generate slug from input
name: "{{input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}}"

# Create dated filename
arg: "/notes/{{date.year}}/{{date.month}}/{{date.day}}-{{input.replace(/ /g, '_')}}.md"

# Smart folder selection
arg: "{{last_executed.folder || selected.folder || env.home + '/Documents'}}/{{input}}.md"
```

## Migration from Old Variables

| Old Variable | New JavaScript Expression |
|--------------|--------------------------|
| `{{input}}` | `{{input}}` |
| `{{last_executed_name}}` | `{{last_executed.name}}` |
| `{{last_executed_folder}}` | `{{last_executed.folder}}` |
| `{{last_executed_patch}}` | `{{last_executed.patch}}` |
| `{{selected_name}}` | `{{selected.name}}` |
| `{{selected_folder}}` | `{{selected.folder}}` |
| `{{YYYY}}` | `{{date.year}}` |
| `{{MM}}` | `{{date.month}}` |
| `{{DD}}` | `{{date.day}}` |
| `{{hh}}` | `{{date.hour}}` |
| `{{mm}}` | `{{date.minute}}` |

## Examples

### Create Sub-Anchor
```yaml
sub_anchor:
  key: "!"
  name: "{{input}}"
  action: "anchor"
  arg: "{{last_executed.folder}}/{{input}}/{{input}}.md"
  patch: "{{last_executed.patch}}"
  validate_last_executed_folder: true
  description: "Create sub-anchor under last_executed folder"
```

### Daily Journal
```yaml
journal:
  key: "J"
  name: "Journal {{date.year}}-{{date.month}}-{{date.day}}"
  action: "markdown"
  arg: "{{env.home}}/journal/{{date.year}}/{{date.month_name}}/{{date.day}}-{{date.weekday}}.md"
  file: "{{env.home}}/journal/{{date.year}}/{{date.month_name}}/{{date.day}}-{{date.weekday}}.md"
  contents: "# {{date.weekday}}, {{date.month_name}} {{date.day}}, {{date.year}}\n\n## {{input || 'Daily Notes'}}\n\n"
  description: "Create daily journal entry"
```

### Smart Note Creator
```yaml
smart_note:
  key: "N"
  name: "{{input || 'Quick Note'}}"
  action: "markdown"
  arg: "{{(last_executed.folder || selected.folder || env.home + '/notes')}}/{{date.year}}-{{date.month}}-{{date.day}}_{{input.toLowerCase().replace(/\\s+/g, '_')}}.md"
  edit: true
  description: "Create note in context-aware location"
```