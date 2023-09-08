export interface Message{
    action: string,
    receiver: string,
    sender: string,
    data: object,
    processed: boolean
}

export {}