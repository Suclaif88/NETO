namespace FINAL_CRUD.Models
{
    public class Producto
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public decimal PrecioVenta { get; set; }
        public decimal PrecioCompra {  get; set; }
        public int Stock { get; set; }

        // Relación
        public ICollection<DetalleVenta> DetalleVentas { get; set; } = new List<DetalleVenta>();
        public ICollection<DetalleCompra> DetalleCompras { get; set; } = new List<DetalleCompra>();
    }
}
