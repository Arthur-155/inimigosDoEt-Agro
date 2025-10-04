import { AlertClosedComponent } from './components/ui/alerts'
import './App.css'
import { ColorModeButton } from './components/ui/color-mode'
import TelaPrincipal from './telaPrincipal'

export default function App() {
  return (
    <div className="container" style={{ padding: 20 }}>
      <div className="button-theme">
        {/* {<AlertClosedComponent status= "info" title="teste">
          não pode fazer essa ação!
        </AlertClosedComponent>} */}
        <ColorModeButton /> 
      </div>
      <div className="telaDoJogo">
        <TelaPrincipal />
      </div>
    </div>
  )
}



