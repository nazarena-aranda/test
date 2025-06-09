using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APIt.Resources.Models;
using APIt.Resources.DTO;
using System;
using APIt.Services;
using Microsoft.AspNetCore.Authorization;


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


    [Authorize]
    [HttpPost("biometric")]
    public IActionResult Biometric([FromForm] BiometricDto request)
    {


        return Ok(new { message = "User registered successfully." });
    }

    // Endpoint para validar el acceso de un usuario ( y vector facial)

    [HttpPost("login")]
    public IActionResult Login([FromForm] LoginDto request)
    {
        if (request.Image != null && request.Image.Length > 0)
        {
            return Ok(new { message = "Access granted." });
        }
        else
        {
            return Unauthorized(new { message = "Access denied. No image provided." });
        }
    }


    [HttpPost("admin")]
    public IActionResult Admin([FromBody] AdminDto request)
    {

        return Ok(new { message = "Access granted." });
    }

}
