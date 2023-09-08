import AbstractMessageProcessor from "./AbstractMessageProcessor";


export default class MessageServer extends AbstractMessageProcessor{
    setupMessageListener(){
        const name = this.name;
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.receiver === name) {
                this.log("[RawMessage]", request)
                this.handleMessage(request, true);
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
            if (callback) {
                this.log("setting response listener:", receiver, action)
                this.onMessage(action, (response: any)=>{
                    this.log("sendRuntimeMessage sending result:", response)
                    callback(response);
                })
            }
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tabId = tabs[0].id;
                if (tabId){
                    chrome.tabs.sendMessage(tabId, {
                        processed: processed,
                        sender: this.name,
                        receiver,
                        action,
                        data,
                    });

                }
            });
        }
        catch (error) {
            console.log("[ Error sending a message ]: ", error)
        }
        
    }
}