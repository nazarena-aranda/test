using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;



public class InternalAccessAgent : IAccessAgent
{
    private readonly HttpClient _httpClient;

    public InternalAccessAgent(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("http://201.217.142.42:16003/api/");
    }

    public async Task<string> GenerateAccessAsync(string tipoDoc, string valorDoc, string password)
    {
        var payload = new
        {
            TipoDoc = tipoDoc,
            ValorDoc = valorDoc,
            Password = password
        };

        var response = await _httpClient.PostAsJsonAsync("access/generateaccess", payload);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Error: {response.StatusCode}, Detalle: {errorContent}");
        }

        return await response.Content.ReadAsStringAsync();
    }
}
