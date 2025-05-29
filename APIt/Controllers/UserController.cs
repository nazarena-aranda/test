using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APIt.Models;
using System;

[Route("api/[controller]")]
[ApiController]
public class zonamericaController : ControllerBase
{
    private readonly TokenService _tokenService;

    public zonamericaController(TokenService tokenService)
    {
        _tokenService = tokenService;
    }




    // Endpoint para generar el usuario
    [HttpPost("register")]
    public IActionResult Register([FromForm] string[] UserId, [FromForm] string tipoDoc, [FromForm] string valorDoc, [FromForm] string password)
    {//depende de donde este la api de zonameria es si se queda aca ide o se queda contraseña

        // Aca se va a usar la api de willin para saber si los documentos son validos

        var regUser = new User(UserId, tipoDoc, valorDoc);
        var token = _tokenService.GenerateToken(tipoDoc, valorDoc, isAdmin: false);
        return Ok(new
        {
            Token = token,
            UserIds = regUser.User_Id,
            TipoDoc = regUser.TypeDocuments,
            Documento = regUser.Documents
        });

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


    [HttpPost("admin")]
    public IActionResult Admin([FromBody] User loginUser)
    {

        return Ok(new { message = "Access granted." });
    }
}
