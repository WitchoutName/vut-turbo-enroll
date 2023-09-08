console.info('chrome-ext template-react-ts background script')
import MessageServer from "../lib/messaging/MessageServer";
import { Timeblock } from './../lib/timeblock';
import Ep from '../popup/endpoints';
import Ec from '../content/endpoints';
import Endpoints from "./endpoints";

const mc = new MessageServer("background");

let timeInputValue = "";
const alarmStatus: {
    isRunning: boolean,
    time: number | null
} = {
    isRunning: false,
    time: null
}
const schedule: {
    time: string,
    timeblock: Timeblock | null
} = {
    time: "",
    timeblock: null
}


mc.onMessage(Endpoints.SyncPopup, () => {
    return {
        schedule,
        timeInputValue,
        alarmStatus
    }
})

mc.onMessage(Endpoints.TimeInputValue, ({value}: {value: string}) => {
    timeInputValue = value
})

mc.onMessage(Endpoints.ConfirmSchedule, () => {
    schedule.time = timeInputValue;
    const [hours, minutes] = timeInputValue.split(":");
    const now = new Date();

    // Calculate the time for the alarm
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes) - 1, 59);
    alarmStatus.time = alarmTime.getTime();
    alarmStatus.isRunning = true;

    // Create the alarm
    chrome.alarms.create('registerBlockAlarm', {
        when: alarmTime.getTime(),
    });
    console.log("timer set to:", alarmTime.getTime())
    return alarmTime.getTime();
})



mc.onMessage(Endpoints.SelectedTimeblock, (data: Timeblock) => {
    schedule.timeblock = data;
    mc.sendRuntimeMessage("popup", Ep.SelectedTimeblock, data);
})




// Add an event listener for when the alarm fires
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'registerBlockAlarm') {
      // Perform the desired action when the alarm fires
      console.log('Alarm triggered at', alarm.scheduledTime);
      // You can perform any action here, such as displaying a notification or executing a function.
      mc.sendActiveTabMessage("content", Ec.TriggerRegister, { ...schedule.timeblock })
    }
  });
  

export {
}
