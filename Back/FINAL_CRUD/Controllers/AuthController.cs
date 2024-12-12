using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using FINAL_CRUD.Models.Data;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using FINAL_CRUD.Models;

namespace FINAL_CRUD.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Endpoint para registrar un nuevo usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Models.RegisterUsuarioDTO clienteDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Verificar si el correo ya está registrado
                var existingUsuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Correo == clienteDTO.Correo);

                if (existingUsuario != null)
                {
                    return BadRequest("El correo ya está registrado.");
                }

                // Crear el nuevo usuario
                var usuario = new Usuario
                {
                    Nombre = clienteDTO.Nombre,
                    Apellido = clienteDTO.Apellido,
                    Correo = clienteDTO.Correo,
                    Telefono = clienteDTO.Telefono,
                    pass = BCrypt.Net.BCrypt.HashPassword(clienteDTO.pass)
                };

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Usuario registrado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ocurrió un error al registrar el usuario.", Details = ex.Message });
            }
        }

        // Endpoint para iniciar sesión
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUsuarioDTO loginUsuario)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Buscar el usuario por correo
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Correo == loginUsuario.Correo);

                if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginUsuario.pass, usuario.pass))
                {
                    return Unauthorized("Credenciales inválidas.");
                }

                // Generar el token JWT
                var token = GenerateJwtToken(usuario);

                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Ocurrió un error al iniciar sesión.", Details = ex.Message });
            }
        }

        // Método para generar un token JWT
        private string GenerateJwtToken(Usuario usuario)
        {
            var Key = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(Key))
            {
                throw new InvalidOperationException("La clave secreta para el JWT no está configurada.");
            }

            var claims = new[] {
                new Claim(ClaimTypes.Name, usuario.Correo),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
