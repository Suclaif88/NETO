import '../Styles/NavBar.css'

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><a href="/dashboard">Inicio</a></li>
                <li><a href="/clientes">Cliente</a></li>
                <li><a href="/productos">Productos</a></li>
                <li><a href="/proveedores">Proveedores</a></li>
                <li><a href="/compras">Compras</a></li>
                <li><a href="/ventas">Ventas</a></li>
            </ul>
        </nav>
    );
};

export default NavBar;
