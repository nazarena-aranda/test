#nullable enable
using System.Threading.Tasks;
using APIt.Resources.Models;
public interface IUserService
{
    Task<User> CreateUserAsync(string tipoDoc, string valorDoc, string password);
    Task<User?> GetUserByDocumentAsync(string tipoDoc, string valorDoc);
    Task<bool> UpdateUserAsync(User user);
}