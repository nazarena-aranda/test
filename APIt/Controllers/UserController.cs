using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APIt.Models;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{       
    // Endpoint para generar el usuario
    [HttpPost("register")]
    public IActionResult Register([FromForm] string tipoDoc,[FromForm] int valorDoc)
    {
        // Aca se va a usar la api de willin para saber si los documentos son validos

        var user = new User(null);
        return Ok(new { message = $"Este es tu ID: '{user.id}'" });
    }

    // Endpoint para poner al usario los vectores 
    [HttpPost("biometric/{id}")]
    public IActionResult Biometric([FromForm] IFormFile image)
    {

        
        return Ok(new { message = "User registered successfully." });
    }

    // Endpoint para validar el acceso de un usuario ( y vector facial)
    [HttpPost("login")]
    public IActionResult Login([FromBody] User loginUser)
    {

        return Ok(new { message = "Access granted." });
    }

}
