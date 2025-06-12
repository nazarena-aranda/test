// futura funcion que  recive doc del user y devuelve el user 

// los usarios tambien se crearan y guardaran aca 
using System;
using System.Threading.Tasks;
using System.Net.Http;
using APIt.Resources.Models;
using System.Text.Json;
namespace APIt.Services
{
    public class UserService : IUserService
    {
        private readonly IAccessAgent _accessAgent;

        public UserService(IAccessAgent accessAgent)
        {
            _accessAgent = accessAgent;
        }

        public async Task<User> CreateUserAsync(string tipoDoc, string valorDoc, string password)
        {
            try
            {
                var resultado = await _accessAgent.GenerateAccessAsync(tipoDoc, valorDoc, password);
                string extractedPersonId = null;
                using JsonDocument doc = JsonDocument.Parse(resultado);
                JsonElement root = doc.RootElement;


                if (root.TryGetProperty("personIds", out JsonElement personIdsElement) && personIdsElement.ValueKind == JsonValueKind.String)
                {
                    extractedPersonId = personIdsElement.GetString();
                    var regUser = new User(extractedPersonId, tipoDoc, valorDoc);
                    return regUser;
                }
                else
                {
                    throw new InvalidOperationException("The 'personIds' property was not found or is not a string in the access agent response.");
                }

            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine("Error del agente:");
                Console.WriteLine(ex.Message);
                throw new ApplicationException("Error creating user: connection problem with external agent.", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error inesperado:");
                Console.WriteLine(ex.Message);
                throw new ApplicationException("An unexpected error occurred while trying to create the user.", ex);
            }

        }
    }

}