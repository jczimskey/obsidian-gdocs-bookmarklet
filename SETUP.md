# Setup Guide

## Quick Start

### 1. Get Your GitHub Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "Obsidian Bookmarklet"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### 2. Configure the Bookmarklet

You have two options:

#### Option A: Edit the Minified Code (Recommended)
1. Open `bookmarklet.min.js` in this repository
2. Find this line: `GITHUB_TOKEN:'YOUR_TOKEN_HERE'`
3. Replace `YOUR_TOKEN_HERE` with your actual token
4. Update `REPO_OWNER` and `REPO_NAME` to match your Obsidian repository
5. Copy the entire modified code

#### Option B: Create a Personal Copy
1. Fork this repository
2. Edit `config.js` with your settings
3. Use a build tool to create your own minified version

### 3. Create the Bookmark

1. **Chrome/Edge:**
   - Right-click the bookmarks bar → "Add page"
   - Name: "📝 Save to Obsidian"
   - URL: Paste the JavaScript code (starts with `javascript:`)

2. **Firefox:**
   - Bookmarks → Manage Bookmarks → Add Bookmark
   - Name: "📝 Save to Obsidian"  
   - Location: Paste the JavaScript code

3. **Safari:**
   - Bookmarks → Add Bookmark
   - Name: "📝 Save to Obsidian"
   - URL: Paste the JavaScript code

### 4. Test It Out

1. Open any Google Doc
2. Select some text
3. Click your bookmarklet
4. Fill in the form
5. Click "Save to Obsidian"

## Configuration Options

Edit these values in the bookmarklet code:

```javascript
const CONFIG = {
    GITHUB_TOKEN: 'your_token_here',     // Your GitHub token
    REPO_OWNER: 'jczimskey',             // Your GitHub username
    REPO_NAME: 'obsidian-notes',         // Your repo name
    NOTES_PATH: 'Meeting Notes/'         // Subfolder (optional)
};
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit your token to a public repository**
2. **Your token has full repo access** - treat it like a password
3. **Consider using a dedicated token** just for this bookmarklet
4. **Regenerate your token if compromised**

## Troubleshooting

### "Please configure your GitHub token" Error
- Make sure you replaced `YOUR_TOKEN_HERE` with your actual token
- Check that the token has `repo` permissions

### "Failed to save to GitHub" Error
- Verify your repository name and owner are correct
- Make sure the repository exists and you have write access
- Check that the `NOTES_PATH` folder exists (or leave it empty)

### Bookmarklet Doesn't Appear
- Make sure you copied the entire JavaScript code
- The URL should start with `javascript:`
- Try refreshing the Google Docs page

### No Text Selected Warning
- You must highlight/select text in the Google Doc first
- The bookmarklet only works on `docs.google.com` pages

## Advanced Customization

### Changing the Note Template

Edit the `generateNoteContent` function in `bookmarklet.js`:

```javascript
function generateNoteContent(data) {
    // Customize this template
    return `# ${data.meetingTitle}

**Date:** ${new Date(data.timestamp).toLocaleDateString()}
**Attendees:** ${data.attendees}

## Key Points

${data.selectedText}

## Action Items

- [ ] 

---
*Source: [${data.docTitle}](${data.docUrl})*`;
}
```

### Adding Custom Fields

Modify the form HTML in the `createCaptureForm` function to add new fields:

```html
<div class="form-group">
    <label for="project">Project:</label>
    <input type="text" id="project" placeholder="Project name">
</div>
```

Then update the `saveToObsidian` function to use the new field.

## Need Help?

- Check the [demo page](demo.html) for testing
- Open an issue in this repository
- Verify your setup with the troubleshooting steps above