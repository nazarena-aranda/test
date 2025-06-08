// futura funcion que  recive doc del user y devuelve el user 

// los usarios tambien se crearan y guardaran aca 
using System;
using System.Threading.Tasks;

public class UserService : IUserService
{
    private readonly IAccessAgent _accessAgent;

    public UserService(IAccessAgent accessAgent)
    {
        _accessAgent = accessAgent;
    }

    public async Task CreateUser(string tipoDoc, string valorDoc, string password)
    {
        try
        {
            var resultado = await _accessAgent.GenerateAccessAsync(tipoDoc, valorDoc, password);
            Console.WriteLine("funciona");
            Console.WriteLine("Respuesta del agente: " + resultado);
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine("Error del agente:");
            Console.WriteLine(ex.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error inesperado:");
            Console.WriteLine(ex.Message);
        }
    }
}
