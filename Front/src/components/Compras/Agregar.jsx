import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import "./Compras.css";

function Agregar() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    proveedorId: "",
    total: 0,
  });

  const token = localStorage.getItem("authToken"); // Obtener el token del localStorage

  useEffect(() => {
    // Verificar si hay un token
    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      navigate("/login"); // Redirigir al login si no hay token
      return;
    }

    // Obtener los proveedores con el token de autorización
    axios.get("https://localhost:7170/api/Proveedores", {
      headers: {
        "Authorization": `Bearer ${token}`, // Incluir el token en los encabezados
      },
    })
      .then(response => {
        console.log("Proveedores:", response.data);
        setProveedores(response.data);
      })
      .catch(error => {
        console.error("Error al obtener proveedores", error);
        alert("Error al cargar los proveedores");
      });

    // Obtener los productos con el token de autorización
    axios.get("https://localhost:7170/api/Productos", {
      headers: {
        "Authorization": `Bearer ${token}`, // Incluir el token en los encabezados
      },
    })
      .then(response => {
        console.log("Productos:", response.data);
        setProductos(response.data);
        setIsLoading(false); // Setear la carga como completada
      })
      .catch(error => {
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
    updateTotal(newDetalles); // Actualizar total al modificar los detalles
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
    updateTotal(newDetalles); // Actualizar total al eliminar un detalle
  };

  const updateTotal = (newDetalles) => {
    // Verificar cómo estamos calculando el total
    console.log("Detalles:", newDetalles);
    
    const newTotal = newDetalles.reduce((acc, detalle) => {
      // Buscar el producto por productoId
      const producto = productos.find((p) => p.productoId === parseInt(detalle.productoId)); // Asegúrate de que el tipo coincida (string vs number)
      
      if (producto) {
        // Usar el precio de compra del producto
        console.log(`Producto encontrado: ${producto.nombre}, Precio de compra: ${producto.precioCompra}`);
        const precioCompra = producto.precioCompra;
        return acc + (precioCompra * detalle.cantidad);
      } else {
        return acc; // Si no se encuentra el producto, no agregar nada al total
      }
    }, 0);

    console.log("Nuevo total calculado:", newTotal);
    setTotal(newTotal); // Actualizar el total
    setFormData({ ...formData, total: newTotal }); // Actualizar el total en formData
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
      // Registrar la compra sin detalles
      const compraResponse = await axios.post(
        "https://localhost:7170/api/Compras",
        {
          proveedorId: formData.proveedorId,
          total: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const compraId = compraResponse.data.compraId;
  
      // Enviar detalles incluyendo ventaId
      const detallesConCompraId = detalles.map((detalle) => ({
        compraId: compraId, 
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
      }));
  
      console.log("Detalles con compraId que se envían:", detallesConCompraId);
  
      await axios.post(
        `https://localhost:7170/api/Compras/${compraId}/detalles`,
        detallesConCompraId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Compra registrada y detalles actualizados con éxito.");
      navigate("/Compras");
    } catch (error) {
      console.error("Error al procesar la compra o los detalles", error);
      const errorMessage = error.response?.data || "Error desconocido";
      alert(`Error: ${errorMessage}`);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="form-container">
        <h2>Agregar Compra</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Proveedor</label>
            <select
              name="proveedorId"
              value={formData.proveedorId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {isLoading ? (
                <option>Cargando proveedores...</option>
              ) : proveedores.length > 0 ? (
                proveedores.map((proveedor) => (
                  <option key={proveedor.proveedorId} value={proveedor.proveedorId}>
                    {proveedor.nombre}
                  </option>
                ))
              ) : (
                <option>No hay proveedores disponibles</option>
              )}
            </select>
          </div>

          <div>
            <h3>Detalles de la Compra</h3>
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

            <button type="button" onClick={agregarDetalle}>Agregar Detalle</button>
          </div>

          <div>
            <label>Total: ${total}</label>
          </div>

          <button type="submit">Registrar Compra</button>
        </form>
      </div>
    </>
  );
}

export default Agregar;
