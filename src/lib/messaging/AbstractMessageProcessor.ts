import { Message } from ".";



export default class AbstractMessageProcessor{
    static logStatus = true;
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

    log(...args: any[]){
        if (AbstractMessageProcessor.logStatus)
            console.log(`[${this.name}]`, ...args);
    }

    setupMessageListener() {
        throw new Error('setupMessageListener must be implemented.');
    }

    handleMessage(request: Message, processed: boolean = false) {
        const { action, data } = request;
        const listeners = this.messageListeners[action] || [];
        listeners.forEach((callback) => {
            const response = callback(data);
            this.log("handleMEssage response", response)
            if (response) {
                this.sendRuntimeMessage(request.sender, request.action, response, null, processed)
            }
        });
    }

    onMessage(action: string, callback: Function) {
        if (!this.messageListeners[action]) {
            this.messageListeners[action] = [];
        }
        this.messageListeners[action].push(callback);
    }

    sendRuntimeMessage(receiver: string, action: string, data: (object | null) = null, callback: (Function | null) = null, processed: boolean = false) {
        try{
            if (callback) {
                this.log("setting response listener:", receiver, action)
                this.onMessage(action, (response: any)=>{
                    this.log("sendRuntimeMessage sending result:", response)
                    callback(response);
                })
            }
            chrome.runtime.sendMessage({
                processed: processed,
                sender: this.name,
                receiver,
                action,
                data,
            });
        }
        catch (error) {
            this.log("[Error sending a message]: ", error) 
        }
        
    }
}