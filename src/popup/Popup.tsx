import React, { useState, useEffect, ChangeEvent } from 'react';
import useSWC from 'use-state-with-callback';
import MessageClient from '../lib/messaging/MessageClient';
import Header from './components/Header';
import TimeSelectionCard from './components/TimeSelectionCard';
import BlockSelectionCard from './components/BlockSelectionCard';
import ScheduleCard from './components/ScheduleCard';
import { isValidTimeFormat } from '../lib/format';
import PopupEndpoints from './endpoints';
import BackgroundEndpoints from '../background/endpoints';
import ContentEndpoints from '../content/endpoints';

import './Popup.css';


// Initialize Message Client to "popup"
const mc = new MessageClient("popup");

export default function App() {

  // Define state variables
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [isSelectingBlock, setIsSelectingBlock] = useState<boolean>(false);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useSWC<number>(0, onAlarmTimeChange);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function onAlarmTimeChange(){
    if (isScheduled){
      setTimeLeftInterval();
    }
  }

  // Effect handler for receiving new time block
  mc.onMessage(PopupEndpoints.SelectedTimeblock, setTimeBlockFromMessage);

  // Sync state on startup
  useEffect(() => {
    syncPopup();
  }, []);

  // Prompts block selection
  useEffect(() => {
    mc.sendMessage("content", ContentEndpoints.PromptSelection, {
      state: isSelectingBlock
    })
  }, [isSelectingBlock]);

  // Error validation
  useEffect(()=> {
    validateEntry();
  }, [selectedBlock, selectedTime]);

  // Handlers
  function setTimeBlockFromMessage(data: any) {
    setSelectedBlock(data);
  }

  async function syncPopup() {
    try {
      mc.sendMessage("background", BackgroundEndpoints.SyncPopup, {}, (data: any)=>{
        setSelectedTime(data.schedule.time || data.timeInputValue);
        setSelectedBlock(data.schedule.timeblock);
        setIsScheduled(data.alarmStatus.isRunning);
        setAlarmTime(data.alarmStatus.time);
      })
      } catch (error) {
      console.error('Failed to synchronize popup:', error);
    }
  }

  function setTimeLeftInterval() {
    let intervalId = setInterval(()=>{
      const secondsLeft = Math.floor((alarmTime - new Date().getTime()) / 1000);
      if (secondsLeft >= 0){
        setTimeLeft(secondsLeft);
      }
      else{
        clearInterval(intervalId);
        setIsScheduled(false);
      }
    }, 1000);
  }

  function validateEntry() {
    if (!isValidTimeFormat(selectedTime)){
      setErrorMessage("Invalid time format");
    }
    else if(!selectedBlock){
      setErrorMessage("No time block selected");
    }
    else {
      setErrorMessage("");
    }
  }

  // Component methods
  function handleToggleSelectBlock() {
    setIsSelectingBlock(!isSelectingBlock);
  }

  const handleChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    mc.sendMessage("background", BackgroundEndpoints.TimeInputValue, {
      value: e.target.value
    })
    setSelectedTime(e.target.value);
  };

  const handleConfirm = async () => {
    try {
      mc.sendMessage("background", BackgroundEndpoints.ConfirmSchedule, null, (response: React.SetStateAction<number>) => {
        setIsScheduled(true);
        setAlarmTime(response);
      })
      } catch(error) {
      console.error('Failed to confirm schedule:', error);
    }
  }

  const handleCancel = async () => {
    setIsScheduled(false);
    try {
      await mc.sendMessage("background", BackgroundEndpoints.CancelAlarm, null);
    } catch(error) {
      console.error('Failed to cancel alarm:', error);
    }
  }

  return (
    <main className='main-container'>
      <Header/>
      <div className='row row-container mx-0 mb-3'>
        <div className="col-sm-6 card-left">
          <TimeSelectionCard 
            handleChangeTime={handleChangeTime} 
            selectedTime={selectedTime} 
            isScheduled={isScheduled} 
          />
        </div>
        <div className="col-sm-6 card-right">
          <BlockSelectionCard 
            handleToggleSelectBlock={handleToggleSelectBlock}
            isSelectingBlock={isSelectingBlock}
            selectedBlock={selectedBlock}
            isScheduled={isScheduled}
          />
        </div>
      </div>
      <ScheduleCard 
        isScheduled={isScheduled} 
        errorMessage={errorMessage} 
        timeLeft={timeLeft} 
        handleConfirm={handleConfirm} 
        handleCancel={handleCancel} 
      />
    </main>
  )
}