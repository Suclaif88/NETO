import { useState, useEffect } from 'react';
import NavBar from './Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// Función para obtener los encabezados de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Funciones para obtener las ventas y compras desde el backend
const getVentas = async () => {
  try {
    const response = await axios.get('https://localhost:7170/api/Ventas', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return [];
  }
};

const getCompras = async () => {
  try {
    const response = await axios.get('https://localhost:7170/api/Compras', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    return [];
  }
};

const Dashboard = () => {
  const [ventas, setVentas] = useState([]);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ventasData = await getVentas();
      const comprasData = await getCompras();
      setVentas(ventasData);
      setCompras(comprasData);
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const groupByMonth = (data) => {
    const months = {};
    data.forEach((item) => {
      const date = new Date(item.fecha);
      const month = date.getMonth();
      months[month] = (months[month] || 0) + 1;
    });
    return months;
  };

  const ventasPorMes = groupByMonth(ventas);
  const comprasPorMes = groupByMonth(compras);

  const allMonths = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const ensureMonths = (data) => {
    const result = allMonths.map((month, index) => ({
      month: month,
      count: Math.min(data[index] || 0, 10),
    }));
    return result;
  };

  const dashboardStyle = {
    padding: '50px 20px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  };

  const containerStyle = {
    maxWidth: '1200px',
    width: '80%',
  };

  const chartContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '30px',
  };

  const chartStyle = {
    width: '50%',
    marginTop: '30px',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    borderRadius: '8px',
  };

  return (
    <div>
      <NavBar />
      <div style={dashboardStyle}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: 'center', color: 'white' }}>Dashboard</h2>

          <div style={chartContainerStyle}>
            <div style={chartStyle}>
              <h3 style={{ textAlign: 'center' }}>Ventas Registradas</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={ensureMonths(ventasPorMes)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ventas" fill="#007BFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={chartStyle}>
              <h3 style={{ textAlign: 'center' }}>Compras Registradas</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={ensureMonths(comprasPorMes)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Compras" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
