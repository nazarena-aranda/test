using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace APIt.Resources.DTO
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "The document type is required.")]
        public string TipoDoc { get; set; }

        [Required(ErrorMessage = "The document number is required.")]
        public string ValorDoc { get; set; }

        [Required(ErrorMessage = "The password is required.")]
        public string Password { get; set; }
    }

    public class AdminDto
    {
        [Required(ErrorMessage = "The door ID is required.")]
        public required string DoorId { get; set; }
    }

    public class BiometricDto
    {
        [Required(ErrorMessage = "The image file is required.")]
        public IFormFile file { get; set; }
    }

    public class LoginDto
    {
        [Required(ErrorMessage = "The image file is required.")]
        public IFormFile ImageFile { get; set; }
    }
}