import { useState, useEffect } from 'react'
import LogoImg from '../assets/logo.png'
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import TimePicker from 'react-time-picker';
import './Popup.css'

function App() {
  const [crx, setCrx] = useState('create-chrome-ext')
  const [value, onChange] = useState('10:00');
  const [currentTime, setCurrentTime] = useState("22:50:23");

  useEffect(()=>{
    console.log("brrrrrr");
    setInterval(()=>{
        console.log($(".-js-server-time").text());
        setCurrentTime($(".-js-server-time").text());
    }, 1000)
  }, [])

  return (
    <main className='text-start'>
      <div className='d-flex align-items-center header'>
        <img src={LogoImg} alt="logo" width={64} height={64}/>
        <h3>VUT Turbo Enroll</h3>
      </div>
      <div className='d-flex justify-content-around mb-3'>
        <Form.Group className="mb-6">
          <Form.Label>Pick registration time</Form.Label><br></br>
          <TimePicker onChange={onChange} value={value}/>
        </Form.Group>
        <Form.Group className="mb-6">
          <Form.Label>Current time</Form.Label><br></br>
          {currentTime}
        </Form.Group>
      </div>
      <div>
        <h2>Pick a block to register</h2>
        <Button >Choose</Button>
      </div>
    </main>
  )
}

export default App
