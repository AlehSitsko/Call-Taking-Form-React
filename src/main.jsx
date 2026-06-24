import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import './index.css'
import App from './App.jsx'

// Apply saved theme before first paint to avoid flash
document.documentElement.setAttribute('data-theme', localStorage.getItem('ems_theme') || 'light');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
