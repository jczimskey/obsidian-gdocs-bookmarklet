// Configuration for the Obsidian Google Docs Bookmarklet
// Copy this file to config.local.js and add your actual values

const CONFIG = {
    // Your GitHub Personal Access Token (with repo permissions)
    GITHUB_TOKEN: 'your_github_token_here',
    
    // Your GitHub username
    REPO_OWNER: 'your_username',
    
    // Your Obsidian notes repository name
    REPO_NAME: 'obsidian-notes',
    
    // Optional: Path within your repo for meeting notes (with trailing slash)
    // Leave empty string '' for root directory
    NOTES_PATH: 'Meeting Notes/',
    
    // Default note template settings
    TEMPLATE: {
        // Include document title in the note
        includeDocTitle: true,
        
        // Include document URL
        includeDocUrl: true,
        
        // Include timestamp
        includeTimestamp: true,
        
        // Default tags to add to every note
        defaultTags: ['#meeting-notes', '#imported'],
        
        // File naming pattern: 'timestamp', 'title', or 'custom'
        fileNaming: 'timestamp'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}