import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './Styles/Index.css';
import Clientes from './components/Clientes';
import Productos from './components/Productos'
import Agregar from './components/Compras/Agregar';
import Compras from './components/Compras/Compras';
import Ventas from './components/Ventas/Ventas';
import AgregarV from './components/Ventas/Agregar';
import Dashboard from './components/Dashboard';
import Proveedores from './components/Proveedores';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/Ventas" element={<Ventas />} />
        <Route path="/Ventas/Agregar" element={<AgregarV />} />
        <Route path="/Compras/Agregar" element={<Agregar />} />
      </Routes>
    </Router>
  );
}

export default App;
