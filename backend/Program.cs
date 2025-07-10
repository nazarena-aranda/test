using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;
using APIt.Services;
using MongoDB.Driver;
using APIt.Resources.Models;
using Microsoft.AspNetCore.Hosting;


using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

var builder = WebApplication.CreateBuilder(args);

var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtSettings:SecretKey"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Change to true when HTTPS
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

var mongoDbConnectionString = builder.Configuration.GetConnectionString("MongoDB");
if (string.IsNullOrEmpty(mongoDbConnectionString))
{
    throw new InvalidOperationException("MongoDB connection string is not configured in appsettings.json or environment variables.");
}

builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoDbConnectionString));
builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var database = client.GetDatabase("DoorSystemDatabase");
    return database.GetCollection<User>("Users");
});

builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var database = client.GetDatabase("DoorSystemDatabase");
    return database.GetCollection<Door>("Doors");  // Colección Doors para Door
});




builder.Services.AddControllers();
builder.Services.AddScoped<TokenService>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter the JWT token:"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });


    c.SupportNonNullableReferenceTypes();
    c.OperationFilter<FileUploadOperationFilter>();

});
builder.Services.AddHttpClient<IAccessAgent, InternalAccessAgent>();


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDoorService, DoorService>();

MongoConventions.RegisterConventions();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "V1");
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
