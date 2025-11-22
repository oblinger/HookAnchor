# Changelog

All notable changes to HookAnchor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.20.1] - 2025-11-10

### Changed
- Improved data layer architecture for better reliability
  - Added single source of truth for config directory path (`get_config_dir()`)
  - Complete encapsulation of commands.txt and cache file paths within data layer
  - Removed duplicate path construction logic across modules
  - Enhanced data integrity by making it impossible to bypass singleton for data file access

## [0.17.0] - 2025-10-27

### Fixed
- **MAJOR FIX**: Virtual anchor creation now reuses existing commands instead of creating orphans
  - When a patch needs an anchor, the system now searches for ANY command (not just anchors) with the patch name
  - If found, sets the anchor flag on the existing command (e.g., folder entry becomes both folder and anchor)
  - Only creates new orphan anchor entry if no command exists with that name
  - Reduces orphan creation dramatically (from 430 to 0 in legacy import testing)
  - Example: `Doc! DocPython:folder` now becomes `Doc! DocPython:folder; F:=A` instead of creating `orphans! DocPython:; F:=A`
- Improved patch validation logic in `validate_and_repair_patches()` Phase 3

## [0.16.0] - 2025-10-21

### Added
- Added anchor flag ('a') support to mark commands as anchors independent of action type
- Added `is_anchor()` and `set_anchor()` accessor methods to Command struct
- Added anchor checkbox in command editor for toggling anchor status
- Added `--help vars`, `--help config`, and `--help fns` subcommands for detailed help

### Changed
- **BREAKING**: Commands now deduplicated by name only (not name+action+arg)
  - Only one command per name allowed in system
  - Keeps version with best metadata (patches > flags > newer)
- **BREAKING**: Deduplication now happens in `flush()` before saving
  - Both commands.txt and cache files always deduplicated
  - In-memory command list also deduplicated
- Changed all anchor action type checks to use `is_anchor()` method
  - Supports both legacy `action="anchor"` and new 'a' flag
  - Enables gradual migration from action type to flag-based anchors
- Updated all config templates to use `action: markdown` with `flags: a` instead of `action: anchor`
- Converted 885 anchor commands in commands.txt:
  - 682 → `markdown a` (.md files)
  - 196 → `notion a` (Notion URLs)
  - 7 → no action, just 'a' flag (empty args)
- Improved help system formatting to match actual YAML structure
- Made help subsections discoverable in main help message

### Fixed
- Fixed command editor anchor checkbox to check 'a' flag specifically (not action type)
- Fixed anchor flag being displayed in flags text field (now hidden and managed separately)
- Removed "Priority" checkbox from command editor (unused feature)

## [0.15.0] - 2025-10-20

### Added
- **NEW**: History viewer application with tree navigation and peek-on-hover functionality
  - Browse command history organized by patch hierarchy
  - Hover over folders to preview their history without changing filter
  - Execute historical commands directly from viewer
  - Navigate with arrow keys and Enter
- **NEW**: Anchor tree navigator widget for hierarchical navigation
  - Reusable tree navigation component
  - Returns both clicked and hovered patches for flexible UI
- Added centralized `get_binary_dir()` function with symlink resolution
  - Ensures binaries can be found reliably when CLI invoked via symlink
  - Consolidated binary path resolution across codebase
- Added '/' key binding in history viewer to open folders in Finder
  - Matches main popup behavior for consistency

### Changed
- **BREAKING**: Refactored CLI command structure
  - `ha` (no arguments) now shows help instead of launching popup
  - `ha --popup` explicitly launches popup interface
  - `ha --search` launches history viewer
  - Removed broken popup control commands that couldn't work from CLI
- **BREAKING**: Refactored rescan workflow to prevent stale entries
  - Now loads cache first, then merges commands.txt, then scans
  - Properly removes commands for deleted files
  - Prevents stale entries from being re-added after cleanup

### Fixed
- **CRITICAL**: Fixed duplicate history entry bug
  - Added database-level duplicate checking for "created" entries
  - Added duplicate checking for "modified" entries (60-second window)
  - Prevented 6,442 duplicate entries during testing
- **CRITICAL**: Fixed rescan to remove stale file entries
  - Files that no longer exist are now properly removed from commands
  - Reordered scan steps to prevent re-adding cleaned entries
  - Tested: Successfully removed 61 stale entries for renamed folder
- Fixed bogus modification entries in rescan
  - Only records modifications when file size actually changes
  - No longer creates modification entry when first setting file_size

## [0.14.0] - 2025-09-22

### Changed
- **BREAKING**: Refactored template variable creation to eliminate duplication
  - Simplified variable creation pipeline for better maintainability
  - Unified template context handling across actions
- Updated terminology from "submenu" to "prefix menu" throughout codebase for clarity

### Fixed
- Fixed ghost input to preserve original user input for anchor commands
- Fixed command server logging to show executed commands in anchor.log
- Improved JavaScript action function resolution for clear_log functionality

### Added
- Enhanced event logging and clear_log functionality
- Comprehensive Notion grabber diagnostics
- Better patch inference logging and debugging capabilities

## [0.13.0] - 2025-01-20

### Added
- **NEW**: GUI installer with automatic first-run trigger
- **NEW**: Global hotkey support and shell integration
- Robust uninstaller with preservation scripts in config folder
- Automatic deployment system building from personal configs

### Changed
- **BREAKING**: Removed embedded config fallback - now uses repo configs only
- Updated installer to use `config.yaml-latest-default.yaml` filename convention
- Improved anchor detection and template error handling

### Fixed
- **CRITICAL**: Installer now never overwrites files without force flag
- Fixed config system to eliminate legacy config file creation paths
- Fixed notion command execution by removing hardcoded bypass routes

### Removed
- Removed legacy config file creation paths
- Removed spawnDetached function (not needed with existing shell functions)

## [0.12.1] - 2025-01-20

### Fixed
- Fixed DOC command persistence issues
- Fixed submenu filtering and command editor rename feedback
- Fixed Command Editor window sizing and input field widths
- Fixed dialog window sizing by preventing competing resize commands

### Changed
- **BREAKING**: Removed `orphans_path` config option
- Improved command editor Enter key behavior and anchor matching
- Enhanced window position handling to prevent drift

### Removed
- Removed legacy orphans_path configuration

## [0.12.0] - 2025-01-20

### Added
- Square bracket navigation for popup hierarchy
- Comprehensive display logic with new build_submenu approach
- Multiple anchors per patch with preferred anchor selection
- Comprehensive rename system with confirmation dialogs

### Changed
- **BREAKING**: Refactored display logic with unified approach
- Implemented unified resolve_alias method for Command
- Added core/display module for display and filtering logic

### Fixed
- Fixed popup position drift by re-anchoring after resize
- Fixed scanner anchor recreation and removed orphan creation
- Fixed dialog box sizing to prevent button cutoff

### Removed
- Removed legacy keybindings and templates code paths

## [0.11.0] - 2025-01-20

### Added
- Comprehensive Notion scanning with limit and incremental updates
- Enhanced console output handling for command server
- Better timeout and iteration limits for Notion scanning

### Changed
- **BREAKING**: Implemented println! vs logging rules throughout system
  - CLI commands use println! for user output
  - Library code uses logging functions only
  - Popup/GUI code has no console output
- Converted high-volume logs to detailed_log system
- Simplified orphan processing to use anchor commands instead of file merging

### Fixed
- Fixed popup focus handling and rebuild improvements
- Fixed Notion scanning hang with proper timeout handling
- Fixed Notion logging visibility during verbose rescan

### Removed
- Removed incorrect println! usage throughout codebase

## [0.10.0] - 2025-01-20

### Changed
- **BREAKING**: Refactored template variable system from flat variables to object-based access
  - Changed from `{{previous_name}}` to `{{last_executed.name}}`
  - Changed from `{{YYYY}}` to `{{date.year}}`
  - All variables now use clean object notation for better organization
- Replaced volatile "previous" command tracking with stable "last_executed" from persistent state
- Converted JavaScript-based actions to first-class action types
  - Changed from `type: javascript` with `code: action_doc` to simply `type: doc`
  - Actions now have cleaner definitions with just `description` and `type`
- Removed redundant `tmux_activate` and `activate_anchor` action types
  - Their functionality can be achieved through regular `cmd` actions

### Added
- JavaScript evaluation support for template variable expansion
- `use_existing` flag for templates to edit existing commands vs creating new ones
- Better error messages including file paths for template operations

### Fixed
- Fixed alias template to use reliable `{{last_executed.name}}` instead of volatile `{{previous.name}}`
- Popup window position persistence improvements

### Removed
- Removed legacy flat variable names (last_executed_name, selected_name, etc.)
- Removed backward compatibility variables
- Removed duplicate action handlers (1password, slack, tmux, type_text)

## [0.9.0] - 2025-01-20

### Changed
- Complete Actions-based architecture refactor
  - All functionality now routes through unified Action system
  - Consistent action handling between CLI and GUI
  - Template system integration with actions

### Added
- Unified actions system with centralized configuration in config.yaml
- Template actions for creating new commands and files
- Execute method to server for action routing consistency
- JavaScript evaluation in templates

### Fixed
- Command editor cursor position bug
- Auto-add U flag to user-edited scanner commands

## [0.8.0] - 2025-01-10

### Changed
- Implemented safe URL handling architecture
  - URL schemes now handled via Apple Events, not command line arguments
  - Prevents system lockups from incorrect URL handling

### Added
- Comprehensive URL handling documentation
- Safety checks for URL processing

## [0.7.0] - 2025-01-07

### Changed
- Major supervisor architecture improvements
- Dispatcher architecture implementation
- Refactored executor into eval-based dispatcher with JavaScript runtime

### Added
- Clean server output handling
- Improved tmux session management
- Better error handling and logging

### Fixed
- tmux PATH issues in anchor action
- tmux session switching improvements

## [0.6.0] - 2025-01-06

### Added
- Comprehensive uninstall functionality with config preservation
- Automatic version archiving in build process
- Inverse file operation with perfect round-trip conversion

### Changed
- Relocated project from kmr/prj to proj directory
- Improved build distribution script

## [0.5.0] - 2025-01-05

### Added
- Idle timeout to hide popup after inactivity
- Improved popup keyboard handlers

### Fixed
- Popup position issues
- tmux activation handling
