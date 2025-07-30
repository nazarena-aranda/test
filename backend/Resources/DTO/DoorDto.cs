using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace APIt.Resources.DTO
{
    public class OpenDto
    {
        [Required(ErrorMessage = "The DoorId  is required.")]
        public required string DoorId { get; set; }

        [Required(ErrorMessage = "The image file is required.")]
        public required IFormFile ImageFile { get; set; }


    }
    
    
}