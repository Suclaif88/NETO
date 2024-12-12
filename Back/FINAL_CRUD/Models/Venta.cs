using FINAL_CRUD.Models;
using System.Text.Json.Serialization;

public class Venta
{
    public int VentaId { get; set; }
    public DateTime Fecha { get; set; } = DateTime.Now;
    public decimal Total { get; set; }

    public int ClienteId { get; set; }

    public Cliente? Cliente { get; set; } = null;

    public ICollection<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();
}
