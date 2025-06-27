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
using FaceAiSharp;
using FaceAiSharp.Extensions;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.IO;
using System.Linq;



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
            //aca se podra crear otro catch cuando se intente crear un usuario duplicado
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
            return StatusCode(500, new { message = $"{ex.Message}" });
        }
    }
    [Authorize]
    [HttpPost("biometric")]
    public async Task<IActionResult> RegisterFaceAsync([FromForm] BiometricDto request)
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


        if (request.file == null || request.file.Length == 0)
            return BadRequest("No file uploaded.");

        var detector = FaceAiSharpBundleFactory.CreateFaceDetectorWithLandmarks();
        var generator = FaceAiSharpBundleFactory.CreateFaceEmbeddingsGenerator();

        var image = await Image.LoadAsync<Rgb24>(request.file.OpenReadStream());
        var faces = detector.DetectFaces(image);

        if (faces.Count == 0)
            return BadRequest("No face detected.");

        var face = faces.First();
        generator.AlignFaceUsingLandmarks(image, face.Landmarks!);
        var embedding = generator.GenerateEmbedding(image);

        // Convert image a MemoryStream
        await using var outputStream = new MemoryStream();
        await image.SaveAsJpegAsync(outputStream);
        outputStream.Position = 0;

        // Convert image bytes to base64 string
        string base64Image = Convert.ToBase64String(outputStream.ToArray());

        var user = await _userService.GetUserByDocumentAsync(TypeDocument, valueDocument);
        if (user == null)
            return NotFound("User not found.");

        user.UserBiometric = embedding;
        var updated = await _userService.UpdateUserAsync(user);

        if (!updated)
            return StatusCode(500, new { message = "Failed to update biometric data." });

        return Ok(new
        {
            message = "Biometric data saved successfully.",
            image = $"data:image/jpeg;base64,{base64Image}"
        });
    }



    // Endpoint para validar el acceso de un usuario ( y vector facial)

    [HttpPost("login")]
public async Task<IActionResult> Login([FromForm] LoginDto request)
{
    if (request.ImageFile == null || request.ImageFile.Length == 0)
    {
        return BadRequest("No image provided.");
    }

    // Copiar archivo a memoria
    await using var ms = new MemoryStream();
    await request.ImageFile.CopyToAsync(ms);
    ms.Position = 0;


    // Procesar imagen
    ms.Position = 0;
    using var image = Image.Load<Rgb24>(ms);

    var detector = FaceAiSharpBundleFactory.CreateFaceDetectorWithLandmarks();
    var generator = FaceAiSharpBundleFactory.CreateFaceEmbeddingsGenerator();

    var faces = detector.DetectFaces(image);
    if (faces.Count == 0)
        return BadRequest("No face detected in the image.");

    var face = faces.First();
    generator.AlignFaceUsingLandmarks(image, face.Landmarks!);
    var faceVectors = generator.GenerateEmbedding(image);

    // Comparar vectores
    var match = _userService.FindUserByFace(faceVectors, 0.75f);

    if (match)
        return Ok(new { message = "Access granted. Face matched." });
    else
        return Unauthorized(new { message = "Access denied. Face does not match." });
}



    [HttpPost("admin")]
    public IActionResult Admin([FromBody] AdminDto request)
    {

        return Ok(new { message = "Access granted." });
    }

}