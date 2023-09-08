import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import './Popup.css'
import MessageClient from '../lib/messaging/MessageClient';
import { Timeblock } from './../lib/timeblock';
import Header from './components/Header';
import Card from './components/Card';
import { isValidTimeFormat } from '../lib/format';
import Endpoints from './endpoints';
import Eb from '../background/endpoints'
import Ec from '../content/endpoints';

const mc = new MessageClient("popup");

function App() {
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [selectedBlock, setSelectedBlock] = useState<Timeblock | null>(null);
  const [isSelectingBlock, setIsSelectingBlock] = useState<boolean | null>(false);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const setTimeLeftInterval = () => {
    const interval = setInterval(()=>{
      const result = ((alarmTime || 0) - Date.now()) / 1000;
      console.log(result)
      if (result >= 0){
        setTimeLeft(result);
      }
      else{
        setIsScheduled(false);
        clearInterval(interval);
      }
    }, 1000)
  }

  useEffect(()=>{
    mc.onMessage(Endpoints.SelectedTimeblock, (data: Timeblock) => {
      setSelectedBlock(data)
    })

    mc.sendMessage("background", Eb.SyncPopup, {}, (data: any) => {
      setSelectedTime(data.schedule.time || data.timeInputValue);
      setSelectedBlock(data.schedule.timeblock);
      setIsScheduled(data.alarmStatus.isRunning);
      setAlarmTime(data.alarmStatus.time)
      if (data.alarmStatus.isRunning){
          setTimeLeftInterval()
      }
      
    })
  }, []);

  useEffect(()=>{
    mc.sendMessage("content", Ec.PromptSelection, {
      state: isSelectingBlock
    }, (response: any)=>{
      // console.log("response:", await response)
    })
  }, [isSelectingBlock]);


  useEffect(()=>{
    if (!isValidTimeFormat(selectedTime)){
      setErrorMessage("Invalid time format")
    }
    else if(!selectedBlock){
      setErrorMessage("No timeblock selected")
    }
    else setErrorMessage("")
  }, [selectedBlock, selectedTime]);


  const handleToggleSelectBlock = ()=>{
    setIsSelectingBlock(!isSelectingBlock)
  }

  const handleChangeTime: (e: ChangeEvent<HTMLInputElement>) => void = (e) => {
    mc.sendMessage("background", Eb.TimeInputValue, {
      value: e.target.value
    })
    setSelectedTime(e.target.value);
  };

  const handleConfirm = ()=>{
    console.log("sending confirmation")
    mc.sendMessage("background", Eb.ConfirmSchedule, null, (response: any) => {
      console.log("received confirmation fo confirmation", response)
      setIsScheduled(true);
      setAlarmTime(response);
      setTimeLeftInterval();
    });
  }

  return (
    <main className='text-start'>
      <Header/>
      <div className='row mx-0 mb-3'>
        <div className="col-sm-6" style={{paddingLeft: 0, paddingRight: 8}}>
          <Card style={{height: 180}}>
            <div className='mb-2'>Pick registration time</div>
            <Form.Control type='text' placeholder='10:45' onChange={handleChangeTime} value={selectedTime || ""}></Form.Control>
          </Card>
        </div>
        <div className="col-sm-6" style={{paddingLeft: 8, paddingRight: 0}}>
          <Card style={{height: 180}}>
            <div>Pick a time block to register</div>
            <Button onClick={handleToggleSelectBlock} className={isSelectingBlock ? "btn-secondary mb-4" : "mb-4"}>Select</Button>
            { selectedBlock ? <>
                <div><b>Selected block</b></div>
                <p>{selectedBlock.subject}, {selectedBlock.day}, {selectedBlock.time}</p>
              </> : <></>}
          </Card>
        </div>
      </div>
      <div className='card m-0'>
        {!isScheduled ?
          <>
            <div><small className='text-danger'>{errorMessage}</small></div>
            <Button className="btn-success" style={{width: "150px"}} disabled={!!errorMessage} onClick={handleConfirm}>Confirm</Button>
          </> :
          <>
            <div>Registering selected block in:</div>
            <div><b style={{fontSize: 20}}>{timeLeft}</b>s</div>
            <div className='text-warning'>⚠Keep the timetable tab open!⚠</div>
            <Button className="btn-danger" style={{width: "150px"}}>Cancel</Button>
          </>
        }
      </div>
    </main>
  )
}

export default App
