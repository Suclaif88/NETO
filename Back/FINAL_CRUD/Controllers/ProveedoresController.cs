using Microsoft.AspNetCore.Mvc;
using FINAL_CRUD.Models;
using Microsoft.EntityFrameworkCore;
using FINAL_CRUD.Models.Data;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProveedoresController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProveedoresController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProveedores()
    {
        var proveedores = await _context.Proveedores.ToListAsync();
        return Ok(proveedores);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProveedor(int id)
    {
        var proveedor = await _context.Proveedores.FindAsync(id);
        if (proveedor == null) return NotFound();
        return Ok(proveedor);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProveedor([FromBody] Proveedor proveedor)
    {
        _context.Proveedores.Add(proveedor);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProveedor), new { id = proveedor.ProveedorId }, proveedor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProveedor(int id, [FromBody] Proveedor proveedor)
    {
        if (id != proveedor.ProveedorId) return BadRequest();
        _context.Entry(proveedor).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProveedor(int id)
    {
        var proveedor = await _context.Proveedores.FindAsync(id);
        if (proveedor == null) return NotFound();
        _context.Proveedores.Remove(proveedor);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
