import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./Navbar";

const Productos = () => {
    const apiUrl = "https://localhost:7170/api";
  
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({
      nombre: "",
      descripcion: "",
      precioVenta: 0,
      precioCompra: 0,
      stock: 0,
    });
    const [editForm, setEditForm] = useState(null); 
  
    const getAuthHeaders = () => {
      const token = localStorage.getItem("authToken");
      return token ? { Authorization: `Bearer ${token}` } : {};
    };
  
    useEffect(() => {
      const fetchProductos = async () => {
        try {
          const response = await axios.get(`${apiUrl}/Productos`, {
            headers: getAuthHeaders(),
          });
          setProductos(response.data);
        } catch (error) {
          console.error("Error al obtener los Productos:", error);
        }
      };
      fetchProductos();
    }, []);
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${apiUrl}/Productos`, form, {
          headers: getAuthHeaders(),
        });
        setProductos([...productos, response.data]);
        setForm({  nombre: "",
            descripcion: "",
            precioVenta: 0,
            precioCompra: 0,
            stock: 0 });
      } catch (error) {
        console.error("Error al agregar Productos:", error);
      }
    };
  
    const handleDelete = async (productoId) => {
      try {
        await axios.delete(`${apiUrl}/Productos/${productoId}`, {
          headers: getAuthHeaders(),
        });
        setProductos(productos.filter((producto) => producto.productoId !== productoId));
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    };
  
    const handleEditClick = (producto) => {
      setEditForm(producto); 
    };
  
    const handleEditChange = (e) => {
      setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };
  
    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.put(`${apiUrl}/Productos/${editForm.productoId}`, editForm, {
          headers: getAuthHeaders(),
        });
        setProductos(
          productos.map((producto) =>
            producto.productoId === editForm.productoId ? response.data : producto
          )
        );
        setEditForm(null); 
        window.location.reload(); 
      } catch (error) {
        console.error("Error al editar producto:", error);
      }
    };
  
    return (
      <div className="Cliente">
        <NavBar />
        <form className="Form" onSubmit={handleSubmit}>
          <h1>Gestión de Productos</h1>
          <label >Nombre</label>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <label >Descripcion</label>
          <input
            type="text"
            name="descripcion"
            placeholder="Descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
          <label >Precio Venta</label>
          <input
            type="number"
            name="precioVenta"
            placeholder="Precio Venta"
            value={form.precioVenta}
            onChange={handleChange}
            required
          />
          <label >Precio Compra</label>
          <input
            type="number"
            name="precioCompra"
            placeholder="Precio Compra"
            value={form.precioCompra}
            onChange={handleChange}
            required
          />
          <label >Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <br />

        <button type="submit">Agregar Producto</button>
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
            <label>Descripcion</label>
            <input
            type="text"
            name="descripcion"
            placeholder="Descripcion"
            value={editForm.descripcion}
            onChange={handleChange}
            required
          />
          <label>Precio Venta</label>
          <input
            type="number"
            name="precioVenta"
            placeholder="Precio Venta"
            value={editForm.precioVenta}
            onChange={handleChange}
            required
          />
          <label>Precio Compra</label>
          <input
            type="number"
            name="precioCompra"
            placeholder="Precio Compra"
            value={editForm.precioCompra}
            onChange={handleChange}
            required
          />
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={editForm.stock}
            onChange={handleChange}
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
                <th>Descripcion</th>
                <th>Precio Venta</th>
                <th>Precio Compra</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.productoId}>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.precioVenta}</td>
                  <td>{producto.precioCompra}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button onClick={() => handleDelete(producto.productoId)}>Eliminar</button>
                    <button onClick={() => handleEditClick(producto)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
export default Productos