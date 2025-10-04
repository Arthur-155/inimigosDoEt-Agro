import * as React from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from "./components/ui/provider.jsx"
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')
if (!container) throw new Error('#root não encontrado no index.html')

createRoot(container).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
)
