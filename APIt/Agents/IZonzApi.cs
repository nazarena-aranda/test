using System.Threading.Tasks;
public interface IAccessAgent
{
    Task<string> GenerateAccessAsync(string tipoDoc, string valorDoc, string password);
}

