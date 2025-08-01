// Background script for the browser extension
// Compatible with Firefox event pages and Chrome service workers

console.log('Obsidian Capture background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extension installed');
        // Open options page on first install
        chrome.runtime.openOptionsPage();
        // Create context menu on install
        createContextMenu();
    } else if (details.reason === 'update') {
        console.log('Extension updated');
        // Recreate context menu on update
        createContextMenu();
    }
});

// Create context menu when extension starts (Firefox compatibility)
chrome.runtime.onStartup.addListener(() => {
    createContextMenu();
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openOptions') {
        chrome.runtime.openOptionsPage();
        sendResponse({ success: true });
    }
    
    return true;
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'capture-selection' && tab) {
        // Open the popup programmatically (if supported)
        try {
            chrome.action.openPopup();
        } catch (error) {
            // Fallback: try to execute content script to show notification
            console.log('Cannot open popup programmatically, showing notification instead');
            try {
                await chrome.tabs.executeScript(tab.id, {
                    code: `
                        const notification = document.createElement('div');
                        notification.textContent = '📝 Click the extension icon to capture text';
                        notification.style.cssText = \`
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: #667eea;
                            color: white;
                            padding: 12px 16px;
                            border-radius: 6px;
                            z-index: 10000;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        \`;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                    `
                });
            } catch (scriptError) {
                console.error('Could not show notification:', scriptError);
            }
        }
    }
});

function createContextMenu() {
    // Remove existing menu items first
    chrome.contextMenus.removeAll(() => {
        // Create new context menu item
        chrome.contextMenus.create({
            id: 'capture-selection',
            title: '📝 Capture to Obsidian',
            contexts: ['selection'],
            documentUrlPatterns: ['https://docs.google.com/*']
        }, () => {
            // Check for errors (Firefox compatibility)
            if (chrome.runtime.lastError) {
                console.log('Context menu creation result:', chrome.runtime.lastError.message);
            } else {
                console.log('Context menu created successfully');
            }
        });
    });
}
