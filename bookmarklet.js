/**
 * Obsidian Google Docs Bookmarklet
 * Captures selected text from Google Docs and saves to Obsidian via GitHub API
 */

(function() {
    'use strict';
    
    // Check if we're on a Google Docs page
    if (!window.location.hostname.includes('docs.google.com')) {
        alert('This bookmarklet only works on Google Docs pages!');
        return;
    }
    
    // Get selected text
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
        alert('Please select some text first!');
        return;
    }
    
    // Get document title
    const docTitle = document.title.replace(' - Google Docs', '').trim();
    const docUrl = window.location.href;
    
    // Create the popup form
    createCaptureForm(selectedText, docTitle, docUrl);
    
    function createCaptureForm(text, title, url) {
        // Remove existing popup if present
        const existingPopup = document.getElementById('obsidian-capture-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create popup container
        const popup = document.createElement('div');
        popup.id = 'obsidian-capture-popup';
        popup.innerHTML = `
            <div class="obsidian-popup-overlay">
                <div class="obsidian-popup-content">
                    <div class="obsidian-popup-header">
                        <h3>📝 Save to Obsidian</h3>
                        <button type="button" class="close-btn" onclick="this.closest('#obsidian-capture-popup').remove()">×</button>
                    </div>
                    
                    <form id="obsidian-capture-form">
                        <div class="form-group">
                            <label for="meeting-title">Meeting Title:</label>
                            <input type="text" id="meeting-title" placeholder="e.g. Weekly Team Sync" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="attendees">Attendees:</label>
                            <input type="text" id="attendees" placeholder="e.g. John, Jane, Mike">
                        </div>
                        
                        <div class="form-group">
                            <label for="tags">Tags:</label>
                            <input type="text" id="tags" placeholder="e.g. team-sync, action-items" value="meeting-notes">
                        </div>
                        
                        <div class="form-group">
                            <label for="filename">File Name:</label>
                            <input type="text" id="filename" placeholder="Will be auto-generated if empty">
                        </div>
                        
                        <div class="form-group">
                            <label for="captured-text">Captured Text:</label>
                            <textarea id="captured-text" rows="6" readonly>${text}</textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" onclick="this.closest('#obsidian-capture-popup').remove()">Cancel</button>
                            <button type="submit">💾 Save to Obsidian</button>
                        </div>
                    </form>
                    
                    <div id="status-message" style="display: none;"></div>
                </div>
            </div>
        `;
        
        // Add styles
        addStyles();
        
        // Add popup to page
        document.body.appendChild(popup);
        
        // Focus on first input
        document.getElementById('meeting-title').focus();
        
        // Handle form submission
        document.getElementById('obsidian-capture-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveToObsidian(text, title, url);
        });
    }
    
    function addStyles() {
        if (document.getElementById('obsidian-bookmarklet-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'obsidian-bookmarklet-styles';
        styles.textContent = `
            #obsidian-capture-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .obsidian-popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .obsidian-popup-content {
                background: white;
                border-radius: 8px;
                padding: 0;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .obsidian-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 20px 0;
                border-bottom: 1px solid #eee;
                margin-bottom: 20px;
            }
            
            .obsidian-popup-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-btn:hover {
                color: #333;
            }
            
            #obsidian-capture-form {
                padding: 0 20px 20px;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #333;
            }
            
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                font-family: inherit;
                box-sizing: border-box;
            }
            
            .form-group textarea {
                resize: vertical;
                font-family: Monaco, 'Courier New', monospace;
                background: #f8f9fa;
            }
            
            .form-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            
            .form-actions button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
            }
            
            .form-actions button[type="button"] {
                background: #f1f3f4;
                color: #5f6368;
            }
            
            .form-actions button[type="submit"] {
                background: #1a73e8;
                color: white;
            }
            
            .form-actions button:hover {
                opacity: 0.9;
            }
            
            #status-message {
                margin-top: 15px;
                padding: 10px;
                border-radius: 4px;
                font-size: 14px;
            }
            
            #status-message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            #status-message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    async function saveToObsidian(selectedText, docTitle, docUrl) {
        const form = document.getElementById('obsidian-capture-form');
        const statusDiv = document.getElementById('status-message');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Get form values
        const meetingTitle = document.getElementById('meeting-title').value.trim();
        const attendees = document.getElementById('attendees').value.trim();
        const tags = document.getElementById('tags').value.trim();
        const customFilename = document.getElementById('filename').value.trim();
        
        if (!meetingTitle) {
            showStatus('Please enter a meeting title', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = '💾 Saving...';
        submitBtn.disabled = true;
        
        try {
            // Generate filename
            const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const filename = customFilename || `${timestamp} - ${meetingTitle}.md`;
            
            // Generate note content
            const noteContent = generateNoteContent({
                meetingTitle,
                attendees,
                tags,
                selectedText,
                docTitle,
                docUrl,
                timestamp: new Date().toISOString()
            });
            
            // Save to GitHub (you'll need to implement this part with your config)
            await saveToGitHub(filename, noteContent);
            
            showStatus('✅ Successfully saved to Obsidian!', 'success');
            
            // Close popup after 2 seconds
            setTimeout(() => {
                document.getElementById('obsidian-capture-popup').remove();
            }, 2000);
            
        } catch (error) {
            console.error('Error saving to Obsidian:', error);
            showStatus('❌ Failed to save: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = '💾 Save to Obsidian';
            submitBtn.disabled = false;
        }
    }
    
    function generateNoteContent(data) {
        const tagsList = data.tags ? data.tags.split(',').map(t => `#${t.trim()}`).join(' ') : '';
        const attendeesList = data.attendees ? `\n**Attendees:** ${data.attendees}` : '';
        
        return `# ${data.meetingTitle}

**Date:** ${new Date(data.timestamp).toLocaleDateString()}${attendeesList}
**Source:** [${data.docTitle}](${data.docUrl})

${tagsList}

## Notes

${data.selectedText}

---
*Captured from Google Docs on ${new Date(data.timestamp).toLocaleString()}*`;
    }
    
    async function saveToGitHub(filename, content) {
        // This is a placeholder - you'll need to configure your GitHub settings
        // For security, the actual implementation should load CONFIG from a separate file
        
        const CONFIG = {
            GITHUB_TOKEN: 'your_token_here', // You'll need to set this
            REPO_OWNER: 'jczimskey',
            REPO_NAME: 'obsidian-notes',
            NOTES_PATH: 'Meeting Notes/'
        };
        
        if (CONFIG.GITHUB_TOKEN === 'your_token_here') {
            throw new Error('Please configure your GitHub token in the bookmarklet code');
        }
        
        const path = CONFIG.NOTES_PATH + filename;
        const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${encodeURIComponent(path)}`;
        
        const body = {
            message: `Add meeting notes: ${filename}`,
            content: btoa(unescape(encodeURIComponent(content))) // Base64 encode
        };
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
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
        const statusDiv = document.getElementById('status-message');
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
    }
    
})();