using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class ExternalAccessAgent
{
    private readonly HttpClient _httpClient;

    public ExternalAccessAgent(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("http://10.105.0.9:11000/");
    }

    public async Task<string> OpenDoorAsync(string qrCode, int[] personIds)
    {
        var payload = new
        {
            Username = "appaccesoza",
            Password = "gQtu,&7-",
            QrCode = qrCode,
            PersonIDs = personIds
        };

        var response = await _httpClient.PostAsJsonAsync("api/Access/GenerateAccess", payload);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Error: {response.StatusCode}, Detail: {error}");
        }

        return await response.Content.ReadAsStringAsync();
    }
}
