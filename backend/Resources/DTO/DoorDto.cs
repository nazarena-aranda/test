using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace APIt.Resources.DTO
{
    public class OpenDto
    {
        [Required(ErrorMessage = "The DoorId  is required.")]
        public required string DoorId { get; set; }

        public string? UserId { get; set; } 

    }
    
    
}