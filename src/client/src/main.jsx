// main entry point for the React application

import React from 'react'
import ReactDOM from 'react-dom/client' 
import App from './App.jsx' 
import { BrowserRouter } from "react-router-dom" 

// Render the App component wrapped in BrowserRouter for routing capabilities
 ReactDOM.createRoot(document.getElementById('root')).render( 
  <React.StrictMode> 
    <BrowserRouter> 
      <App /> 
    </BrowserRouter> 
  </React.StrictMode> )