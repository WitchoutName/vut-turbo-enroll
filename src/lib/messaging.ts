
interface Message{
    action: string,
    receiver: string,
    data: object
}

export default class MessageClient {
    name: string;
    messageListeners: { [action: string]: Function[] };

    constructor(name: string) {
        this.name = name;
        this.messageListeners = {};
        this.setupMessageListener();
    }

    setupMessageListener() {
        const name = this.name;
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.receiver === name && request.processed) {
            this.handleMessage(request, sendResponse);
            }
        });
    }

    handleMessage(request: { action: any; data: any; }, sendResponse: { (response?: any): void; (arg0: any): void; }) {
        const { action, data } = request;
        const listeners = this.messageListeners[action] || [];
        listeners.forEach((callback) => {
            const response = callback(data);
            if (response) {
            sendResponse(response);
        }
        });

        // Optionally, send a response if needed

    }

    onMessage(action: string, callback: Function) {
        if (!this.messageListeners[action]) {
            this.messageListeners[action] = [];
        }
        this.messageListeners[action].push(callback);
    }

    sendMessage(receiver: string, action: string, data: object, callback: (Function | null) = null) {
        const response = chrome.runtime.sendMessage({
            processed: false,
            receiver,
            action,
            data,
        });
        if (callback) {
            callback(response);
        }
        return response;
    }
}