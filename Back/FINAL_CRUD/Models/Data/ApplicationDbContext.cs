using Microsoft.EntityFrameworkCore;

namespace FINAL_CRUD.Models.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSet para todas las entidades
        public DbSet<Cliente> Clientes { get; set; } = null!;
        public DbSet<Proveedor> Proveedores { get; set; } = null!;
        public DbSet<Producto> Productos { get; set; } = null!;
        public DbSet<Venta> Ventas { get; set; } = null!;
        public DbSet<Compra> Compras { get; set; } = null!;
        public DbSet<DetalleVenta> DetalleVentas { get; set; } = null!;
        public DbSet<DetalleCompra> DetalleCompras { get; set; } = null!;
        public DbSet<Usuario> Usuarios { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relaciones
            modelBuilder.Entity<Venta>()
                .HasOne(v => v.Cliente)
                .WithMany(c => c.Ventas)
                .HasForeignKey(v => v.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Compra>()
                .HasOne(c => c.Proveedor)
                .WithMany(p => p.Compras)
                .HasForeignKey(c => c.ProveedorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DetalleVenta>()
                .HasOne(dv => dv.Venta)
                .WithMany(v => v.Detalles)
                .HasForeignKey(dv => dv.VentaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DetalleVenta>()
                .HasOne(dv => dv.Producto)
                .WithMany(p => p.DetalleVentas)
                .HasForeignKey(dv => dv.ProductoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DetalleCompra>()
                .HasOne(dc => dc.Compra)
                .WithMany(c => c.Detalles)
                .HasForeignKey(dc => dc.CompraId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DetalleCompra>()
                .HasOne(dc => dc.Producto)
                .WithMany(p => p.DetalleCompras)
                .HasForeignKey(dc => dc.ProductoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuración de precisión decimal
            modelBuilder.Entity<Venta>()
                .Property(v => v.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Compra>()
                .Property(c => c.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Producto>()
                .Property(p => p.PrecioVenta)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Producto>()
                .Property(p => p.PrecioCompra)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<DetalleVenta>()
                .Property(dv => dv.Precio)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<DetalleVenta>()
                .Property(dv => dv.Subtotal)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<DetalleCompra>()
                .Property(dc => dc.Precio)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<DetalleCompra>()
                .Property(dc => dc.Subtotal)
                .HasColumnType("decimal(18,2)");
        }
    }
}
