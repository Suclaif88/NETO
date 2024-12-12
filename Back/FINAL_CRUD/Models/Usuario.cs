using System.ComponentModel.DataAnnotations;

namespace FINAL_CRUD.Models
{
    public class Usuario
    {
        [Key]
        public int UserId { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Telefono { get; set; } = null!;
        public string pass { get; set; } = null!;
    }
}
