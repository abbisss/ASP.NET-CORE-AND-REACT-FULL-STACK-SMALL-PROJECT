namespace CarsApi.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int CarId { get; set; }
        public Car Car { get; set; }

        public DateTime PickupDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }

    public class CreateReservationDto
    {
        public int UserId { get; set; }
        public int CarId { get; set; }
        public DateTime PickupDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }

    public class UpdateReservationDto
    {
        public DateTime PickupDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
