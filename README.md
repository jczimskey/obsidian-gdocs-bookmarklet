# Obsidian Google Docs Bookmarklet

A simple bookmarklet tool that captures highlighted text from Google Docs and saves it directly to your Obsidian notes repository via GitHub API.

## Features

- 📝 Capture selected text from any Google Doc
- 🔗 One-click bookmarklet interface
- 📅 Automatic meeting note formatting
- 🏷️ Add context like meeting title, attendees, and tags
- 🔄 Direct GitHub API integration
- 📋 Markdown formatting for Obsidian compatibility

## Quick Setup

1. **Configure your settings** in `config.js`
2. **Add the bookmarklet** to your browser bookmarks
3. **Select text** in Google Docs and click your bookmarklet
4. **Fill in the form** and save to your Obsidian repo

## Files

- `bookmarklet.js` - Main bookmarklet code
- `config.js` - Configuration settings
- `style.css` - Popup styling
- `demo.html` - Test the bookmarklet locally

## Installation

### Step 1: Configure Settings

Edit `config.js` with your GitHub details:

```javascript
const CONFIG = {
    GITHUB_TOKEN: 'your_github_token_here',
    REPO_OWNER: 'your_username',
    REPO_NAME: 'obsidian-notes',
    NOTES_PATH: 'Meeting Notes/' // Optional: subfolder for meeting notes
};
```

### Step 2: Create the Bookmarklet

1. Copy the minified code from `bookmarklet.min.js`
2. Create a new bookmark in your browser
3. Set the URL to the JavaScript code (starting with `javascript:`)

### Step 3: Usage

1. Open any Google Doc
2. Highlight the text you want to capture
3. Click your bookmarklet
4. Fill in the meeting details
5. Click "Save to Obsidian"

## GitHub Token Setup

You'll need a GitHub Personal Access Token with `repo` permissions:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` scope
3. Add it to your `config.js`

⚠️ **Security Note**: Never commit your token to a public repository!

## Customization

- Modify the note template in `bookmarklet.js`
- Adjust styling in `style.css`
- Add custom fields to the capture form

## Contributing

Feel free to submit issues and pull requests to improve this tool!