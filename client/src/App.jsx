import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import Main from "./Main";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
            <Main />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
