namespace FINAL_CRUD.Models
{
    public class Proveedor
    {
        public int ProveedorId { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Telefono { get; set; } = null!;

        // Relación
        public ICollection<Compra> Compras { get; set; } = new List<Compra>();
    }
}
