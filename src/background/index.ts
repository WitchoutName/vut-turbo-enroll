console.info('chrome-ext template-react-ts background script')
import MessageServer from "../lib/messaging/MessageServer";
import { Timeblock } from './../lib/timeblock';
import Ep from '../popup/endpoints';
import Ec from '../content/endpoints';
import Endpoints from "./endpoints";

const mc = new MessageServer("background");

let timetableTabId: (number | null) = null;
let timeInputValue = "";
let alarmTriggerServed = true;
const alarmStatus: {
    isRunning: boolean,
    time: number
} = {
    isRunning: false,
    time: 0
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
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes)-1, 59, 800);
    alarmStatus.time = alarmTime.getTime();
    alarmStatus.isRunning = true;

    // Create the alarm
    chrome.alarms.create('registerBlockAlarm', {
        when: alarmTime.getTime(),
    });
    return alarmTime.getTime();
})



mc.onMessage(Endpoints.SyncContent, (data: any, sender: chrome.runtime.MessageSender) => {
    console.log("SyncContent", {
        alarmTriggerServed,
        timeblock: schedule.timeblock,
    })
    timetableTabId = sender.tab?.id || null;
    console.log("timetable bat id:", timetableTabId)
    return {
        alarmTriggerServed,
        timeblock: schedule.timeblock,
    }
})

mc.onMessage(Endpoints.SelectedTimeblock, (data: Timeblock) => {
    schedule.timeblock = data;
    mc.sendMessage("popup", Ep.SelectedTimeblock, data);
})

mc.onMessage(Endpoints.AlarmServed, () => {
    alarmTriggerServed = true;
})

mc.onMessage(Endpoints.CancelAlarm, () => {
    alarmTriggerServed = true;
    alarmStatus.isRunning = false;
    alarmStatus.time = 0;
})



// Add an event listener for when the alarm fires
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'registerBlockAlarm') {
        // Perform the desired action when the alarm fires
        console.log('Alarm triggered at', alarm.scheduledTime);

        alarmStatus.isRunning = false;
        alarmStatus.time = 0;
        alarmTriggerServed = false;

        // page.reload() on opera broken
        chrome.tabs.create({
            active: true, 
            url: "https://www.vut.cz/studis/student.phtml?sn=registrace_vyucovani",
        })

        // console.log('Timetable tab id', timetableTabId);
        // if (timetableTabId){
        //     chrome.tabs.reload(timetableTabId, { bypassCache: true }, () => {
        //         if (chrome.runtime.lastError) {
        //           console.error("Error reloading tab:", chrome.runtime.lastError);
        //         } else {
        //           console.log("Tab reloaded successfully");
        //         }
        //       });
        // }
        // else {
        //     console.log('Querying active tab...', timetableTabId);
        //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //         console.log(tabs)
        //         if (tabs.length > 0) {
        //             const activeTab = tabs[0];
        //             if (activeTab.id) {
        //                 console.log("reloading active tab")
        //                 chrome.tabs.reload(activeTab.id, { bypassCache: true }, () => {
        //                     if (chrome.runtime.lastError) {
        //                       console.error("Error reloading tab:", chrome.runtime.lastError);
        //                     } else {
        //                       console.log("Tab reloaded successfully");
        //                     }
        //                   });
        //             } else{
        //                 console.log("active tab not found")
        //             }
        //         }
        //     });
        // }
        
    }
  });
  

export {
}
