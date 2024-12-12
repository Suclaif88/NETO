using Microsoft.AspNetCore.Mvc;
using FINAL_CRUD.Models;
using Microsoft.EntityFrameworkCore;
using FINAL_CRUD.Models.Data;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProductos()
    {
        var productos = await _context.Productos.ToListAsync();
        return Ok(productos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProducto(int id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto == null) return NotFound();
        return Ok(producto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProducto([FromBody] Producto producto)
    {
        _context.Productos.Add(producto);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoId }, producto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProducto(int id, [FromBody] Producto producto)
    {
        if (id != producto.ProductoId) return BadRequest();
        _context.Entry(producto).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProducto(int id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto == null) return NotFound();
        _context.Productos.Remove(producto);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
