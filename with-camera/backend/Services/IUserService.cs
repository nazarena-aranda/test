using System.Threading.Tasks;
using APIt.Resources.Models;
public interface IUserService
{
    Task<User> CreateUserAsync(string tipoDoc, string valorDoc, string password);

}