using Microsoft.AspNetCore.Mvc;
using FINAL_CRUD.Models;
using Microsoft.EntityFrameworkCore;
using FINAL_CRUD.Models.Data;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComprasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ComprasController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCompras()
    {
        var compras = await _context.Compras
                                    .Include(c => c.Proveedor)  // Cargar la información del proveedor
                                    .Include(c => c.Detalles)   // Cargar los detalles de la compra
                                    .ThenInclude(d => d.Producto)  // Cargar los productos dentro de los detalles
                                    .ToListAsync();
        return Ok(compras);
    }

    // Obtener una compra por ID con detalles
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompra(int id)
    {
        var compra = await _context.Compras
                                  .Include(c => c.Proveedor)
                                  .Include(c => c.Detalles)
                                  .ThenInclude(d => d.Producto)
                                  .FirstOrDefaultAsync(c => c.CompraId == id);
        if (compra == null) return NotFound();
        return Ok(compra);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompra([FromBody] Compra compra)
    {
        if (compra == null)
        {
            return BadRequest("Los datos de la compra son requeridos.");
        }

        // Verifica que el ProveedorId esté presente
        if (compra.ProveedorId == 0)
        {
            return BadRequest("El ProveedorID es obligatorio.");
        }

        // Verificar si el proveedor existe con el ProveedorId
        var proveedor = await _context.Proveedores
            .FirstOrDefaultAsync(p => p.ProveedorId == compra.ProveedorId);

        if (proveedor == null)
        {
            return BadRequest("El ProveedorID proporcionado no existe.");
        }

        // Establecer la fecha actual si no está establecida
        compra.Fecha = DateTime.Now;

        // Asignar el proveedor a la compra
        compra.Proveedor = proveedor;

        // Agregar la compra al contexto
        _context.Compras.Add(compra);

        // Guardar los cambios en la base de datos
        await _context.SaveChangesAsync();

        // Retornar una respuesta con el detalle de la compra creada, incluyendo el proveedor
        return CreatedAtAction(nameof(GetCompra), new { id = compra.CompraId }, compra);
    }


    // Agregar detalles a una compra existente
    [HttpPost("{compraId}/detalles")]
    public async Task<IActionResult> AddDetalleCompra(int compraId, [FromBody] List<DetalleCompra> detalles)
    {
        var compra = await _context.Compras.Include(c => c.Detalles).FirstOrDefaultAsync(c => c.CompraId == compraId);
        if (compra == null) return NotFound("La compra especificada no existe.");

        decimal totalCompra = compra.Total;

        foreach (var detalle in detalles)
        {
            var producto = await _context.Productos.FindAsync(detalle.ProductoId);
            if (producto == null) return BadRequest($"El producto con ID {detalle.ProductoId} no existe.");

            // El precio unitario ahora se obtiene del producto
            detalle.Precio = producto.PrecioCompra;

            // Calcula el Subtotal
            detalle.Subtotal = detalle.Cantidad * detalle.Precio;

            // Actualiza el total de la compra
            totalCompra += detalle.Subtotal;

            // Reduce el stock del producto
            producto.Stock += detalle.Cantidad;

            _context.DetalleCompras.Add(detalle);
        }

        // Actualiza el total de la venta
        compra.Total = totalCompra;
        await _context.SaveChangesAsync();
        return Ok(compra);
    }

    // Actualizar una compra (solo campos generales)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCompra(int id, [FromBody] Compra compra)
    {
        if (id != compra.CompraId) return BadRequest();

        var existingCompra = await _context.Compras.Include(c => c.Detalles).FirstOrDefaultAsync(c => c.CompraId == id);
        if (existingCompra == null) return NotFound();

        existingCompra.ProveedorId = compra.ProveedorId; // Actualiza campos necesarios
        _context.Entry(existingCompra).State = EntityState.Modified;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Eliminar una compras junto con sus detalles
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompra(int id)
    {
        var compra = await _context.Compras.Include(c => c.Detalles).FirstOrDefaultAsync(c => c.CompraId == id);
        if (compra == null) return NotFound();

        foreach (var detalle in compra.Detalles)
        {
            var producto = await _context.Productos.FindAsync(detalle.ProductoId);
            if (producto != null)
            {
                producto.Stock -= detalle.Cantidad; // Reponer el stock
            }
        }

        _context.Compras.Remove(compra);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
