import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import {BrowserRouter} from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer/>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>,
)