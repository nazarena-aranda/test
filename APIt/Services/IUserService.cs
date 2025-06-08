using System.Threading.Tasks;

public interface IUserService
{
    Task CreateUser(string tipoDoc, string valorDoc, string password);

}