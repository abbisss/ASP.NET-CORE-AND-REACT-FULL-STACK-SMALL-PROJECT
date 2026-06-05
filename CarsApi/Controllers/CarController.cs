using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarsApi.Data;
using CarsApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace CarsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CarController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCars()
        {
            try
            {
                var cars = await _context.Cars.ToListAsync();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            try
            {
                var car = await _context.Cars.FindAsync(id);
                if (car == null)
                {
                    return NotFound("Car not found");
                }
                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCar(Car car)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                await _context.Cars.AddAsync(car);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, Car car)
        {
            try
            {
                if (id != car.Id)
                {
                    return BadRequest("Car Id dismatch");
                }
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Entry(car).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            try
            {
                var car = await _context.Cars.FindAsync(id);
                if (car == null)
                {
                    return BadRequest("Car not found");
                }
                _context.Cars.Remove(car);
                await _context.SaveChangesAsync();
                return Ok("Car deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
