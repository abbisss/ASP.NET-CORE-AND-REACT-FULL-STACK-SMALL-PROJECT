using CarsApi.Data;
using CarsApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace CarsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(
            AppDbContext context,
            IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public class AdminLoginDto
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginDto model)
        {
            var user = _context.Users.FirstOrDefault(x =>
                x.Username == model.Username &&
                x.Password == model.Password && x.Role == "admin");

            if (user == null)
            {
                return Unauthorized("Invalid admin credentials");
            }

            var claims = new[]
            {
                   new Claim(ClaimTypes.Name, user.Username),
                   new Claim(ClaimTypes.Role, user.Role)
             };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

    }
}
