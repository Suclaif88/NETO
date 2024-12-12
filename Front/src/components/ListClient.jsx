import '../Styles/Cliente.css'
import { useState, useEffect } from 'react';
import { getCliente, deleteCliente} from '../services/Api';

export const List = ({onEdit}) =>{
    const [cliente, setCliente] = useState([]);

    useEffect(() =>{
        const fetchCliente = async () => {
            const data = await getCliente();
            setCliente(data);
        };
        fetchCliente();
    },[]);

    const handleDelete = async (id) => {
        await deleteCliente(id);
        setCliente(cliente.filter(cliente => cliente.id !== id));
    }

   return(
    <div className='Lista'>
    <h2>Lista de Personas</h2>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                </tr>
            </thead>
        <tbody>
            {cliente.map(cliente => (
                <tr key={cliente.id}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td>{cliente.correo}</td>
                    <td>{cliente.telefono}</td>
                <td>
                    <button style={{width:'80px',background:'yellow'}} onClick={() => onEdit(cliente)}>Editar</button>
                    <button style={{width:'80px',background:'red'}} onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                 </td>
                </tr>
                    ))} 
                </tbody>
        </table>
    </div>
   );
};