using System.Text.Json.Serialization;

namespace FINAL_CRUD.Models
{
    public class DetalleCompra
    {
        public int DetalleCompraId { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }

        // Relaciones
        public int CompraId { get; set; }
        [JsonIgnore]
        public Compra? Compra { get; set; }

        public int ProductoId { get; set; }
        [JsonIgnore]
        public Producto? Producto { get; set; }

        public decimal Subtotal { get; set; }
    }   
}
