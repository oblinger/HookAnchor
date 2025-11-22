// Version: 0.20.6
// HookAnchor Default JavaScript Configuration
//
// This file contains JavaScript functions used by HookAnchor actions.
// It is automatically generated from the developer's personal config during build.
// Personal paths and values have been replaced with generic defaults.
//
// Copy this to ~/.config/hookanchor/config.js and customize as needed.
//
// All JavaScript functions have access to these built-in functions:
// - shell(command): Execute shell command asynchronously
// - shellSync(command): Execute shell command synchronously
// - log(message): Log message to HookAnchor logs
//
// ⚠️  IMPORTANT: DO NOT CREATE NEW ACTION TYPES WITHOUT EXPLICIT APPROVAL
// ⚠️  The existing action types (cmd, js, popup, template) should be sufficient.
// ⚠️  If you think you need a new action type, discuss with the developer FIRST.
// ⚠️  The "cmd" action type can handle ANY command that JavaScript can execute.
//

// HookAnchor Configuration Functions
// This file contains JavaScript action implementations that were previously embedded in config.yaml
// Each function receives a context object with the following structure:
// {
//   arg: string,              // The primary argument passed to the action
//   input: string,            // User's search input
//   previous: {               // Previous command information
//     name: string,
//     folder: string,
//     patch: string
//   },
//   grabbed: {                // Grabber information
//     action: string,
//     arg: string
//   },
//   date: {                   // Date components
//     YYYY: string,
//     MM: string,
//     DD: string
//   },
//   builtins: {               // All builtin functions
//     log, openFolder, shell, shellSync, launchApp, changeDirectory,
//     readFile, expandHome, getConfigString, getConfigString,
//     getConfigString, joinPath, file_exists, spawnDetached,
//     shellWithExitCode, encodeURIComponent, commandExists, etc.
//   }
// }


module.exports = {


  // Open folder - handles relative and absolute paths
  action_folder: function(ctx) {
    const { log, openFolder, joinPath } = ctx.builtins;
    const folderPath = ctx.arg;
    
    log("FOLDER", `Starting with path: '${folderPath}'`);

    // Check if path is already absolute (starts with / or ~)
    if (folderPath.startsWith('/') || folderPath.startsWith('~')) {
      // Already absolute, use as-is
      log("FOLDER", `Using absolute path: '${folderPath}'`);
      try {
        openFolder(folderPath);
        log("FOLDER", `Successfully called openFolder for: '${folderPath}'`);
      } catch (error) {
        log("FOLDER", `Error opening folder: ${error}`);
      }
    } else {
      // Relative path - join with vault root
      const vaultRoot = getConfigString("launcher_settings.obsidian_vault_path");
      const absolutePath = joinPath(vaultRoot, folderPath);
      log("FOLDER", `Converting relative path '${folderPath}' to absolute: '${absolutePath}'`);
      try {
        openFolder(absolutePath);
        log("FOLDER", `Successfully called openFolder for: '${absolutePath}'`);
      } catch (error) {
        log("FOLDER", `Error opening folder: ${error}`);
      }
    }
    return "Folder opened successfully";
  },


  // Execute command - handles windowed (W flag) execution
  action_cmd: function(ctx) {
    const { log, detailedLog, shell, shellSync } = ctx.builtins;
    const fullCmd = ctx.arg;

    // Check if command starts with 'W ' flag (handle different separations)
    if (fullCmd.startsWith('W ')) {
      // Remove 'W ' and get actual command  
      const command = fullCmd.substring(2);
      log("CMD", `Executing in Terminal window (W flag): '${command}'`);
      
      // Use osascript to open Terminal window with command
      // Escape both single and double quotes for AppleScript
      const escapedCmd = command.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
      shell(`osascript -e 'tell application "Terminal" to do script "${escapedCmd}"'`);
      
      // Brief delay to ensure Terminal has time to start
      shellSync("/bin/sleep 0.2");
      
      log("CMD", `Terminal window opened with command`);
    } else if (fullCmd.startsWith('W; ')) {
      // Handle 'W; ' format (semicolon with space)
      const command = fullCmd.substring(3);
      log("CMD", `Executing in Terminal window (W; flag): '${command}'`);
      
      // Use osascript to open Terminal window with command
      const escapedCmd = command.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
      shell(`osascript -e 'tell application "Terminal" to do script "${escapedCmd}"'`);
      
      // Brief delay to ensure Terminal has time to start  
      shellSync("/bin/sleep 0.2");
      
      log("CMD", `Terminal window opened with command`);
    } else if (fullCmd.startsWith('W;')) {
      // Handle 'W;' format (semicolon no space)
      const command = fullCmd.substring(2);
      log("CMD", `Executing in Terminal window (W; flag): '${command}'`);
      
      // Use osascript to open Terminal window with command
      const escapedCmd = command.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
      shell(`osascript -e 'tell application "Terminal" to do script "${escapedCmd}"'`);
      
      // Brief delay to ensure Terminal has time to start  
      shellSync("/bin/sleep 0.2");
      
      log("CMD", `Terminal window opened with command`);
    } else {
      // Normal background execution
      log("CMD", `Executing in background: '${fullCmd}'`);
      shell(fullCmd);
    }
  },

  // Execute command with different modes based on flags:
  // No flags: Background execution (like CMD)
  // I flag: Interactive terminal that stays open
  // C flag: Interactive terminal that auto-closes when command exits
  action_console: function(ctx) {
    const { log, detailedLog, shell, shellSync } = ctx.builtins;
    const command = ctx.arg;
    const hasInteractiveFlag = ctx.flags && ctx.flags.includes('I');
    const hasCloseFlag = ctx.flags && ctx.flags.includes('C');
    
    // Determine execution mode
    if (!hasInteractiveFlag && !hasCloseFlag) {
      // Mode 1: No flags - background execution (like CMD action)
      log(`Console action: Executing in background: '${command}'`);
      shell(command);
      return `Background execution: ${command}`;
    } else {
      // Mode 2 & 3: Interactive terminal execution
      const willAutoClose = hasCloseFlag;
      
      log(`Console action: Opening new terminal window with command: '${command}' (interactive: true, auto-close: ${willAutoClose})`);
      
      // Append exit command if C flag is present (auto-close mode)
      let finalCommand = command;
      if (willAutoClose) {
        finalCommand = `${command}; exit`;
        log(`Console action: Auto-close enabled - final command: '${finalCommand}'`);
      }
      
      // Escape both single and double quotes for AppleScript
      const escapedCmd = finalCommand.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
      
      // Use AppleScript to create new Terminal window and run the command
      shell(`osascript -e 'tell application "Terminal" to do script "${escapedCmd}"'`);
      
      // Brief delay to ensure Terminal has time to start
      shellSync("/bin/sleep 0.2");
      
      // Activate Terminal to bring it to foreground
      shell(`osascript -e 'tell application "Terminal" to activate'`);
      
      log(`Console action: New terminal window opened and activated`);
      
      if (willAutoClose) {
        return `Console opened with: ${command} (auto-close)`;
      } else {
        return `Console opened with: ${command} (stays open)`;
      }
    }
  },


  // Open markdown file in Obsidian or default editor
  action_markdown: function(ctx) {
    const { log, shell, launchApp, expandHome, getConfigString, encodeURIComponent } = ctx.builtins;
    const filePath = ctx.arg;
    
    log("MARKDOWN", `Processing file: '${filePath}'`);

    // Get the Obsidian vault path and expand it
    const vaultPath = getConfigString("launcher_settings.obsidian_vault_path");
    log("MARKDOWN", `Obsidian vault path: '${vaultPath}'`);

    // Normalize the file path (expand ~ and resolve ..)
    const normalizedFilePath = expandHome(filePath);
    const normalizedVaultPath = expandHome(vaultPath);

    log("MARKDOWN", `Normalized file path: '${normalizedFilePath}'`);
    log("MARKDOWN", `Normalized vault path: '${normalizedVaultPath}'`);

    // Check if the file is within the Obsidian vault
    if (normalizedFilePath.startsWith(normalizedVaultPath + '/') || normalizedFilePath === normalizedVaultPath) {
      // File is in Obsidian vault - open in Obsidian
      log("MARKDOWN", `File is in Obsidian vault, opening in Obsidian`);
      
      // Get the relative path from vault root
      const relativePath = normalizedFilePath.substring(normalizedVaultPath.length + 1);
      log("MARKDOWN", `Relative path in vault: '${relativePath}'`);
      
      // Remove .md extension if present
      const fileNameWithoutExt = relativePath.replace(/\.md$/, '');
      
      // Encode for URL
      const encoded = encodeURIComponent(fileNameWithoutExt);
      const vault = getConfigString("launcher_settings.obsidian_vault_name");
      const app = getConfigString("launcher_settings.obsidian_app_name");
      const url = `obsidian://open?vault=${vault}&file=${encoded}`;
      
      log("MARKDOWN", `Opening Obsidian with URL: ${url}`);
      launchApp(app, url);
    } else {
      // File is outside vault - open with default markdown editor
      log("MARKDOWN", `File is outside Obsidian vault, opening with default app`);
      shell(`open "${filePath}"`);
    }
  },


  // Insert action - just calls action_text with direct flag set
  action_insert: function(ctx) {
    // Set the direct flag to indicate we want to use arg as text, not as a file path
    ctx.params = ctx.params || {};
    ctx.params.direct = true;
    return this.action_text(ctx);
  },

  // Type text - either from file (default) or directly from arg (if direct flag set)
  action_text: function(ctx) {
    const { log, readFile, shell, shellSync } = ctx.builtins;

    // Check if we're in direct mode (arg is the text itself, not a file path)
    const isDirect = ctx.params?.direct || false;

    // Get delay parameter from action config, default to 1.0 seconds
    const delay = ctx.params?.delay || 1.0;

    // Get the content - either directly from arg or by reading the file
    let content;
    if (isDirect) {
      content = ctx.arg;
      log("TEXT", `Using text directly: '${content.substring(0, 50)}${content.length > 50 ? '...' : ''}'`);
    } else {
      const filePath = ctx.arg;
      log("TEXT", `Reading file: '${filePath}'`);
      try {
        content = readFile(filePath);
        log("TEXT", `Successfully read ${content.length} characters from file`);
      } catch (error) {
        log("TEXT", `Error reading file: ${error}`);
        throw new Error(`Failed to read text file: ${error}`);
      }
    }

    log("TEXT", `Using delay of ${delay} seconds before typing`);

    // Give focus back to the previous application (the one that was active before popup)
    log("TEXT", `Switching focus to previous application`);
    shell("osascript -e 'tell application \"System Events\" to key code 48 using command down'");
    shellSync(`/bin/sleep ${delay}`); // Wait for focus switch with configurable delay

    // Type the content using a simpler approach
    log("TEXT", `Typing content into focused application after ${delay}s delay`);

    // Use AppleScript to type the content as a single string
    // This is faster and should complete more reliably
    const escapedContent = content
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");

    const script = `osascript -e 'tell application "System Events" to keystroke "${escapedContent}"'`;

    try {
      shellSync(script);
      log("TEXT", `Successfully typed content`);
    } catch (error) {
      log("TEXT", `Error typing content: ${error}`);
      throw new Error(`Failed to type text: ${error}`);
    }
  },







  // Open Notion page
  action_notion: function(ctx) {
    // Extract URL from context object
    const url = ctx.arg || ctx;
    
    // Use log function from context
    const { log, shell } = ctx.builtins || { log: console.log, shell: shell };
    
    log("NOTION_ACTION", "NOTION_ACTION: ========== START ==========");
    log("NOTION_ACTION", `ctx type: ${typeof ctx}`);
    log("NOTION_ACTION", `ctx.arg: '${ctx.arg}'`);
    log("NOTION_ACTION", `ctx.input: '${ctx.input}'`);
    log("NOTION_ACTION", `URL to open: '${url}'`);
    
    if (!url || url === "" || url === "undefined" || url === "null") {
      log("NOTION_ACTION", "NOTION_ACTION: WARNING - No URL provided or URL is empty/undefined");
      log("NOTION_ACTION", "NOTION_ACTION: Falling back to just activating Notion app");
      const fallbackCmd = `open -a "Notion"`;
      log("NOTION_ACTION", `Executing fallback: ${fallbackCmd}`);
      shell(fallbackCmd);
      return "Notion activated (no URL provided)";
    }
    
    // Check if URL looks valid
    if (typeof url === 'string' && !url.startsWith("http")) {
      log("NOTION_ACTION", `WARNING - URL doesn't start with http: '${url}'`);
      log("NOTION_ACTION", "NOTION_ACTION: Will try to open anyway...");
    }
    
    // Log the exact command we're about to run
    const openCmd = `open "${url}"`;
    log("NOTION_ACTION", `Executing command: ${openCmd}`);
    log("NOTION_ACTION", `URL being opened: ${url}`);
    
    // Execute and capture any output
    const result = shell(openCmd);
    log("NOTION_ACTION", `Shell command result: ${result}`);
    
    log("NOTION_ACTION", "NOTION_ACTION: ========== END ==========");
    return "Notion page opened";
  },

  // Open URL in work browser (Chrome Beta)
  action_work: function(ctx) {
    const url = ctx.arg;
    const { log, shell } = ctx.builtins;

    if (!url) {
      return "No URL provided for work browser";
    }

    // Open URL in Chrome Beta
    const cmd = `open -a "Google Chrome Beta" "${url}"`;
    shell(cmd);
    return `Opened ${url} in Chrome Beta`;
  },

  // Open URL in Chrome browser
  action_chrome: function(ctx) {
    const url = ctx.arg;
    log(`[CHROME] ============= START =============`);
    log(`[CHROME] Function called with context:`);
    log("[CHROME]   ctx.arg", `'${ctx.arg}'`);
    log("JS", `[CHROME]   ctx.input: '${ctx.input}'`);
    log("JS", `[CHROME]   ctx.previous: '${ctx.previous}'`);
    log("JS", `[CHROME]   ctx.selected: '${ctx.selected}'`);
    log("JS", `[CHROME]   ctx.grabbed: '${ctx.grabbed}'`);
    log("JS", `[CHROME] URL to open: '${url}'`);
    
    const command = `open -a "Google Chrome" "${url}"`;
    log("JS", `[CHROME] Shell command to execute: '${command}'`);
    log(`[CHROME] Calling shell() function...`);
    
    try {
      const result = shell(command);
      log(`[CHROME] Shell execution completed`);
      log("JS", `[CHROME] Shell result: '${result}'`);
      log(`[CHROME] ============= END =============`);
      return `Opened ${url} in Chrome`;
    } catch (error) {
      log(`[CHROME] ERROR: Shell execution failed`);
      log("JS", `[CHROME] Error details: ${error}`);
      log(`[CHROME] ============= END WITH ERROR =============`);
      throw error;
    }
  },

  // Search and fill from 1Password
  action_1pass: function(ctx) {
    const { shell, shellSync } = ctx.builtins;
    const searchTerm = ctx.arg;
    
    // Try Quick Access first (most universal)
    try {
      shellSync("osascript -e 'tell application \"System Events\" to keystroke \" \" using {shift down, command down}'");
      shellSync("/bin/sleep 0.25");  // Wait for Quick Access to fully open
      
      // Type character by character for better reliability
      // Type the search term
      shellSync(`osascript -e 'tell application "System Events" to keystroke "${searchTerm}"'`);

      shellSync("/bin/sleep 0.5");  // Wait for 1Password popup to populate

      // Send space as separate keystroke to help with selection
      shellSync(`osascript -e 'tell application "System Events" to keystroke " "'`);

      shellSync("/bin/sleep 2.0");  // Wait for 1Password to search and show results
      shellSync("osascript -e 'tell application \"System Events\" to key code 36'");  // Press Enter to select and open
      shellSync("/bin/sleep 0.5");  // Wait for action to complete
    } catch (e) {
      // Fallback 1: Try menu bar access
      try {
        shell("osascript -e 'tell application \"System Events\" to tell process \"1Password 7 - Password Manager\" to click menu bar item 1 of menu bar 1'");
        shellSync("/bin/sleep 0.5");
        shell(`osascript -e 'tell application "System Events" to keystroke "${searchTerm}"'`);
        shellSync("/bin/sleep 0.5");
        shell(`osascript -e 'tell application "System Events" to keystroke " "'`);
        shell("osascript -e 'tell application \"System Events\" to key code 36'");
      } catch (e2) {
        // Fallback 2: Open 1Password app and use search
        shell("osascript -e 'tell application \"1Password\" to activate'");
        shellSync("/bin/sleep 0.5");
        shell("osascript -e 'tell application \"System Events\" to keystroke \"f\" using command down'");
        shellSync("/bin/sleep 0.2");
        shell(`osascript -e 'tell application "System Events" to keystroke "${searchTerm}"'`);
        shellSync("/bin/sleep 0.5");
        shell(`osascript -e 'tell application "System Events" to keystroke " "'`);
        shell("osascript -e 'tell application \"System Events\" to key code 36'");
      }
    }
    return "1Password search initiated";
  },


  // Open document with default application
  action_doc: function(ctx) {
    const { log, shell, shellWithExitCode, expandHome, file_exists } = ctx.builtins;
    const filePath = expandHome(ctx.arg);
    
    log("DOC", `Opening document: '${filePath}'`);
    
    // Check if file exists
    if (!fileExists(filePath)) {
      log("DOC", `Warning - File does not exist: ${filePath}`);
      // Try to open anyway, let the OS handle the error
    }
    
    // Open with default application for this file type
    log("DOC", `Opening with default application using 'open' command`);
    const openCommand = `open "${filePath}"`;
    
    const resultJson = shellWithExitCode(openCommand);
    const result = JSON.parse(resultJson);
    
    if (result.exitCode === 0) {
      log("DOC", `✓ Successfully opened document with default app`);
      return `Document opened: ${filePath}`;
    } else {
      log("DOC", `✗ Failed to open document: ${result.stderr}`);
      return `Error opening document: ${filePath}`;
    }
  },

  // Edit file with text editor
  action_edit: function(ctx) {
    const { log, shell, shellSync, expandHome } = ctx.builtins;
    const filePath = expandHome(ctx.arg);

    log("EDIT", `Opening file in editor: ${filePath}`);

    // Check for EDITOR environment variable using shell
    let editor = "";
    try {
      const editorOutput = shellSync("echo $EDITOR");
      // shellSync wraps output with "Command executed: " prefix, strip it
      let cleanOutput = editorOutput.trim();
      if (cleanOutput.startsWith("Command executed: ")) {
        cleanOutput = cleanOutput.substring("Command executed: ".length).trim();
      }
      editor = cleanOutput;
    } catch (e) {
      log("EDIT", `Could not read EDITOR variable: ${e}`);
    }

    let editorCmd;
    if (editor && editor.length > 0) {
      // Use user's preferred editor
      editorCmd = `${editor} "${filePath}"`;
      log("EDIT", `Using EDITOR environment variable: ${editor}`);
    } else {
      // Fall back to macOS default text editor via 'open -t'
      editorCmd = `open -t "${filePath}"`;
      log("EDIT", `No EDITOR set, using macOS default text editor`);
    }

    log("EDIT", `Executing: ${editorCmd}`);
    shell(editorCmd);

    return `Opened in editor: ${filePath}`;
  },

  // Search for contact in Contacts app
  action_contact: function(ctx) {
    const { log, shell, shellSync, shellWithExitCode } = ctx.builtins;
    
    // Use the search parameter from config (e.g., "{{command}}") 
    // This allows users to control what gets searched for
    const searchTerm = ctx.search || ctx.arg;
    
    // Strip @ prefix if present
    const contactName = searchTerm.startsWith('@') ? searchTerm.substring(1) : searchTerm;
    
    log("CONTACT", `Starting search for contact: '${contactName}' (from search: '${searchTerm}')`);
    
    // Use AppleScript to open Contacts and search for the contact
    const escapedName = contactName.replace(/"/g, '\\"').replace(/'/g, "'\"'\"'");
    
    // AppleScript to open Contacts, search, and select the contact
    const script = `
      tell application "Contacts"
        -- First, make sure the app is running and visible
        activate
        delay 0.5
        
        -- If minimized, bring it back
        tell application "System Events"
          tell process "Contacts"
            set visible to true
            if (count of windows) > 0 then
              perform action "AXRaise" of window 1
            end if
          end tell
          set frontmost of process "Contacts" to true
        end tell
        delay 1
        
        -- Search for the contact
        set searchResults to every person whose name contains "${escapedName}"
        
        if (count of searchResults) > 0 then
          -- Select the contact using built-in selection
          set selection to item 1 of searchResults
          delay 0.5
          
          set contactCount to count of searchResults
          set selectedName to name of item 1 of searchResults
          return "FOUND_DIRECT:" & contactCount & " matches - Selected: " & selectedName
        else
          -- If no exact match, try searching in the search field
          tell application "System Events"
            tell process "Contacts"
              -- Use Cmd+F to focus search field
              keystroke "f" using command down
              delay 0.2
              -- Clear existing search
              keystroke "a" using command down
              delay 0.1
              keystroke "${escapedName}"
            end tell
          end tell
          return "SEARCH_FIELD:No direct match, using search field"
        end if
      end tell
    `;
    
    try {
      // Use shellWithExitCode to capture the result
      const resultJson = shellWithExitCode(`osascript -e '${script}'`);
      const result = JSON.parse(resultJson);
      
      if (result.exitCode === 0) {
        const output = result.stdout.trim();
        if (output.startsWith("FOUND_DIRECT:")) {
          log("CONTACT", `✓ Found directly in database - ${output.substring(13)}`);
          return `Found contact directly: ${contactName}`;
        } else if (output.startsWith("SEARCH_FIELD:")) {
          log("CONTACT", `⚠ No direct match found - falling back to search field for: ${contactName}`);
          return `Searching via search field: ${contactName}`;
        } else {
          log("CONTACT", `Unexpected response: ${output}`);
        }
      } else {
        log("CONTACT", `✗ AppleScript failed with exit code ${result.exitCode}: ${result.stderr}`);
        // Fallback: just open Contacts app and let user search manually
        log("CONTACT", `Falling back to opening Contacts app for manual search`);
        shell('open -a Contacts');
      }
    } catch (error) {
      log("CONTACT", `✗ Error executing contact search: ${error}`);
      // Fallback: just open Contacts app and let user search manually
      log("CONTACT", `Falling back to opening Contacts app for manual search`);
      shell('open -a Contacts');
    }
    
    return `Contact search completed: ${contactName}`;
  },


  // Navigate to Slack channel
  action_slack: function(ctx) {
    const { shell, shellSync } = ctx.builtins;
    const channel = ctx.arg;
    
    // Use AppleScript to activate Slack and navigate to channel
    shell(`osascript -e 'tell application "Slack" to activate'`);
    shellSync("/bin/sleep 0.5");
    // Open quick switcher with Cmd+K
    shell(`osascript -e 'tell application "System Events" to keystroke "k" using {command down}'`);
    shellSync("/bin/sleep 0.5");
    // Type the channel name
    shell(`osascript -e 'tell application "System Events" to keystroke "${channel}"'`);
    shellSync("/bin/sleep 0.5");
    // Press Enter to navigate
    shell(`osascript -e 'tell application "System Events" to keystroke return'`);
  },


  // Force rescan of markdown files
  action_rescan: function(ctx) {
    const { log } = ctx.builtins;
    log("Forcing rescan of markdown files and filesystem...");
    // This will trigger a rescan in the popup application
    return "Rescan triggered";
  },



  // Helper function: Give up focus to previous application
  give_up_focus: function(ctx) {
    const { shell, shellSync } = ctx.builtins;
    // Give focus to the previous application using Cmd+Tab
    shell("osascript -e 'tell application \"System Events\" to key code 48 using command down'");
    shellSync("/bin/sleep 0.15"); // Brief delay to ensure focus transfer completes
  },


  // Helper function: Regain focus for the anchor selector
  regain_focus: function(ctx) {
    const { shell, shellSync } = ctx.builtins;
    // Bring focus back to the popup_server process
    shell("osascript -e 'tell application \"System Events\" to set frontmost of process \"popup_server\" to true'");
    shellSync("/bin/sleep 0.1"); // Brief delay to ensure focus transfer completes
  },


  // REMOVED: start_claude_code - was never used


  
  // Anchor action - behaves exactly like markdown action
  // Anchors and markdown files are both just documents that open the same way
  action_anchor: function(ctx) {
    const { log, error, file_exists, isDirectory, saveAnchor } = ctx.builtins;

    // Debug: Log everything available in the context
    log("=== ANCHOR ACTION DEBUG ===");
    log(`Full ctx object: ${JSON.stringify(ctx, null, 2)}`);
    log("Available in ctx:");
    for (const key in ctx) {
      if (ctx.hasOwnProperty(key)) {
        log(`  ${key}: '${ctx[key]}'`);
      }
    }
    log("=== END ANCHOR DEBUG ===");

    const { command_name, arg, input, last_anchor_input } = ctx;

    // 1. Save last anchor (this is what makes anchor special)
    // Priority: last_anchor_input (from template expansion) > input > command_name (fallback)
    const anchor_text = (last_anchor_input && last_anchor_input.trim() !== '') ? last_anchor_input :
                        (input && input.trim() !== '') ? input : command_name;
    const source = (last_anchor_input && last_anchor_input.trim() !== '') ? 'last_anchor_input parameter' :
                   (input && input.trim() !== '') ? 'input parameter' : 'command_name';
    log(`ANCHOR: Saving last anchor: '${anchor_text}' (source: ${source})`);
    if (anchor_text) {
      saveAnchor(anchor_text);
    }

    // If no argument, silently do nothing (virtual anchors like "Notion Root")
    if (!arg) {
      log("ANCHOR", "No argument provided, doing nothing (virtual anchor)");
      return "Virtual anchor processed";
    }

    log("ANCHOR", `Processing argument: '${arg}'`);

    // 2. Dynamically determine action type (equivalent to get_action_for_arg)
    let actionType;

    // Check URLs first
    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      if (arg.includes('notion.so')) {
        actionType = 'notion';
      } else {
        actionType = 'url';
      }
    } else if (arg.startsWith('obsidian://')) {
      actionType = 'obs_url';
    } else {
      // File/folder path - check if it's a directory
      if (fileExists(arg) && isDirectory(arg)) {
        actionType = 'folder';
      } else {
        // File path - check extension
        const argLower = arg.toLowerCase();
        if (argLower.endsWith('.md')) {
          // Check if it's an anchor file (simple heuristic)
          if (arg.includes('/') && argLower.includes('.md')) {
            actionType = 'markdown';  // For now, treat all .md as markdown
          } else {
            actionType = 'markdown';
          }
        } else if (argLower.endsWith('.txt') || argLower.endsWith('.text')) {
          actionType = 'text';
        } else if (argLower.endsWith('.pdf') || argLower.endsWith('.doc') || argLower.endsWith('.docx')) {
          actionType = 'doc';
        } else if (argLower.endsWith('.app')) {
          actionType = 'app';
        } else if (argLower.endsWith('.html') || argLower.endsWith('.htm')) {
          actionType = 'url';
        } else {
          actionType = 'doc';  // Default for unknown files
        }
      }
    }

    log("ANCHOR", `Inferred action type: '${actionType}' for argument: '${arg}'`);

    // 3. Dynamically call the appropriate sub-action
    const functionName = `action_${actionType}`;
    if (typeof globalThis[functionName] === 'function') {
      log("ANCHOR", `Delegating to ${functionName}`);
      return globalThis[functionName](arg, ctx.input, ctx.previous, ctx.grabbed, ctx.date);
    } else {
      const errorMsg = `No handler found for action type '${actionType}' (function: ${functionName})`;
      error(errorMsg);
      log("ANCHOR", `ERROR: ${errorMsg}`);
      return errorMsg;
    }
  },

  // TEST: Function to test JavaScript error reporting
  action_test_error: function(ctx) {
    const { error, detailedLog } = ctx.builtins;
    log("TEST_ERROR", "About to throw a JavaScript error for testing");

    // This will definitely throw an error
    nonexistent_function_call();

    return "This should never be reached";
  },

  // TEST: Function to debug available builtins
  action_test_builtins: function(ctx) {
    const { log } = ctx.builtins;

    log("BUILTINS_TEST: Available builtins:");
    for (const key in ctx.builtins) {
      log(`BUILTINS_TEST: - ${key}: ${typeof ctx.builtins[key]}`);
    }

    return "Builtins logged";
  },
  
  // NEW: TMUX activation using only the shell commands available to JavaScript
  // This reimplements the Rust version using shellWithExitCode, shell, and error
  action_activate_tmux: function(ctx) {
    const { log, shell, shellWithExitCode, error, file_exists, dirname, shellSync, saveAnchor } = ctx.builtins;
    const fullPath = ctx.arg;
    const { command_name, last_anchor_input, input } = ctx;

    try {
      log("🚀 TMUX_DEBUG: ==================== TMUX ACTIVATION START ====================");
      log(`🚀 TMUX_DEBUG: Received arg: '${fullPath}'`);
      log(`🚀 TMUX_DEBUG: Type of arg: ${typeof fullPath}`);

      // Save last anchor first
      const anchor_text = (last_anchor_input && last_anchor_input.trim() !== '') ? last_anchor_input :
                          (input && input.trim() !== '') ? input : command_name;
      log("TMUX_ACTIVATE", `Saving last anchor: '${anchor_text}'`);
      if (anchor_text) {
        saveAnchor(anchor_text);
      }

      if (!fullPath) {
        log("🚀 TMUX_DEBUG: ERROR - No path provided");
        error("No path provided for TMUX activation");
        return;
      }
    
      // Extract folder path from the full path (might be a .md file or folder)
    let folder_path;
    if (fullPath.endsWith('.md')) {
      log("TMUX_DEBUG", "Path ends with .md, extracting parent directory");
      // It's a markdown file, get the parent directory using dirname built-in
      folder_path = dirname(fullPath);
      log("TMUX_DEBUG", `Extracted folder_path using dirname: '${folder_path}'`);
    } else {
      log("TMUX_DEBUG", "Path is already a folder");
      // It's already a folder
      folder_path = fullPath;
    }
    
    log("ACTIVATE_TMUX_JS", `Starting activation for folder: ${folder_path}`);
    log("TMUX_DEBUG", `Line 703: folder_path = '${folder_path}'`);

    // 1. Open folder in Finder (matching Rust implementation)
    // COMMENTED OUT - User has separate commands for folder/markdown actions
    // log("TMUX_DEBUG", `Line 715: Opening folder in Finder: '${folder_path}');
    // try {
    //   shell(`open "${folder_path}"`);
    //   log("TMUX_DEBUG", "Line 716: Finder open command executed successfully");
    // } catch (e) {
    //   log("TMUX_DEBUG", `Line 716: ERROR opening Finder: ${e}`);
    // }
    
    // 2. Get session name from folder name and sanitize it
    const folder_name = folder_path.split('/').pop() || 'session';
    const session_name = folder_name
      .replace(/ /g, '_')
      .replace(/@/g, '_')
      .replace(/:/g, '_')
      .replace(/\./g, '_')
      .replace(/\[/g, '_')
      .replace(/\]/g, '_')
      .replace(/\(/g, '_')
      .replace(/\)/g, '_')
      .replace(/\$/g, '_')
      .replace(/#/g, '_')
      .replace(/&/g, '_')
      .replace(/\*/g, '_')
      .replace(/!/g, '_')
      .replace(/\?/g, '_')
      .replace(/\//g, '_')
      .replace(/\\/g, '_')
      .replace(/'/g, '_')
      .replace(/"/g, '_');

    log("ACTIVATE_TMUX_JS", `Folder name: '${folder_name}', Session name: '${session_name}'`);

    // 3. Check for .tmuxp.yaml
    const tmuxp_path = `${folder_path}/.tmuxp.yaml`;
    const has_tmuxp = fileExists(tmuxp_path);
    log("TMUX_DEBUG", `Checking for .tmuxp.yaml at: '${tmuxp_path}' - ${has_tmuxp ? 'FOUND' : 'NOT FOUND'}`);

    if (has_tmuxp) {
      log("ACTIVATE_TMUX_JS", `Found .tmuxp.yaml at ${tmuxp_path}`);
    } else {
      log("ACTIVATE_TMUX_JS", `No .tmuxp.yaml found, will create basic session '${session_name}'`);
    }

    // 4. Check if session exists
    log("TMUX_DEBUG", `Line 738: Checking if session '${session_name}' exists`);
    const checkCmd = `/opt/homebrew/bin/tmux has-session -t "${session_name}" 2>/dev/null`;
    log("TMUX_DEBUG", `Line 739: Running command: '${checkCmd}'`);
    
    const checkResult = shellWithExitCode(checkCmd);
    log("TMUX_DEBUG", `Line 740: Raw checkResult: '${checkResult}'`);
    
    let checkData;
    try {
      checkData = JSON.parse(checkResult);
      log("TMUX_DEBUG", `Line 742: Parsed checkData - exitCode: ${checkData.exitCode}, stdout: '${checkData.stdout}', stderr: '${checkData.stderr}'`);
    } catch (e) {
      log("TMUX_DEBUG", `Line 743: ERROR - Failed to parse check result: ${e}`);
      log("TMUX_DEBUG", `Line 743: Raw result was: '${checkResult}'`);
      log("ACTIVATE_TMUX_JS", `Failed to parse check result: ${e}`);
      error("Failed to check TMUX session status");
      return;
    }
    
    const session_exists = checkData.exitCode === 0;
    log("TMUX_DEBUG", `Line 748: Session exists: ${session_exists}`);
    
    if (!session_exists) {
      log("TMUX_DEBUG", `Session does not exist, creating new session '${session_name}'`);
      log("ACTIVATE_TMUX_JS", `Creating new tmux session '${session_name}'`);

      if (has_tmuxp) {
        // Create session with tmuxp
        log("ACTIVATE_TMUX_JS", `Using tmuxp to create session from ${tmuxp_path}`);
        const createCmd = `cd "${folder_path}" && /opt/homebrew/bin/tmuxp load ".tmuxp.yaml" -d 2>&1`;
        log("TMUX_DEBUG", `Running tmuxp command: '${createCmd}'`);

        const createResult = shellWithExitCode(createCmd);
        log("TMUX_DEBUG", `Raw createResult: '${createResult}'`);

        let createData;
        try {
          createData = JSON.parse(createResult);
          log("TMUX_DEBUG", `Parsed createData - exitCode: ${createData.exitCode}`);
        } catch (e) {
          log("ACTIVATE_TMUX_JS", `Failed to parse create result: ${e}`);
          error("Failed to create TMUX session");
          return;
        }

        if (createData.exitCode !== 0) {
          log("ACTIVATE_TMUX_JS", `tmuxp failed with exit code ${createData.exitCode}: ${createData.stderr}`);
          error(`Failed to create TMUX session: ${createData.stderr || createData.stdout}`);
          return;
        }

        log("ACTIVATE_TMUX_JS", "tmuxp completed successfully");
        shellSync("/bin/sleep 0.5");
      } else {
        // Create basic session without tmuxp
        log("ACTIVATE_TMUX_JS", `Creating basic tmux session '${session_name}' in ${folder_path}`);
        const basicCmd = `/opt/homebrew/bin/tmux new-session -d -s "${session_name}" -c "${folder_path}" 2>&1`;
        log("TMUX_DEBUG", `Running basic tmux command: '${basicCmd}'`);

        const basicResult = shellWithExitCode(basicCmd);
        let basicData;
        try {
          basicData = JSON.parse(basicResult);
          if (basicData.exitCode !== 0) {
            log("ACTIVATE_TMUX_JS", `Basic tmux failed: ${basicData.stderr}`);
            error(`Failed to create TMUX session: ${basicData.stderr}`);
            return;
          }
          log("ACTIVATE_TMUX_JS", `Basic session '${session_name}' created successfully`);
        } catch (e) {
          log("ACTIVATE_TMUX_JS", `Failed to parse basic session result: ${e}`);
        }
        shellSync("/bin/sleep 0.3");
      }
    } else {
      log("TMUX_DEBUG", `Line 794: Session '${session_name}' already exists, skipping creation`);
      log("ACTIVATE_TMUX_JS", `Session '${session_name}' already exists`);
    }
    
    // Longer delay to ensure session is fully ready
    log("TMUX_DEBUG", "Line 798: Sleeping for 1 second to ensure session is ready");
    try {
      shellSync("/bin/sleep 1.0");
      log("TMUX_DEBUG", "Line 799: Sleep completed");
    } catch (e) {
      log("TMUX_DEBUG", `Line 799: ERROR during sleep: ${e}`);
    }
    
    // 5. Check if there are existing TMUX clients and switch/attach accordingly
    log(`ACTIVATE_TMUX_JS: Checking for existing TMUX clients`);
    const clientsResult = shellWithExitCode("/opt/homebrew/bin/tmux list-clients 2>/dev/null");
    let has_clients = false;
    try {
      const clientsData = JSON.parse(clientsResult);
      has_clients = clientsData.exitCode === 0 && clientsData.stdout.trim().length > 0;
      if (has_clients) {
        log("ACTIVATE_TMUX_JS", `Found TMUX clients: ${clientsData.stdout.trim()}`);
      } else {
        log(`ACTIVATE_TMUX_JS: No TMUX clients found`);
      }
    } catch (e) {
      log("ACTIVATE_TMUX_JS", `Failed to check clients: ${e}`);
    }
    
    // Different approach based on whether clients exist
    if (has_clients) {
      // There are existing TMUX clients - use switch-client
      // When called from outside TMUX, this switches the most recently used client
      log(`ACTIVATE_TMUX_JS: Using switch-client for existing TMUX clients`);
      const switchResult = shellWithExitCode(`/opt/homebrew/bin/tmux switch-client -t "${session_name}" 2>&1`);
      
      try {
        const switchData = JSON.parse(switchResult);
        if (switchData.exitCode === 0) {
          log("ACTIVATE_TMUX_JS", `Successfully switched to session '${session_name}'`);

          // Send directory change to tmux session
          log("TMUX_ACTIVATE", `Sending directory change to tmux session '${session_name}'`);
          shellSync(`/opt/homebrew/bin/tmux send-keys -t "${session_name}" "cd '${folder_path}'" C-m`);

          // Wait a moment for cd to complete before running startup command
          shellSync("/bin/sleep 0.3");

          // Get startup command from config and run it if configured
          const startupCommand = getConfigString("launcher_settings.tmux_startup_command");
          if (startupCommand && startupCommand.trim() !== '') {
            log("TMUX_ACTIVATE", `Running startup command in tmux session: ${startupCommand}`);
            shellSync(`/opt/homebrew/bin/tmux send-keys -t "${session_name}" "${startupCommand}" C-m`);
          }

          // Activate Terminal to bring it to foreground
          shell(`osascript -e 'tell application "Terminal" to activate'`);
        } else {
          log("ACTIVATE_TMUX_JS", `Failed to switch: ${switchData.stderr || switchData.stdout}`);
          error(`Failed to switch to TMUX session: ${switchData.stderr || switchData.stdout}`);
        }
      } catch (e) {
        log("ACTIVATE_TMUX_JS", `Failed to parse switch result: ${e}`);
      }
    } else {
      // No existing clients - show error (matching Rust behavior)
      log(`ACTIVATE_TMUX_JS: No TMUX clients found - showing error to user`);
      error(
        `Cannot switch to TMUX session '${session_name}': No TMUX client is running.\n\n` +
        `Please open a terminal and run:\n` +
        `tmux attach-session -t '${session_name}'`
      );
    }
    
    // Request exit after successful activation
    log("TMUX_DEBUG", "Line 908: Function completed successfully, returning exit:true");
    log("TMUX_DEBUG", "==================== TMUX ACTIVATION END ====================");
    return { exit: true };
    } catch (e) {
      log("TMUX_DEBUG", `ERROR in action_activate_tmux: ${e}`);
      error(`TMUX activation failed: ${e}`);
    }
  },

  action_grab: function(ctx) {
    const { log, error, shellSync } = ctx.builtins;

    // Use log for visibility
    log("GRAB: action_grab: Starting grab operation via CLI");

    try {
      // Use the CLI grab command to perform the grab operation
      log("GRAB: action_grab: Calling shellSync...");

      const grab_output = shellSync("~/Projects/HookAnchor/HookAnchorApp/target/release/ha --grab");

      log(`GRAB: action_grab: Raw grab output: '${grab_output}'`);

      // shellSync wraps output with "Command executed: " prefix, strip it
      let clean_output = grab_output.trim();
      if (clean_output.startsWith("Command executed: ")) {
        clean_output = clean_output.substring("Command executed: ".length);
      }

      log(`GRAB: action_grab: Clean grab output: '${clean_output}'`);

      // Return the clean output (format: "action argument")
      // The popup will parse this into action and argument
      return clean_output;

    } catch (err) {
      // Detailed error logging
      const errorDetails = `action_grab ERROR: ${err}\nStack: ${err.stack || 'No stack trace'}\nMessage: ${err.message || err}`;

      // Log to file
      log(`GRAB: ${errorDetails}`);

      // Show to user via error dialog
      error(`Grab failed: ${err.message || err}`);

      return "";
    }
  },

  // Clear the anchor.log file for debugging
  action_clear_log: function(ctx) {
    const { shellSync } = ctx.builtins;

    // Clear the log file by truncating it to empty
    shellSync("truncate -s 0 ~/.config/hookanchor/anchor.log");

    // Return empty string to avoid any success logging
    return "";
  },

  // Test function that deliberately throws an error
  action_test_error: function(ctx) {
    const { log } = ctx.builtins;

    log("TEST_ERROR: About to throw a test error");

    // This will cause a ReferenceError
    nonExistentVariable.doSomething();

    return "This should never execute";
  },

};
