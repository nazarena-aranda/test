using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APIt.Resources.Models;
using APIt.Resources.DTO;
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
    public IActionResult Register([FromBody] RegisterDto request)
    {
        var regUser = new User(new[] { "2376", "9472" }, request.TipoDoc, request.ValorDoc);
        var token = _tokenService.GenerateToken(request.TipoDoc, request.ValorDoc, isAdmin: false);

        return Ok(new
        {
            Token = token,
            UserIds = regUser.User_Id,
            TipoDoc = regUser.TypeDocuments,
            Documento = regUser.Documents
        });
    }


    // Endpoint para poner al usario los vectores 
    [HttpPost("biometric")]
    public IActionResult Biometric([FromForm] IFormFile image)
    {


        return Ok(new { message = "User registered successfully." });
    }

    // Endpoint para validar el acceso de un usuario ( y vector facial)
    [HttpPost("login")]
    public IActionResult Login([FromForm] IFormFile image)
    {
        if (image != null && image.Length > 0)
        {
            return Ok(new { message = "Access granted." });
        }
        else
        {
            return Unauthorized(new { message = "Access denied. No image provided." });
        }
    }


    [HttpPost("admin")]
    public IActionResult Admin()
    {

        return Ok(new { message = "Access granted." });
    }

}
