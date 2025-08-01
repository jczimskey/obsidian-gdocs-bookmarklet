// Configuration for the Obsidian Google Docs Bookmarklet
// ⚠️ SECURITY WARNING: This config is used by client-side JavaScript
// DO NOT commit your actual token to version control!

const CONFIG = {
    // Your GitHub Fine-Grained Personal Access Token
    // Generate at: GitHub Settings → Developer settings → Personal access tokens → Fine-grained
    // Permissions needed: Contents (Write), Metadata (Read)
    // Scope: Only your Obsidian notes repository
    GITHUB_TOKEN: 'your_fine_grained_token_here',
    
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