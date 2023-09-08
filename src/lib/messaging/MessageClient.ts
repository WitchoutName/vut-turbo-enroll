import AbstractMessageProcessor from "./AbstractMessageProcessor";


export default class MessageClient extends AbstractMessageProcessor{
    setupMessageListener() {
        const name = this.name;
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.log("[RawMessage]", request)
            if (request.receiver === name && request.processed) {
                this.handleMessage(request);
            }
        });
    }

    sendMessage(receiver: string, action: string, data: (object | null) = null, callback: (Function | null) = null) {
        return this.sendRuntimeMessage(receiver, action, data, callback)
        
    }
}