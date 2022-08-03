import { EthProvider } from "./contexts/EthContext";
import Home from "./components/Pages/Home";
import { Routes, Route, Link } from "react-router-dom";
import Staking from "./components/Pages/Staking";
import "./App.css";
import Menu from "./components/Shared/Menu";
import Header from "./components/Shared/Header";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
            <Menu />
            <div id="main">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/staking" element={<Staking />} />
                </Routes>
            </div>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
