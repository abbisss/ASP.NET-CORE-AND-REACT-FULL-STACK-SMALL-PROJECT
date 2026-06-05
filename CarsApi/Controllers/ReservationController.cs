using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarsApi.Data;
using CarsApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace CarsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ReservationController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<IActionResult> GetReservations()
        {
            try
            {
                var reserves = await _context.Reservations.ToListAsync();
                return Ok(reserves);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserReservations(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return BadRequest("Failed to get reserve");
                }
                var reservations = await _context.Reservations
                                                 .Where(r => r.UserId == id)
                                                 .ToListAsync();
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateUserReservation(CreateReservationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var reservation = new Reservation
                {
                    UserId = dto.UserId,
                    CarId = dto.CarId,
                    PickupDate = dto.PickupDate,
                    ReturnDate = dto.ReturnDate
                };

                await _context.Reservations.AddAsync(reservation);
                await _context.SaveChangesAsync();

                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserReservation(int id, UpdateReservationDto dto)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(id);

                if (reservation == null)
                {
                    return NotFound("Reservation not found");
                }

                reservation.PickupDate = dto.PickupDate;
                reservation.ReturnDate = dto.ReturnDate;

                await _context.SaveChangesAsync();

                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservations(int id) 
        {
            try
            {
                var reserve = await _context.Reservations.FindAsync(id);
                if(reserve == null)
                {
                    return BadRequest("reserve not found");
                }
                _context.Reservations.Remove(reserve);
                await _context.SaveChangesAsync();
                return Ok("Reserve deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
