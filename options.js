// Options page script
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    
    document.getElementById('settings-form').addEventListener('submit', handleSave);
    document.getElementById('test-connection').addEventListener('click', handleTest);
});

async function loadSettings() {
    const settings = await chrome.storage.sync.get([
        'githubToken',
        'repoOwner', 
        'repoName',
        'notesPath',
        'includeDocTitle',
        'includeDocUrl', 
        'includeTimestamp',
        'defaultTags'
    ]);
    
    // Populate form fields
    if (settings.githubToken) document.getElementById('github-token').value = settings.githubToken;
    if (settings.repoOwner) document.getElementById('repo-owner').value = settings.repoOwner;
    if (settings.repoName) document.getElementById('repo-name').value = settings.repoName;
    if (settings.notesPath) document.getElementById('notes-path').value = settings.notesPath;
    if (settings.defaultTags) document.getElementById('default-tags').value = settings.defaultTags;
    
    // Populate checkboxes (default to true if not set)
    document.getElementById('include-doc-title').checked = settings.includeDocTitle !== false;
    document.getElementById('include-doc-url').checked = settings.includeDocUrl !== false;
    document.getElementById('include-timestamp').checked = settings.includeTimestamp !== false;
}

async function handleSave(event) {
    event.preventDefault();
    
    const settings = {
        githubToken: document.getElementById('github-token').value.trim(),
        repoOwner: document.getElementById('repo-owner').value.trim(),
        repoName: document.getElementById('repo-name').value.trim(),
        notesPath: document.getElementById('notes-path').value.trim(),
        includeDocTitle: document.getElementById('include-doc-title').checked,
        includeDocUrl: document.getElementById('include-doc-url').checked,
        includeTimestamp: document.getElementById('include-timestamp').checked,
        defaultTags: document.getElementById('default-tags').value.trim()
    };
    
    // Validate required fields
    if (!settings.githubToken || !settings.repoOwner || !settings.repoName) {
        showStatus('Please fill in all required fields (marked with *)', 'error');
        return;
    }
    
    // Validate token format
    if (!settings.githubToken.startsWith('ghp_') && !settings.githubToken.startsWith('github_pat_')) {
        showStatus('GitHub token should start with "ghp_" (classic) or "github_pat_" (fine-grained)', 'error');
        return;
    }
    
    try {
        await chrome.storage.sync.set(settings);
        showStatus('✅ Settings saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showStatus('❌ Failed to save settings: ' + error.message, 'error');
    }
}

async function handleTest() {
    const testBtn = document.getElementById('test-connection');
    const githubToken = document.getElementById('github-token').value.trim();
    const repoOwner = document.getElementById('repo-owner').value.trim();
    const repoName = document.getElementById('repo-name').value.trim();
    
    if (!githubToken || !repoOwner || !repoName) {
        showStatus('Please fill in GitHub token, repository owner, and repository name first', 'error');
        return;
    }
    
    testBtn.classList.add('loading');
    testBtn.disabled = true;
    
    try {
        // Test GitHub API access
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const repo = await response.json();
            showStatus(`✅ Connection successful! Found repository: ${repo.full_name}`, 'success');
        } else if (response.status === 401) {
            showStatus('❌ Invalid GitHub token. Please check your token.', 'error');
        } else if (response.status === 404) {
            showStatus('❌ Repository not found. Please check the owner and repository name.', 'error');
        } else {
            const error = await response.json();
            showStatus(`❌ Connection failed: ${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Test connection error:', error);
        showStatus('❌ Connection test failed: ' + error.message, 'error');
    } finally {
        testBtn.classList.remove('loading');
        testBtn.disabled = false;
    }
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `message ${type}`;
    statusEl.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}
