import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Navbar";
import "./Compras.css";

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVerModal, setShowVerModal] = useState(false); // Estado para el modal "Ver"
  const [showEditarModal, setShowEditarModal] = useState(false); // Estado para el modal "Editar"
  const [showEliminarModal, setShowEliminarModal] = useState(false); // Estado para el modal "Eliminar"
  const [selectedCompra, setSelectedCompra] = useState(null); // Compra seleccionada

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get("https://localhost:7170/api/Compras", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCompras(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        setLoading(false);
      });
  }, []);

  const handleVer = (compra) => {
    setSelectedCompra(compra);
    setShowVerModal(true);
  };

  // const handleEditar = (compra) => {
  //   setSelectedCompra(compra);
  //   setShowEditarModal(true);
  // };

  const handleEliminar = (compra) => {
    setSelectedCompra(compra);
    setShowEliminarModal(true);
  };

  const cerrarModal = () => {
    setShowVerModal(false);
    setShowEditarModal(false);
    setShowEliminarModal(false);
    setSelectedCompra(null);
  };

  const actualizarCompra = (updatedCompra) => {
    const token = localStorage.getItem("authToken");
    axios
      .put(`https://localhost:7170/api/Compras/${updatedCompra.compraId}`, updatedCompra, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCompras(compras.map((compra) =>
          compra.compraId === updatedCompra.compraId ? updatedCompra : compra
        ));
        cerrarModal();
        alert("Compra actualizada");
      })
      .catch((error) => {
        console.error("Error al actualizar la compra:", error);
        alert("Error al actualizar la compra");
      });
  };

  const eliminarCompra = () => {
    const token = localStorage.getItem("authToken");
    axios
      .delete(`https://localhost:7170/api/Compras/${selectedCompra.compraId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCompras(compras.filter((compra) => compra.compraId !== selectedCompra.compraId));
        cerrarModal();
        alert("Compra eliminada");
      })
      .catch((error) => {
        console.error("Error al eliminar la compra:", error);
        alert("Error al eliminar la compra");
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
          <a href="/Compras/Agregar" className="Sanduche">
            Agregar Compra
          </a>
          <table className="translucent-table">
            <thead>
              <tr>
                <th>ID Compra</th>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.compraId}>
                  <td>{compra.compraId}</td>
                  <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                  <td>{compra.proveedor?.nombre || "Sin proveedor"}</td>
                  <td>{`$${compra.total.toFixed(2)}`}</td>
                  <td>
                    <button onClick={() => handleVer(compra)}>Ver</button>
                    {/* Aquí está el modal de editar, pero está comentado */}
                    {/* <button onClick={() => handleEditar(compra)}>Editar</button> */}
                    <button onClick={() => handleEliminar(compra)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver */}
      {showVerModal && selectedCompra && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ver Compra</h3>
            <p><strong>ID Compra:</strong> {selectedCompra.compraId}</p>
            <p><strong>Fecha:</strong> {new Date(selectedCompra.fecha).toLocaleDateString()}</p>
            <p><strong>Proveedor:</strong> {selectedCompra.proveedor?.nombre || "Sin proveedor"}</p>
            <p><strong>Total:</strong> ${selectedCompra.total.toFixed(2)}</p>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditarModal && selectedCompra && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Compra</h3>
            <label>ID Compra:</label>
            <input type="text" value={selectedCompra.compraId} disabled />
            <label>Fecha:</label>
            <input type="date" value={new Date(selectedCompra.fecha).toLocaleDateString('en-ca')} onChange={(e) => setSelectedCompra({ ...selectedCompra, fecha: e.target.value })} />
            <label>Proveedor:</label>
            <input type="text" value={selectedCompra.proveedor?.nombre || ''} onChange={(e) => setSelectedCompra({ ...selectedCompra, proveedor: { nombre: e.target.value } })} />
            <label>Total:</label>
            <input type="number" value={selectedCompra.total} onChange={(e) => setSelectedCompra({ ...selectedCompra, total: e.target.value })} />
            <button onClick={() => actualizarCompra(selectedCompra)}>Guardar</button>
            <button onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showEliminarModal && selectedCompra && (
        <div className="modal">
          <div className="modal-content">
            <h3>¿Estás seguro de que deseas eliminar esta compra?</h3>
            <p><strong>ID Compra:</strong> {selectedCompra.compraId}</p>
            <p><strong>Fecha:</strong> {new Date(selectedCompra.fecha).toLocaleDateString()}</p>
            <p><strong>Proveedor:</strong> {selectedCompra.proveedor?.nombre || "Sin proveedor"}</p>
            <p><strong>Total:</strong> ${selectedCompra.total.toFixed(2)}</p>
            <button onClick={eliminarCompra}>Eliminar</button>
            <button onClick={cerrarModal}>Cancelar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Compras;
