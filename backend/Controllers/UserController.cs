#nullable enable
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using APIt.Resources.Models;
using APIt.Resources.DTO;
using System;
using APIt.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


[Route("api/zonamerica")]
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
            //aca se podra crear otro catch cuando se intente crear us usuario duplicado
            var token = _tokenService.GenerateToken(createdUser.TypeDocuments, createdUser.Documents, isAdmin: false);
            return Ok(new
            {
                Token = token,
                UserIds = createdUser.User_Id,
                TipoDoc = createdUser.TypeDocuments,
                Documento = createdUser.Documents
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error inregistation: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred during registration." });
        }
    }

    [Authorize]
    [HttpPost("biometric")]
    public async Task<IActionResult> RegisterBiometric([FromForm] BiometricDto request)
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;


        if (identity == null || !identity.IsAuthenticated)
        {
            return Unauthorized("token invalid.");
        }


        var typeDocumentsClaim = identity.FindFirst("TypeDocuments");
        var documentsClaim = identity.FindFirst("Documents");

        if (typeDocumentsClaim is null)
        {
            return BadRequest("The claim do not have 'TypeDocuments'");
        }

        if (documentsClaim is null)
        {
            return BadRequest("The claim do not have 'Documents'");
        }

        string TypeDocument = typeDocumentsClaim.Value;
        string valueDocument = documentsClaim.Value;

        try
        {
            User? user = await _userService.GetUserByDocumentAsync(TypeDocument, valueDocument);

            if (user == null)
            {
                return NotFound("the user is not found in the database");
            }



            // para nazarena :en esta linea es donde se deberian asignar los datos biometricos 
            //user.UserBiometric = 



            bool updated = await _userService.UpdateUserAsync(user);


            if (updated)
            {
                return Ok(new { message = $"the biometric data insert was sucesfull" });
            }
            else
            {
                return StatusCode(500, new { message = "is a problem saving the biometric data" });
            }
        }
        catch (ApplicationException ex)
        {
            return StatusCode(500, new { message = $"Error : {ex.Message}" });
        }
        catch (Exception ex)
        {
            // Captura cualquier otra excepción inesperada
            Console.WriteLine($"Unexpected error when registering biometrics: {ex.Message}");
            return StatusCode(500, new { message = $"Error : {ex.Message}" });
        }

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
