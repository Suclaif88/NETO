import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Navbar";
import "./Compras.css";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVerModal, setShowVerModal] = useState(false); // Estado para el modal "Ver"
  const [showEditarModal, setShowEditarModal] = useState(false); // Estado para el modal "Editar"
  const [showEliminarModal, setShowEliminarModal] = useState(false); // Estado para el modal "Eliminar"
  const [selectedVenta, setSelectedVenta] = useState(null); // Compra seleccionada

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("https://localhost:7170/api/Ventas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setVentas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      });
  }, []);

  const handleVer = (venta) => {
    setSelectedVenta(venta);
    setShowVerModal(true);
  };

  // const handleEditar = (compra) => {
  //   setSelectedCompra(compra);
  //   setShowEditarModal(true);
  // };

  const handleEliminar = (venta) => {
    setSelectedVenta(venta);
    setShowEliminarModal(true);
  };

  const cerrarModal = () => {
    setShowVerModal(false);
    setShowEditarModal(false);
    setShowEliminarModal(false);
    setSelectedVenta(null);
  };

  const actualizarVenta = (updatedVenta) => {
    const token = localStorage.getItem("authToken");
    axios
      .put(`https://localhost:7170/api/Ventas/${updatedVenta.ventaId}`, updatedVenta, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setVentas(ventas.map((venta) =>
          venta.ventaId === updatedVenta.ventaId ? updatedVenta : venta
        ));
        cerrarModal();
        alert("Venta actualizada");
      })
      .catch((error) => {
        console.error("Error al actualizar la venta:", error);
        alert("Error al actualizar la venta");
      });
  };

  const eliminarVenta = () => {
    const token = localStorage.getItem("authToken");
    axios
      .delete(`https://localhost:7170/api/Ventas/${selectedVenta.ventaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setVentas(ventas.filter((venta) => venta.ventaId !== selectedVenta.ventaId));
        cerrarModal();
        alert("Venta eliminada");
      })
      .catch((error) => {
        console.error("Error al eliminar la venta:", error);
        alert("Error al eliminar la venta");
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="compras-container">
        <div className="table-container">
          <a href="/Ventas/Agregar" className="Sanduche">
            Agregar Venta
          </a>
          <table className="translucent-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.ventaId}>
                  <td>{venta.ventaId}</td>
                  <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td>{venta.cliente?.nombre || "Sin Cliente"}</td>
                  <td>{`$${venta.total.toFixed(2)}`}</td>
                  <td>
                    <button onClick={() => handleVer(venta)}>Ver</button>
                    {/* Aquí está el modal de editar, pero está comentado */}
                    {/* <button onClick={() => handleEditar(compra)}>Editar</button> */}
                    <button onClick={() => handleEliminar(venta)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver */}
      {showVerModal && selectedVenta && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ver Compra</h3>
            <p><strong>ID Compra:</strong> {selectedVenta.ventaId}</p>
            <p><strong>Fecha:</strong> {new Date(selectedVenta.fecha).toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {selectedVenta.cliente?.nombre || "Sin Cliente"}</p>
            <p><strong>Total:</strong> ${selectedVenta.total.toFixed(2)}</p>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditarModal && selectedVenta && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Venta</h3>
            <label>ID Venta:</label>
            <input type="text" value={selectedVenta.ventaId} disabled />
            <label>Fecha:</label>
            <input type="date" value={new Date(selectedVenta.fecha).toLocaleDateString('en-ca')} onChange={(e) => setSelectedVenta({ ...selectedVenta, fecha: e.target.value })} />
            <label>Cliente:</label>
            <input type="text" value={selectedVenta.cliente?.nombre || ''} onChange={(e) => setSelectedVenta({ ...selectedVenta, cliente: { nombre: e.target.value } })} />
            <label>Total:</label>
            <input type="number" value={selectedVenta.total} onChange={(e) => setSelectedVenta({ ...selectedVenta, total: e.target.value })} />
            <button onClick={() => actualizarVenta(selectedVenta)}>Guardar</button>
            <button onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showEliminarModal && selectedVenta && (
        <div className="modal">
          <div className="modal-content">
            <h3>¿Estás seguro de que deseas eliminar esta venta?</h3>
            <p><strong>ID Venta:</strong> {selectedVenta.ventaId}</p>
            <p><strong>Fecha:</strong> {new Date(selectedVenta.fecha).toLocaleDateString()}</p>
            <p><strong>Cliente:</strong> {selectedVenta.cliente?.nombre || "Sin Cliente"}</p>
            <p><strong>Total:</strong> ${selectedVenta.total.toFixed(2)}</p>
            <button onClick={eliminarVenta}>Eliminar</button>
            <button onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Ventas;
