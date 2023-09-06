

export interface Timeblock{
    subject: string,
    day: string,
    time: string
}

export function getTimeblockString(block: Timeblock){
    return `${block.subject}-${block.day}-${block.time}`
}


export {}