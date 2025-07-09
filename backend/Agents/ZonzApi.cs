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
        _httpClient.BaseAddress = new Uri("https://zonago.zonamerica.com/");
    }

    public async Task<string> GenerateAccessAsync(string tipoDoc, string valorDoc, string pass)
    {
        var payload = new
        {
            documentType = tipoDoc,
            documentNumber = valorDoc,
            password = pass
        };

        var response = await _httpClient.PostAsJsonAsync("api/auth", payload);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Error: {response.StatusCode}, Detail: {errorContent}");
        }

        return await response.Content.ReadAsStringAsync();
    }
}
