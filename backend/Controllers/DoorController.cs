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
using System.IO;
using System.Linq;

[Route("api/zonamerica/door")]
[ApiController]
public class ZonamericaDoorController : ControllerBase
{
    private readonly TokenService _tokenService;
    private readonly IDoorService _doorService;

    public ZonamericaDoorController(TokenService tokenService, IDoorService doorService, IUserService userService)
    {
        _tokenService = tokenService;
        _doorService = doorService;
    }

    [HttpGet("AllDoors")]
    public async Task<IActionResult> AllDoors()
    {
        var doors = await _doorService.GetAllDoorsAsync();
        return Ok(doors);
    }

    [HttpPost("open")]
    public async Task<IActionResult> OpenDoor([FromBody] OpenDto dto)
    {
        if (!ModelState.IsValid || string.IsNullOrWhiteSpace(dto.DoorId))
        {
            return BadRequest(new { message = "Datos inválidos." });
        }

        // Como por ahora no sabemos enviar a Lenel, solo imprimos en consola para confirmar si llegó bien
        Console.WriteLine($"[LENEL SIMULADO] Se intenta abrir la puerta: {dto.DoorId}");

        // Esto es para después guardar en mongo el acceso
        await _doorService.RegisterSuccessfulAccessAsync(dto.DoorId);

        return Ok(new { message = "Acceso registrado correctamente" });
    }

}
