import React, { ChangeEventHandler } from 'react';
import { useState, useEffect } from 'react'
import LogoImg from '../assets/logo.png'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import './Popup.css'
import MessageClient from '../lib/messaging';

const mc = new MessageClient("popup");

function App() {
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00");
  const [currentTime, setCurrentTime] = useState<string | null>("22:50:23");

  useEffect(()=>{
    mc.onMessage("updatedTime", (data: any) => {
      setCurrentTime(data.time)
    })
  }, []);

  const handleToggleSelectBlock = ()=>{
    console.log("sending promptSelection")
    mc.sendMessage("content", "promptSelection", {
      state: true
    })
  }

  const handleChange: ChangeEventHandler = (event) => {
    console.log(event)
    // setSelectedTime(event);
  };

  return (
    <main className='text-start'>
      {/* <h2>Bruuuuuuuuuuh</h2> */}
      <div className='d-flex align-items-center header'>
        <img src={LogoImg} alt="logo" width={40} height={40}/>
        <h3>VUT Turbo Enroll</h3>
      </div>
      <div className='d-flex justify-content-around mb-3'>
        <Form.Group className="mb-6">
          <Form.Label>Pick registration time</Form.Label><br></br>
          <Form.Control type='time' onChange={handleChange} value={selectedTime || ""}></Form.Control>
        </Form.Group>
        <Form.Group className="mb-6">
          <Form.Label>Current time</Form.Label><br></br>
          {currentTime}, {selectedTime}
        </Form.Group>
      </div>
      <div>
        <h2>Pick a block to register</h2>
        <Button onClick={handleToggleSelectBlock}>Choose</Button>
      </div>

    </main>
  )
}

export default App
