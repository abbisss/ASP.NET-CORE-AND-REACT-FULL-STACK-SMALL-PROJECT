using CarsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CarsApi.Data
{
    //bridge between c# and database
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
        {

        }
        public DbSet<Car> Cars { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
    }
}
