// Popup script for the browser extension
document.addEventListener('DOMContentLoaded', async () => {
    const notGoogleDocsEl = document.getElementById('not-google-docs');
    const noSelectionEl = document.getElementById('no-selection'); 
    const notConfiguredEl = document.getElementById('not-configured');
    const captureFormEl = document.getElementById('capture-form');
    const statusEl = document.getElementById('status');
    
    // Check if we're on a Google Docs page
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('docs.google.com')) {
        notGoogleDocsEl.style.display = 'block';
        return;
    }
    
    // Check configuration
    const config = await chrome.storage.sync.get(['githubToken', 'repoOwner', 'repoName', 'notesPath']);
    
    if (!config.githubToken || !config.repoOwner || !config.repoName) {
        notConfiguredEl.style.display = 'block';
        document.getElementById('open-options').addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });
        return;
    }
    
    // Get selected text from the content script
    try {
        // Try Manifest V3 scripting API first (Chrome)
        if (chrome.scripting && chrome.scripting.executeScript) {
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const selection = window.getSelection();
                    const selectedText = selection.toString().trim();
                    const docTitle = document.title.replace(' - Google Docs', '').trim();
                    const docUrl = window.location.href;
                    
                    return { selectedText, docTitle, docUrl };
                }
            });
            
            if (!result.result.selectedText) {
                noSelectionEl.style.display = 'block';
                return;
            }
            
            // Show the capture form
            captureFormEl.style.display = 'block';
            document.getElementById('captured-text').value = result.result.selectedText;
            document.getElementById('meeting-title').focus();
            
            // Handle form submission
            document.getElementById('obsidian-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleSave(result.result, config);
            });
            
        } else {
            // Fallback to legacy tabs API (Firefox event pages)
            const [result] = await chrome.tabs.executeScript(tab.id, {
                code: `
                    (function() {
                        const selection = window.getSelection();
                        const selectedText = selection.toString().trim();
                        const docTitle = document.title.replace(' - Google Docs', '').trim();
                        const docUrl = window.location.href;
                        
                        return { selectedText, docTitle, docUrl };
                    })();
                `
            });
            
            if (!result.selectedText) {
                noSelectionEl.style.display = 'block';
                return;
            }
            
            // Show the capture form
            captureFormEl.style.display = 'block';
            document.getElementById('captured-text').value = result.selectedText;
            document.getElementById('meeting-title').focus();
            
            // Handle form submission
            document.getElementById('obsidian-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleSave(result, config);
            });
        }
        
    } catch (error) {
        console.error('Error getting selection:', error);
        showStatus('Error: Could not access page content', 'error');
    }
    
    // Settings button
    document.getElementById('settings-btn').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
    
    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        window.close();
    });
});

async function handleSave(pageData, config) {
    const saveBtn = document.getElementById('save-btn');
    const statusEl = document.getElementById('status');
    
    // Get form data
    const meetingTitle = document.getElementById('meeting-title').value.trim();
    const attendees = document.getElementById('attendees').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const customFilename = document.getElementById('filename').value.trim();
    
    if (!meetingTitle) {
        showStatus('Please enter a meeting title', 'error');
        return;
    }
    
    // Show loading state
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;
    
    try {
        const timestamp = new Date().toISOString();
        const dateStr = timestamp.split('T')[0];
        const filename = customFilename || `${dateStr} - ${meetingTitle}.md`;
        
        const noteContent = generateNoteContent({
            meetingTitle,
            attendees,
            tags,
            selectedText: pageData.selectedText,
            docTitle: pageData.docTitle,
            docUrl: pageData.docUrl,
            timestamp
        });
        
        await saveToGitHub(filename, noteContent, config);
        
        showStatus('✅ Successfully saved to Obsidian!', 'success');
        
        // Close popup after 2 seconds
        setTimeout(() => {
            window.close();
        }, 2000);
        
    } catch (error) {
        console.error('Error saving:', error);
        showStatus(`❌ Failed to save: ${error.message}`, 'error');
    } finally {
        saveBtn.classList.remove('loading');
        saveBtn.disabled = false;
    }
}

function generateNoteContent(data) {
    const tagsList = data.tags ? 
        data.tags.split(',').map(t => `#${t.trim()}`).join(' ') : '';
    const attendeesList = data.attendees ? 
        `\n**Attendees:** ${data.attendees}` : '';
    
    return `# ${data.meetingTitle}

**Date:** ${new Date(data.timestamp).toLocaleDateString()}${attendeesList}
**Source:** [${data.docTitle}](${data.docUrl})

${tagsList}

## Notes

${data.selectedText}

---
*Captured from Google Docs on ${new Date(data.timestamp).toLocaleString()}*`;
}

async function saveToGitHub(filename, content, config) {
    const path = (config.notesPath || '') + filename;
    const url = `https://api.github.com/repos/${config.repoOwner}/${config.repoName}/contents/${encodeURIComponent(path)}`;
    
    const body = {
        message: `Add meeting notes: ${filename}`,
        content: btoa(unescape(encodeURIComponent(content))) // Base64 encode
    };
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${config.githubToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save to GitHub');
    }
    
    return response.json();
}

function showStatus(message, type) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = `message ${type}`;
    statusEl.style.display = 'block';
}
