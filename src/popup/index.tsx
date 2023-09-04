import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Popup'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './index.css'
import '../assets/jquery.min.js'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
