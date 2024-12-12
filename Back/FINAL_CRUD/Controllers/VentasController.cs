using Microsoft.AspNetCore.Mvc;
using FINAL_CRUD.Models;
using Microsoft.EntityFrameworkCore;
using FINAL_CRUD.Models.Data;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VentasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public VentasController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Obtener todas las ventas
    [HttpGet]
    public async Task<IActionResult> GetAllVentas()
    {
        var ventas = await _context.Ventas
                                   .Include(v => v.Cliente)
                                   .Include(v => v.Detalles)
                                   .ThenInclude(d => d.Producto)
                                   .ToListAsync();
        return Ok(ventas);
    }

    // Obtener una venta por ID con detalles
    [HttpGet("{id}")]
    public async Task<IActionResult> GetVenta(int id)
    {
        var venta = await _context.Ventas
                                  .Include(v => v.Cliente)
                                  .Include(v => v.Detalles)
                                  .ThenInclude(d => d.Producto)
                                  .FirstOrDefaultAsync(v => v.VentaId == id);
        if (venta == null) return NotFound();
        return Ok(venta);
    }

    // Crear una venta sin detalles (pueden añadirse posteriormente)
    [HttpPost]
    public async Task<IActionResult> CreateVenta([FromBody] Venta venta)
    {
        if (venta == null) return BadRequest("Los datos de la venta son requeridos.");

        // Verifica que el ClienteId esté presente
        if (venta.ClienteId == 0) return BadRequest("El ClienteId es obligatorio.");

        // Verificar si el cliente existe
        var cliente = await _context.Clientes.FindAsync(venta.ClienteId);
        if (cliente == null)
        {
            return BadRequest("El ClienteId proporcionado no existe.");
        }

        venta.Fecha = DateTime.Now; // Establece la fecha actual

        _context.Ventas.Add(venta);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetVenta), new { id = venta.VentaId }, venta);
    }


    // Agregar detalles a una venta existente
    [HttpPost("{ventaId}/detalles")]
    public async Task<IActionResult> AddDetalleVenta(int ventaId, [FromBody] List<DetalleVenta> detalles)
    {
        var venta = await _context.Ventas.Include(v => v.Detalles).FirstOrDefaultAsync(v => v.VentaId == ventaId);
        if (venta == null) return NotFound("La venta especificada no existe.");

        decimal totalVenta = venta.Total;

        foreach (var detalle in detalles)
        {
            var producto = await _context.Productos.FindAsync(detalle.ProductoId);
            if (producto == null) return BadRequest($"El producto con ID {detalle.ProductoId} no existe.");
            if (producto.Stock < detalle.Cantidad) return BadRequest($"No hay suficiente stock para el producto {producto.Nombre}.");

            // El precio unitario ahora se obtiene del producto
            detalle.Precio = producto.PrecioVenta;

            // Calcula el Subtotal
            detalle.Subtotal = detalle.Cantidad * detalle.Precio;

            // Actualiza el total de la venta
            totalVenta += detalle.Subtotal;

            // Reduce el stock del producto
            producto.Stock -= detalle.Cantidad;

            _context.DetalleVentas.Add(detalle);
        }

        // Actualiza el total de la venta
        venta.Total = totalVenta;
        await _context.SaveChangesAsync();
        return Ok(venta);
    }

    // Actualizar una venta (solo campos generales)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVenta(int id, [FromBody] Venta venta)
    {
        if (id != venta.VentaId) return BadRequest();

        var existingVenta = await _context.Ventas.Include(v => v.Detalles).FirstOrDefaultAsync(v => v.VentaId == id);
        if (existingVenta == null) return NotFound();

        existingVenta.ClienteId = venta.ClienteId; // Actualiza campos necesarios
        _context.Entry(existingVenta).State = EntityState.Modified;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Eliminar una venta junto con sus detalles
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVenta(int id)
    {
        var venta = await _context.Ventas.Include(v => v.Detalles).FirstOrDefaultAsync(v => v.VentaId == id);
        if (venta == null) return NotFound();

        foreach (var detalle in venta.Detalles)
        {
            var producto = await _context.Productos.FindAsync(detalle.ProductoId);
            if (producto != null)
            {
                producto.Stock += detalle.Cantidad; // Reponer el stock
            }
        }

        _context.Ventas.Remove(venta);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Eliminar un detalle específico de una venta
    [HttpDelete("detalles/{detalleId}")]
    public async Task<IActionResult> DeleteDetalleVenta(int detalleId)
    {
        var detalle = await _context.DetalleVentas.FindAsync(detalleId);
        if (detalle == null) return NotFound();

        var venta = await _context.Ventas.FindAsync(detalle.VentaId);
        if (venta != null) venta.Total -= detalle.Subtotal;

        var producto = await _context.Productos.FindAsync(detalle.ProductoId);
        if (producto != null) producto.Stock += detalle.Cantidad;

        _context.DetalleVentas.Remove(detalle);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
