import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import "./Compras.css";

function Agregar() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    clienteId: "",
    total: 0,
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      navigate("/login");
      return;
    }

    axios
      .get("https://localhost:7170/api/Cliente", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setClientes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener Clientes", error);
        alert("Error al cargar los Clientes");
      });

    axios
      .get("https://localhost:7170/api/Productos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProductos(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener productos", error);
        alert("Error al cargar los productos");
      });
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDetalleChange = (e, index) => {
    const newDetalles = [...detalles];
    newDetalles[index][e.target.name] = e.target.value;
    setDetalles(newDetalles);
    updateTotal(newDetalles);
  };

  const agregarDetalle = () => {
    setDetalles([
      ...detalles,
      { productoId: "", cantidad: 1, precio: 0 },
    ]);
  };

  const eliminarDetalle = (index) => {
    const newDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(newDetalles);
    updateTotal(newDetalles);
  };

  const updateTotal = (newDetalles) => {
    const newTotal = newDetalles.reduce((acc, detalle) => {
      const producto = productos.find(
        (p) => p.productoId === parseInt(detalle.productoId)
      );
      if (producto) {
        const precioVenta = producto.precioVenta;
        return acc + precioVenta * detalle.cantidad;
      } else {
        return acc;
      }
    }, 0);

    setTotal(newTotal);
    setFormData({ ...formData, total: newTotal });
  };

  const validarDetalles = () => {
    for (const detalle of detalles) {
      if (!detalle.productoId || detalle.cantidad <= 0) {
        alert(
          "Todos los detalles deben tener un producto seleccionado y una cantidad mayor a cero."
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validarDetalles()) return;
  
    try {
      // Registrar la venta sin detalles
      const ventaResponse = await axios.post(
        "https://localhost:7170/api/Ventas",
        {
          clienteId: formData.clienteId,
          total: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const ventaId = ventaResponse.data.ventaId;
  
      // Enviar detalles incluyendo ventaId
      const detallesConVentaId = detalles.map((detalle) => ({
        ventaId: ventaId, 
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
      }));
  
      console.log("Detalles con ventaId que se envían:", detallesConVentaId);
  
      await axios.post(
        `https://localhost:7170/api/Ventas/${ventaId}/detalles`,
        detallesConVentaId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Venta registrada y detalles actualizados con éxito.");
      navigate("/Ventas");
    } catch (error) {
      console.error("Error al procesar la venta o los detalles", error);
      const errorMessage = error.response?.data || "Error desconocido";
      alert(`Error: ${errorMessage}`);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="form-container">
        <h2>Agregar Venta</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cliente</label>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un cliente</option>
              {isLoading ? (
                <option>Cargando cliente...</option>
              ) : clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <option key={cliente.clienteId} value={cliente.clienteId}>
                    {cliente.nombre}
                  </option>
                ))
              ) : (
                <option>No hay Clientes disponibles</option>
              )}
            </select>
          </div>

          <div>
            <h3>Detalles de la Venta</h3>
            {detalles.map((detalle, index) => (
              <div key={index}>
                <select
                  name="productoId"
                  value={detalle.productoId}
                  onChange={(e) => handleDetalleChange(e, index)}
                  required
                >
                  <option value="">Seleccione un producto</option>
                  {isLoading ? (
                    <option>Cargando productos...</option>
                  ) : productos.length > 0 ? (
                    productos.map((producto) => (
                      <option key={producto.productoId} value={producto.productoId}>
                        {producto.nombre}
                      </option>
                    ))
                  ) : (
                    <option>No hay productos disponibles</option>
                  )}
                </select>

                <input
                  type="number"
                  name="cantidad"
                  value={detalle.cantidad}
                  onChange={(e) => handleDetalleChange(e, index)}
                  min="1"
                  required
                />

                <button type="button" onClick={() => eliminarDetalle(index)}>
                  Eliminar
                </button>
              </div>
            ))}

            <button type="button" onClick={agregarDetalle}>
              Agregar Detalle
            </button>
          </div>

          <div>
            <label>Total: ${total}</label>
          </div>

          <button type="submit">Registrar Venta</button>
        </form>
      </div>
    </>
  );
}

export default Agregar;
