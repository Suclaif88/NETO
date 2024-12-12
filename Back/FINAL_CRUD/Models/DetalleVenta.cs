using System.Text.Json.Serialization;

namespace FINAL_CRUD.Models
{
    public class DetalleVenta
    {
        public int DetalleVentaId { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }

        // Relaciones
        public int VentaId { get; set; }
        [JsonIgnore]
        public Venta? Venta { get; set; }

        public int ProductoId { get; set; }
        [JsonIgnore]
        public Producto? Producto { get; set; }

        public decimal Subtotal { get; set; }
        }
}
