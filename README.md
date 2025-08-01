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

### Step 1: Choose Your Security Approach

**⚠️ Security Note**: This bookmarklet requires a GitHub token to function. Since bookmarklets run client-side JavaScript, the token cannot be truly secret. Choose the most secure option for your needs:

#### Option A: Personal Access Token (Fine-grained, Recommended)

1. Create a **fine-grained personal access token** in GitHub Settings
2. Scope it to **only your Obsidian notes repository**
3. Grant only **Contents: Write** and **Metadata: Read** permissions
4. Set a short expiration period (30-90 days)

#### Option B: Server-Side Proxy (Most Secure)

For maximum security, consider creating a simple server endpoint that:

- Accepts note data via POST request
- Uses repository secrets to store the GitHub token
- Forwards requests to GitHub API
- Update the bookmarklet to call your server instead of GitHub directly

### Step 2: Configure Settings

Edit `config.js` with your GitHub details:

```javascript
const CONFIG = {
    GITHUB_TOKEN: 'your_fine_grained_token_here', // Use fine-grained token
    REPO_OWNER: 'your_username',
    REPO_NAME: 'obsidian-notes',
    NOTES_PATH: 'Meeting Notes/' // Optional: subfolder for meeting notes
};
```

### Step 3: Create the Bookmarklet

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

**Important**: Use **fine-grained personal access tokens** for better security:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Generate a new fine-grained token with:
   - **Repository access**: Only select repositories (choose your Obsidian notes repo)
   - **Permissions**: Contents (Write), Metadata (Read)
   - **Expiration**: 30-90 days (shorter is more secure)
3. Add it to your `config.js`

### Alternative: Server-Side Proxy

For production use, consider creating a simple server proxy:

```javascript
// Example Express.js endpoint
app.post('/api/save-note', async (req, res) => {
  const { filename, content } = req.body;
  
  // GitHub token stored securely on server
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filename}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`, // From server environment
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Add note: ${filename}`,
      content: Buffer.from(content).toString('base64')
    })
  });
  
  res.json(await response.json());
});
```

Then update the bookmarklet to call your server instead of GitHub directly.

## Customization

- Modify the note template in `bookmarklet.js`
- Adjust styling in `style.css`
- Add custom fields to the capture form

## Contributing

Feel free to submit issues and pull requests to improve this tool!