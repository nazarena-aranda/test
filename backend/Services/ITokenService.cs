using System.Security.Claims;

public interface ITokenService
{
    string GenerateToken(string typeDocuments, string documents, bool isAdmin);
    ClaimsPrincipal GetClaimsFromToken(string token);
}
