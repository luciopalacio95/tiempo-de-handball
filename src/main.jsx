import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";

import './index.css'
import App from './App.jsx'
import { LangProvider } from './context/langContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <Router><App/></Router>
    </LangProvider>
  </StrictMode>,
)
