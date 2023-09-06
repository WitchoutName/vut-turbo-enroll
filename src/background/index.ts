console.info('chrome-ext template-react-ts background script')
import MessageServer from "../lib/messaging/MessageServer";
import { Timeblock } from './../lib/timeblock';

const mc = new MessageServer("background");

let isActive = true;
const scheduledRegistration = {
    time: Date,
    timeblock: {
        subject: "",
        day: "",
        time: ""
    }
}


mc.onMessage("syncPopup", () => {
    console.log("responding to syncPOpup")
    return {
        isActive,
        schedule: scheduledRegistration
    }
})

mc.onMessage("selectedTimeblock", (data: Timeblock) => {
    scheduledRegistration.timeblock = data;
    mc.sendRuntimeMessage("popup", "selectedTimeblock", data);
})

mc.onMessage("setActive", (data: boolean) => {
    isActive = data;
    if (isActive) {

    }
})




export {
}
