// Background script for the browser extension
// Handles extension lifecycle and background tasks

console.log('Obsidian Capture background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Extension installed');
        // Open options page on first install
        chrome.runtime.openOptionsPage();
    } else if (details.reason === 'update') {
        console.log('Extension updated');
    }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openOptions') {
        chrome.runtime.openOptionsPage();
        sendResponse({ success: true });
    }
    
    return true;
});

// Optional: Add context menu item for capturing selected text
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'capture-selection' && tab) {
        // Open the popup programmatically
        chrome.action.openPopup();
    }
});

// Create context menu item when extension starts
chrome.runtime.onStartup.addListener(() => {
    createContextMenu();
});

chrome.runtime.onInstalled.addListener(() => {
    createContextMenu();
});

function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: 'capture-selection',
            title: '📝 Capture to Obsidian',
            contexts: ['selection'],
            documentUrlPatterns: ['https://docs.google.com/*']
        });
    });
}
