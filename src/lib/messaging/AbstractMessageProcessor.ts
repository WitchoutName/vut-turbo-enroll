

export default class AbstractMessageProcessor{
    name: string;
    messageListeners: { [action: string]: Function[] };

    constructor(name: string) {
        if (this.constructor === AbstractMessageProcessor) {
            throw new Error('Cannot instantiate an abstract class.');
        }
        this.name = name;
        this.messageListeners = {};
        this.setupMessageListener();
    }

    setupMessageListener() {
        throw new Error('setupMessageListener must be implemented.');
    }

    handleMessage(request: { action: any; data: any; }, sendResponse: (response?: any) => void) {
        const { action, data } = request;
        const listeners = this.messageListeners[action] || [];
        listeners.forEach((callback) => {
            const response = callback(data);
            console.log(this.name, "handleMEssage response", response, sendResponse)
            if (response) {
            sendResponse(response);
            }
        });
    }

    onMessage(action: string, callback: Function) {
        if (!this.messageListeners[action]) {
            this.messageListeners[action] = [];
        }
        this.messageListeners[action].push(callback);
    }

    sendRuntimeMessage(receiver: string, action: string, data: object, callback: (Function | null) = null, processed: boolean = false) {
        try{
            chrome.runtime.sendMessage({
                processed: processed,
                receiver,
                action,
                data,
            }, (response) => { 
                if (callback) {
                    console.log("sendRuntimeMessage sending result:", response)
                    callback(response);
                }
             });
        }
        catch (error) {
            console.log("[Error sending a message]: ", error)
        }
        
    }
}