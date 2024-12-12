

namespace FINAL_CRUD.Models
{
    public class Compra
    {
        public int CompraId { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
        public decimal Total { get; set; }

        // Relación con Proveedor
        public int ProveedorId { get; set; }

        // Ahora la propiedad Proveedor ya no está marcada con [JsonIgnore]
        public Proveedor? Proveedor { get; set; } = null!;

        // Relación con Detalles de Compra
        public ICollection<DetalleCompra> Detalles { get; set; } = new List<DetalleCompra>();
    }
}
