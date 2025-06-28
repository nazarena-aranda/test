#nullable enable
using System.Collections.Generic;
using System.Threading.Tasks;
using APIt.Resources.Models;

namespace APIt.Services
{
    public interface IDoorService
    {
        Task<List<Door>> GetAllDoorsAsync();
        Task<Door?> GetDoorByIdAsync(string doorId);

        Task RegisterSuccessfulAccessAsync(string doorId);
        Task RegisterFailedAccessAsync(string doorId);
    }
}
