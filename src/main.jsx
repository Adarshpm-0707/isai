import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/fonts.css'
import App from './App.jsx'
import { catalogSyncService } from './services/catalogSyncService'

// Auto-sync products & categories created on localhost to codebase catalog.json
catalogSyncService.initAutoSync();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
