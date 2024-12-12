import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./Navbar";
import "../Styles/Cliente.css";

const Proveedores = () => {
  const apiUrl = "https://localhost:7170/api";

  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });
  const [editForm, setEditForm] = useState(null); 

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get(`${apiUrl}/Proveedores`, {
          headers: getAuthHeaders(),
        });
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al obtener los Proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/Proveedores`, form, {
        headers: getAuthHeaders(),
      });
      setProveedores([...proveedores, response.data]);
      setForm({ nombre: "", apellido: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al agregar provedores:", error);
    }
  };

  const handleDelete = async (proveedorId) => {
    try {
      await axios.delete(`${apiUrl}/Proveedores/${proveedorId}`, {
        headers: getAuthHeaders(),
      });
      setProveedores(proveedores.filter((proveedor) => proveedor.proveedorId !== proveedorId));
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
    }
  };

  const handleEditClick = (proveedor) => {
    setEditForm(proveedor); 
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/Proovedores/${editForm.proveedorId}`, editForm, {
        headers: getAuthHeaders(),
      });
      setProveedores(
        proveedores.map((proveedor) =>
          proveedor.proveedorId === editForm.proveedorId ? response.data : proveedor
        )
      );
      setEditForm(null); 
      window.location.reload();
    } catch (error) {
      console.error("Error al editar Proveedor:", error);
    }
  };

  return (
    <div className="Cliente">
      <NavBar />
      <form className="Form" onSubmit={handleSubmit}>
        <h1>Gestión de Proveedores</h1>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
        />
        <label>Correo</label>
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          required
        />
        <label>Telefono</label>
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
        />
        <button type="submit">Agregar Proveedor</button>
      </form>

      {editForm && (
        <form className="FormEdit" onSubmit={handleEditSubmit}>
          <h1>Editar Proveedor</h1>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={editForm.nombre}
            onChange={handleEditChange}
            required
          />
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={editForm.apellido}
            onChange={handleEditChange}
            required
          />
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={editForm.correo}
            onChange={handleEditChange}
            required
          />
          <label>Telefono</label>
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={editForm.telefono}
            onChange={handleEditChange}
            required
          />
          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => setEditForm(null)}>
            Cancelar
          </button>
        </form>
      )}

      <div className="Lista">
        <table className="tabla-clientes">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.proveedorId}>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.apellido}</td>
                <td>{proveedor.correo}</td>
                <td>{proveedor.telefono}</td>
                <td>
                  <button onClick={() => handleDelete(proveedor.proveedorId)}>Eliminar</button>
                  <button onClick={() => handleEditClick(proveedor)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proveedores;
