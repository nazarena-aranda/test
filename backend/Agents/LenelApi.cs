public async Task<string> OpenDoorAsync(string puerta, int[] personIds)
{
    var payload = new
    {
        Username = "appaccesoza",
        Password = "gQtu,&7-",
        Puerta = puerta,
        PersonIDs = personIds
    };

    var request = new HttpRequestMessage(HttpMethod.Post, "api/Access/GenerateAccess")
    {
        Content = JsonContent.Create(payload)
    };
    
    
    request.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json-patch+json");

    var response = await _httpClient.SendAsync(request);

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadAsStringAsync();
        throw new HttpRequestException($"Error: {response.StatusCode}, Detail: {error}");
    }

    return await response.Content.ReadAsStringAsync();
}
