/**
 * Firefox Bookmarklet Test - Simplified Version
 * Use this to test if basic bookmarklets work in Firefox
 */

javascript:(function() {
    'use strict';
    
    // Test 1: Basic alert
    console.log('Firefox bookmarklet test started');
    
    // Test 2: Check if we can access page content
    const selectedText = window.getSelection().toString().trim();
    
    if (!selectedText) {
        alert('Firefox Test: Please select some text first!');
        return;
    }
    
    // Test 3: Try to create a simple popup
    try {
        const testDiv = document.createElement('div');
        testDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border: 2px solid #333; z-index: 10000;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                <h3>🦊 Firefox Test Successful!</h3>
                <p>Selected text: "${selectedText.substring(0, 100)}..."</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(testDiv);
        
        console.log('Firefox test popup created successfully');
        
    } catch (error) {
        alert('Firefox Test Error: ' + error.message);
        console.error('Firefox bookmarklet error:', error);
    }
})();
