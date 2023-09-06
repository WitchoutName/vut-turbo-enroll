import AbstractMessageProcessor from "./AbstractMessageProcessor";


export default class MessageClient extends AbstractMessageProcessor{
    setupMessageListener() {
        const name = this.name;
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.receiver === name && request.processed) {
                // this.handleMessage(request, sendResponse);
                const { action, data } = request;
                const listeners = this.messageListeners[action] || [];
                listeners.forEach((callback) => {
                    const response = callback(data);
                    console.log(this.name, "handleMEssage response", response, sendResponse)
                    if (response) {
                        sendResponse(response);
                        return;
                    }
                });
            }
        });
    }

    sendMessage(receiver: string, action: string, data: object, callback: (Function | null) = null) {
        return this.sendRuntimeMessage(receiver, action, data, callback)
        
    }
}