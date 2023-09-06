import AbstractMessageProcessor from "./AbstractMessageProcessor";


export default class MessageServer extends AbstractMessageProcessor{
    setupMessageListener(){
        const name = this.name;
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.receiver === name) {
                // this.handleMessage(request, sendResponse);
                const { action, data } = request;
                const listeners = this.messageListeners[action] || [];
                listeners.forEach((callback) => {
                const response = callback(data);
                console.log(this.name, "handleMEssage response", response, sendResponse)
                if (response) {
                sendResponse(response);
            }
        });
            } else {
                if (request.receiver === 'popup') {
                    this.sendRuntimeMessage('popup', request.action, request.data, (response: any) => {
                        sendResponse(response);
                    }, true)
                } else if (request.receiver === 'content') {
                    this.sendActiveTabMessage('content', request.action, request.data, (response: any) => {
                        sendResponse(response);
                    }, true)
                }
            }

        });
    }

    sendActiveTabMessage(receiver: string, action: string, data: object, callback: (Function | null) = null, processed: boolean = false) {
        try{
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tabId = tabs[0].id;
                if (tabId){
                    chrome.tabs.sendMessage(tabId, {
                        processed: processed,
                        receiver,
                        action,
                        data,
                    }, (result) => {
                        if (callback) {
                            callback(result);
                        }
                    });

                }
            });
        }
        catch (error) {
            console.log("[ Error sending a message ]: ", error)
        }
        
    }
}