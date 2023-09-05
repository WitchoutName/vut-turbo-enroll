
console.info('chrome-ext template-react-ts background script')

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    request.processed = true;
    if (request.receiver === 'popup') {
        chrome.runtime.sendMessage(request);
    } else if (request.receiver === 'content') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            if (tabId) chrome.tabs.sendMessage(tabId, request);
        });
    }
});


export {
}
