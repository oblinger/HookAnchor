# HookAnchor Configuration Files

This directory contains default configuration files for HookAnchor.

## Installation

1. Install HookAnchor from the DMG distribution
2. The installer will create `~/.config/hookanchor/` with these defaults
3. Customize the configuration files for your workflow

## Files

### default_config.yaml

Main configuration file defining:
- Keyboard bindings
- Popup settings
- File scanning roots
- Actions and templates
- Integration settings (Obsidian, Notion, etc.)

### default_config.js

JavaScript configuration for advanced customization:
- Custom action handlers
- Template variable functions
- Integration with external services

## Customization

After installation, your personal configs are at:
- `~/.config/hookanchor/config.yaml`
- `~/.config/hookanchor/config.js`

Edit these files to customize HookAnchor for your needs.

## Environment Variables

You can use environment variables in your config files:

```yaml
integrations:
  notion:
    api_key: "${HOOKANCHOR_NOTION_API_KEY}"  # Reads from environment
```

## Historical Versions

See [../versions/](../versions/) for configuration files from previous releases.

## Documentation

See the [docs/](../docs/) directory for complete documentation:
- [User Guide](../docs/USER_GUIDE.md)
- [Configuration Reference](../docs/CONFIG_REFERENCE.md)
- [Templates and Scripting](../docs/TEMPLATES_AND_SCRIPTING.md)
