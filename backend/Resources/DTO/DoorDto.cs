using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace APIt.Resources.DTO
{
    public class OpenDto
    {
        [Required(ErrorMessage = "The DoorId  is required.")]
        public string DoorId{ get; set; }

    }
}