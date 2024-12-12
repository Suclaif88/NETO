namespace FINAL_CRUD.Models
{
    public class Cliente
    {
        public int ClienteId { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Telefono { get; set; } = null!;

        // Relación
        public ICollection<Venta> Ventas { get; set; } = new List<Venta>();

    }
}
