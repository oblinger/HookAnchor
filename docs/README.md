# HookAnchor User Documentation

Complete documentation for installing, configuring, and using HookAnchor.

## Documentation Files

### [USER_GUIDE.md](USER_GUIDE.md)
**Start here!** Complete installation and usage guide:
- Installation and setup
- Keyboard triggers (Caps Lock, shortcuts)
- Basic navigation and search
- Command types and usage
- Creating custom commands
- Troubleshooting

### [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)
**Configuration reference** for `~/.config/hookanchor/config.yaml`:
- All settings explained
- Actions and templates
- Keyboard bindings
- JavaScript functions
- Complete examples

### [HookAnchor_Action_Types.md](HookAnchor_Action_Types.md)
**Action types reference** for all available action behaviors:
- Complete list of action types
- Arguments and parameters for each type
- Grabber support information
- Configuration examples

### [TEMPLATES_AND_SCRIPTING.md](TEMPLATES_AND_SCRIPTING.md)
**Advanced features** for power users:
- Template system with variables
- JavaScript automation
- Custom workflows
- Integration examples

### [TEMPLATE_JS_VARIABLES.md](TEMPLATE_JS_VARIABLES.md)
**Variable reference** for templates:
- Object-based variables (v0.10.0+)
- Context variables
- Date/time formatting
- Examples

## Quick Reference

### Key Concepts
- **Commands**: Named actions (launch apps, open URLs, run scripts)
- **Patches**: Groups of related commands
- **Templates**: Dynamic command generators
- **Anchors**: Project folder shortcuts with markdown integration

### Common Actions
| Action | Description | Example |
|--------|-------------|---------|
| `app` | Launch application | `Terminal : app; Terminal` |
| `url` | Open website | `GitHub : url; https://github.com` |
| `folder` | Open folder | `Downloads : folder; ~/Downloads` |
| `cmd` | Run shell command | `Build : cmd; npm run build` |
| `markdown` | Open markdown file | `Notes : markdown; ~/notes/daily.md` |
| `anchor` | Project anchor | `Project : anchor; ~/projects/my-project/README.md` |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Enter` | Execute selected command |
| `Esc` | Close popup |
| `↑↓←→` | Navigate commands |
| `;` | Edit selected command |
| `=` | Create/edit command from input |
| `/` | Show command in Finder |
| `?` | Show keyboard shortcuts |
| `!` | Create sub-anchor |
| `>` | Create alias |

### Template Keys
| Key | Template | Purpose |
|-----|----------|---------|
| `!` | sub_anchor | Create sub-anchor of last command |
| `&` | sub_markdown | Create markdown in last folder |
| `>` | alias | Alias to last executed command |
| `+` | grab | Capture window/app info |

## Configuration Files

| File | Purpose |
|------|---------|
| `~/.config/hookanchor/config.yaml` | Main configuration |
| `~/.config/hookanchor/commands.txt` | Command definitions |
| `~/.config/hookanchor/state.json` | Runtime state |
| `~/.config/hookanchor/anchor.log` | Debug logs |

## Version History

Current version: **0.10.0**

Major changes in v0.10.0:
- Template variables now use object notation (`{{last_executed.name}}` instead of `{{previous_name}}`)
- JavaScript-based actions are now first-class types
- Improved template system with `use_existing` flag

See [CHANGELOG.md](../../CHANGELOG.md) for complete history.