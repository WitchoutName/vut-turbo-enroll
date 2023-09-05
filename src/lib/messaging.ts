
interface Message{
    action: string,
    receiver: string,
    data: object
}

class MessageClients {
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
        if (request.receiver === name) {
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
            if (request.receiver === name) {
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
        let tabId: number;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabId = tabs[0].id || 0;
        })
        const method = receiver == "content" ? (mess: any) => chrome.tabs.sendMessage(tabId, mess) : (mess: any) => chrome.runtime.sendMessage(mess)
        const response = method({
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