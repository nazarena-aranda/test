using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class TokenService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    //private readonly string _issuer;
    //private readonly string _audience;
    private readonly int _expirationMinutes;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        var jwtSettings = _configuration.GetSection("JwtSettings");
        _secretKey = jwtSettings["SecretKey"];
        //_issuer = jwtSettings["Issuer"];
        //_audience = jwtSettings["Audience"];
        _expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"]);
    }

    public string GenerateToken(string typeDocuments, string documents, bool isAdmin)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var claims = new[]
        {
        new Claim("TypeDocuments", typeDocuments),
        new Claim("Documents", documents),
        new Claim("isAdmin", isAdmin.ToString())
    };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_expirationMinutes),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public ClaimsPrincipal GetClaimsFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            return principal;
        }
        catch
        {
            return null;
        }
    }

}
