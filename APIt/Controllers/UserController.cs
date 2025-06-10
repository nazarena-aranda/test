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

    private readonly IUserService _userService;

    public zonamericaController(TokenService tokenService, IUserService userService)
    {
        _tokenService = tokenService;
        _userService = userService;
    }

    // Endpoint para generar el usuario
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var createdUser = await _userService.CreateUserAsync(request.TipoDoc, request.ValorDoc, request.Password);

            var token = _tokenService.GenerateToken(createdUser.TypeDocuments, createdUser.Documents, isAdmin: false);

            return Ok(new
            {
                Token = token,
                UserIds = createdUser.User_Id,
                TipoDoc = createdUser.TypeDocuments,
                Documento = createdUser.Documents
            });
        }
        catch (ApplicationException ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An unexpected error occurred in Register: {ex.Message}");
            return StatusCode(500, new { message = "An unexpected error occurred during registration." });
        }
    }


    [HttpPost("biometric")]
    public IActionResult Biometric([FromForm] BiometricDto request)
    {


        return Ok(new { message = "User registered successfully." });
    }

    // Endpoint para validar el acceso de un usuario ( y vector facial)

    [HttpPost("login")]
    public IActionResult Login([FromForm] LoginDto request)
    {
        if (request.ImageFile != null && request.ImageFile.Length > 0)
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
