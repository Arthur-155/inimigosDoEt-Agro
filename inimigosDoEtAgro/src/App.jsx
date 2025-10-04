import { AlertClosedComponent } from './components/ui/alerts'
import './App.css'

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <AlertClosedComponent status="info" title="Título">
        Conteúdo do alerta
      </AlertClosedComponent>
    </div>
  )
}


