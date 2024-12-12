using Microsoft.AspNetCore.Mvc;
using FINAL_CRUD.Models;
using Microsoft.EntityFrameworkCore;
using FINAL_CRUD.Models.Data;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClienteController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ClienteController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllClientes()
    {
        var clientes = await _context.Clientes.ToListAsync();
        return Ok(clientes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCliente(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return NotFound();
        return Ok(cliente);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCliente([FromBody] Cliente cliente)
    {
        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCliente), new { id = cliente.ClienteId }, cliente);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCliente(int id, [FromBody] Cliente cliente)
    {
        if (id != cliente.ClienteId) return BadRequest();
        _context.Entry(cliente).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return NotFound();
        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
