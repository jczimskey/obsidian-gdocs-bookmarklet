// Content script - runs on Google Docs pages
// This script helps with text selection and page interaction

console.log('Obsidian Capture content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelection') {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        const docTitle = document.title.replace(' - Google Docs', '').trim();
        const docUrl = window.location.href;
        
        sendResponse({
            selectedText,
            docTitle,
            docUrl,
            hasSelection: selectedText.length > 0
        });
    }
    
    return true; // Keep message channel open for async response
});

// Optional: Add visual feedback when text is selected
let selectionIndicator = null;

document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Remove existing indicator
    if (selectionIndicator) {
        selectionIndicator.remove();
        selectionIndicator = null;
    }
    
    // Show indicator if text is selected
    if (selectedText && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
            selectionIndicator = document.createElement('div');
            selectionIndicator.id = 'obsidian-selection-indicator';
            selectionIndicator.innerHTML = '📝 Click extension to capture';
            selectionIndicator.style.cssText = `
                position: fixed;
                top: ${rect.bottom + window.scrollY + 5}px;
                left: ${rect.left + window.scrollX}px;
                background: #667eea;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                animation: fadeIn 0.3s ease-out;
            `;
            
            // Add fade-in animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(selectionIndicator);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                if (selectionIndicator) {
                    selectionIndicator.remove();
                    selectionIndicator = null;
                }
            }, 3000);
        }
    }
});
