# Obsidian Google Docs Capture Extension

A browser extension that captures highlighted text from Google Docs and saves it directly to your Obsidian notes repository via GitHub API.

## 🌟 Why Browser Extension Instead of Bookmarklet?

- **🔒 Better Security**: No Content Security Policy issues
- **🦊 Firefox Compatible**: Works reliably in all modern browsers
- **⚡ Better Performance**: Native browser APIs instead of injected JavaScript
- **🎨 Better UI**: Dedicated popup interface with proper styling
- **⚙️ Settings Page**: Secure storage for configuration

## Features

- 📝 Capture selected text from any Google Doc with one click
- 🔗 Clean, native browser extension interface
- 📅 Automatic meeting note formatting with customizable templates
- 🏷️ Add context like meeting title, attendees, and tags
- 🔄 Direct GitHub API integration with fine-grained token support
- 📋 Markdown formatting optimized for Obsidian
- 🔒 Secure settings storage using browser APIs

## Quick Setup

1. **Load the extension** in your browser (Chrome/Firefox/Edge)
2. **Configure GitHub settings** in the extension options
3. **Select text** in Google Docs and click the extension icon
4. **Fill in meeting details** and save to your Obsidian repository

## Installation

### Step 1: Load the Extension

#### Chrome/Edge:
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder

#### Firefox:

1. Open `about:debugging`
2. Click "This Firefox"  
3. Click "Load Temporary Add-on"
4. Select the `manifest-v2.json` file (Firefox requires Manifest V2)

**Note**: Firefox uses `manifest-v2.json` instead of `manifest.json` due to limited Manifest V3 support.

### Step 2: Configure Settings

1. Click the extension icon and select "Settings"
2. Or right-click the extension icon → "Options"
3. Fill in your GitHub repository details:

**Required Settings:**
- **GitHub Token**: Fine-grained personal access token
- **Repository Owner**: Your GitHub username
- **Repository Name**: Your Obsidian notes repository

**Optional Settings:**
- **Notes Path**: Subfolder for meeting notes (e.g., "Meeting Notes/")
- **Template Settings**: Customize what gets included in notes
- **Default Tags**: Tags automatically added to every note

### Step 3: Create GitHub Token

1. Go to [GitHub Settings → Personal access tokens → Fine-grained tokens](https://github.com/settings/personal-access-tokens/fine-grained)
2. Click "Generate new token"
3. Configure:
   - **Repository access**: Only select your Obsidian notes repository
   - **Permissions**: 
     - Contents (Write) - to create/update files
     - Metadata (Read) - to access repository info
   - **Expiration**: 90 days or less (more secure)
4. Copy the token and add it to extension settings

## Usage

1. **Open any Google Doc**
2. **Select/highlight** the text you want to capture
3. **Click the extension icon** (📝) in your browser toolbar
4. **Fill in the meeting details**:
   - Meeting Title (required)
   - Attendees (optional)
   - Tags (optional, defaults to "meeting-notes")
   - Custom filename (optional, auto-generated if empty)
5. **Click "Save to Obsidian"**

The extension will create a properly formatted Markdown file in your Obsidian repository!

## Security Features

### Fine-Grained Tokens (Recommended)
- Scope access to only your Obsidian repository
- Minimal permissions (Contents: Write, Metadata: Read)
- Short expiration periods for better security

### Secure Storage
- Settings stored using browser's secure storage APIs
- Tokens encrypted at rest by the browser
- No data transmitted to third parties

### Privacy
- No analytics or tracking
- All data stays between your browser, GitHub, and Obsidian
- Open source for full transparency

## File Structure

```text
├── manifest.json          # Extension manifest (Manifest V3 - Chrome/Edge)
├── manifest-v2.json       # Extension manifest (Manifest V2 - Firefox)
├── popup.html             # Extension popup interface
├── popup.js               # Popup logic and GitHub API calls
├── popup.css              # Popup styling
├── options.html           # Settings page
├── options.js             # Settings page logic
├── options.css            # Settings page styling
├── content.js             # Content script for Google Docs
├── content.css            # Content script styles
├── background.js          # Background script
├── icons/                 # Extension icons (16, 32, 48, 128px)
└── README.md              # This file
```

## Legacy Files (Bookmarklet Version)

The following files are kept for reference but are no longer needed:

- `bookmarklet.js` - Original bookmarklet code
- `bookmarklet.min.js` - Minified bookmarklet
- `config.js` - Old configuration file
- `demo.html` - Bookmarklet demo page
- `firefox-test.js` - Firefox troubleshooting

## Troubleshooting

### Extension Not Loading

1. **Firefox**: Make sure you selected `manifest-v2.json` (not `manifest.json`)
2. **Chrome/Edge**: Use `manifest.json` and enable "Developer Mode"
3. **Check Console Errors**: Look for JavaScript errors in browser developer tools
4. **Permissions**: Ensure the extension has access to Google Docs when prompted

### No Text Captured

1. **Select text first**: Highlight text in Google Docs before clicking the extension
2. **Check permissions**: Ensure the extension has permission to access Google Docs
3. **Refresh the page**: Sometimes a page refresh helps with content script loading

### GitHub API Errors

1. **Test connection**: Use the "Test Connection" button in settings
2. **Check token permissions**: Ensure Contents (Write) and Metadata (Read) are granted
3. **Verify repository exists**: Double-check repository owner and name
4. **Token expiration**: Fine-grained tokens expire - check if yours is still valid

## Development

To modify or extend this extension:

1. **Make changes** to the source files
2. **Reload the extension** in your browser's extension manager
3. **Test thoroughly** on actual Google Docs pages
4. **Check console logs** for any JavaScript errors

## Contributing

Feel free to submit issues and pull requests to improve this tool!