#nullable enable
using System.Threading.Tasks;
using APIt.Resources.Models;

namespace APIt.Services
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(string tipoDoc, string valorDoc, string password);
        Task<User?> GetUserByDocumentAsync(string tipoDoc, string valorDoc);
        Task<bool> UpdateUserAsync(User user);

        Task<string?> FindUserByFaceAsync(float[] faceVector, float threshold = 0.65f);

    }
}