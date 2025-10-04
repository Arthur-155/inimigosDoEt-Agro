import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {provider} from "@/components/ui/provider"
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <provider>
    <App />
    </provider>
  </React.StrictMode>,
)
