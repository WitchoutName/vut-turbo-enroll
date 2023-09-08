import AbstractMessageProcessor from "./AbstractMessageProcessor";
import { Message } from './index';


export default class MessageServer extends AbstractMessageProcessor{
    setupMessageListener(){
        const name = this.name;
        chrome.runtime.onMessage.addListener((request: Message, sender, sendResponse) => {
            if (request.receiver === name) {
                this.log("[RawMessage]", request, sender)
                this.handleMessage(request, sender);
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

    sendActiveTabMessage(receiver: string, action: string, data: (object | null) = null, callback: (Function | null) = null, processed: boolean = false) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0]?.id;
            if (tabId){
                this.sendTabMessage(tabId, receiver, action, data, callback, processed);
            }
        });
    }
    


    sendTabMessage(tabId: number, receiver: string, action: string, data: (object | null) = null, callback: (Function | null) = null, processed: boolean = false) {
        try{
            if (callback) {
                this.log("setting response listener:", receiver, action)
                this.onMessage(action, (response: any)=>{
                    this.log("sendTabMessage sending result:", response)
                    callback(response);
                })
            }
            chrome.tabs.sendMessage(tabId, {
                processed: processed,
                sender: this.name,
                receiver,
                action,
                data,
            });
        }
        catch (error) {
            console.log("[Error sending a message]: ", error)
        }
    }


    sendMessage(receiver: string, action: string, data: (object | null) = null, callback: (Function | null) = null, contentTabId?: number) {
        if (receiver == "popup") return this.sendRuntimeMessage(receiver, action, data, callback, true)
        if (receiver == "content"){
            if (contentTabId)
                return this.sendTabMessage(contentTabId, receiver, action, data, callback, true);
            else
                return this.sendActiveTabMessage(receiver, action, data, callback, true)
        }
    }
}