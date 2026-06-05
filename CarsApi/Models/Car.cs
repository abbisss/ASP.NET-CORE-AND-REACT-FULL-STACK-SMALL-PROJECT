using System.ComponentModel.DataAnnotations;
namespace CarsApi.Models
{
    public class Car
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Brand { get; set; }

        [Required]
        [StringLength(100)]
        public string Model { get; set; }

        [Required]
        [Range(1990, 2100)]
        public int Year { get; set; }

        [Required]
        [Range(1, 10000)]
        public decimal PricePerDay { get; set; }

        [Required]
        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}
