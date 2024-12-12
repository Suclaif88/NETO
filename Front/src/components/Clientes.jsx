import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./Navbar";
import "../Styles/Cliente.css";

const Clientes = () => {
  const apiUrl = "https://localhost:7170/api";

  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });
  const [editForm, setEditForm] = useState(null); // Estado para el formulario de edición

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/Cliente`, {
          headers: getAuthHeaders(),
        });
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/Cliente`, form, {
        headers: getAuthHeaders(),
      });
      setClientes([...clientes, response.data]);
      setForm({ nombre: "", apellido: "", correo: "", telefono: "" });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  const handleDelete = async (clienteId) => {
    try {
      await axios.delete(`${apiUrl}/Cliente/${clienteId}`, {
        headers: getAuthHeaders(),
      });
      setClientes(clientes.filter((cliente) => cliente.clienteId !== clienteId));
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  const handleEditClick = (cliente) => {
    setEditForm(cliente); // Cargar datos del cliente a editar
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/Cliente/${editForm.clienteId}`, editForm, {
        headers: getAuthHeaders(),
      });
      setClientes(
        clientes.map((cliente) =>
          cliente.clienteId === editForm.clienteId ? response.data : cliente
        )
      );
      setEditForm(null); // Cerrar formulario de edición
      window.location.reload(); // Recargar la página
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  return (
    <div className="Cliente">
      <NavBar />
      <form className="Form" onSubmit={handleSubmit}>
        <h1>Gestión de Clientes</h1>
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
        <button type="submit">Agregar Cliente</button>
      </form>

      {editForm && (
        <form className="FormEdit" onSubmit={handleEditSubmit}>
          <h1>Editar Cliente</h1>
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
            {clientes.map((cliente) => (
              <tr key={cliente.clienteId}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <button onClick={() => handleDelete(cliente.clienteId)}>Eliminar</button>
                  <button onClick={() => handleEditClick(cliente)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
