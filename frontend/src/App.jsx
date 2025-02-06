import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import Pacientes from './components/Pacientes';
import FichaTecnica from './components/FichaTecnica';
import Odontograma from './components/Odontograma';
import Login from "./components/Login";



function App() {
  return (
    <BrowserRouter>      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/pacientes" element={<Pacientes />} />
        <Route path="/home/fichas" element={<FichaTecnica />} />
        <Route path="/home/odontogramas" element={<Odontograma/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;