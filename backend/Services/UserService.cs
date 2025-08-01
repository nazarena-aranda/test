using System;
using System.Threading.Tasks;
using System.Net.Http;
using APIt.Resources.Models;
using System.Text.Json;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using APIt.Agent;

namespace APIt.Services
{
    public class UserService : IUserService
    {
        private readonly IAccessAgent _accessAgent;
        private readonly IMongoCollection<User> _usersCollection;

        public UserService(IAccessAgent accessAgent, IMongoClient mongoClient, IConfiguration configuration)
        {
            _accessAgent = accessAgent;

            var databaseName = configuration["MongoDB:DatabaseName"];
            var usersCollectionName = configuration["MongoDB:UsersCollectionName"];

            if (string.IsNullOrEmpty(databaseName) || string.IsNullOrEmpty(usersCollectionName))
            {
                throw new InvalidOperationException("MongoDB:DatabaseName o MongoDB:UsersCollectionName no pueden ser nulos o vacíos en la configuración.");
            }

            var database = mongoClient.GetDatabase(databaseName);
            _usersCollection = database.GetCollection<User>(usersCollectionName);
        }

        public async Task<User> CreateUserAsync(string tipoDoc, string valorDoc, string password)
        {
            try
            {
                var existingUser = await GetUserByDocumentAsync(tipoDoc, valorDoc);
                if (existingUser != null)
                {
                    throw new InvalidOperationException("User already exists.");
                }

                var resultado = await _accessAgent.GenerateAccessAsync(tipoDoc, valorDoc, password);
                string? extractedPersonId = null;

                using JsonDocument doc = JsonDocument.Parse(resultado);
                JsonElement root = doc.RootElement;

                if (root.TryGetProperty("personIds", out JsonElement personIdsElement) && personIdsElement.ValueKind == JsonValueKind.String)
                {
                    extractedPersonId = personIdsElement.GetString();
                    var regUser = new User(extractedPersonId, tipoDoc, valorDoc, null);
                    await _usersCollection.InsertOneAsync(regUser);
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
                throw new ApplicationException($"{ex.Message}", ex);
            }
        }

        public async Task<User?> GetUserByDocumentAsync(string tipoDoc, string valorDoc)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.TypeDocuments, tipoDoc) &
                             Builders<User>.Filter.Eq(u => u.Documents, valorDoc);

                return await _usersCollection.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new ApplicationException("An error occurred searching for the user.", ex);
            }
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(u => u.TypeDocuments, user.TypeDocuments) &
                             Builders<User>.Filter.Eq(u => u.Documents, user.Documents);

                var result = await _usersCollection.ReplaceOneAsync(filter, user);
                return result.IsAcknowledged && result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new ApplicationException("Update failed.", ex);
            }
        }

public async Task<string?> FindUserByFaceAsync(float[] faceVector, float threshold = 0.65f)
{
    var pipeline = new[]
    {
        new BsonDocument("$vectorSearch", new BsonDocument
        {
            { "index", "user_biometric_index" },
            { "queryVector", new BsonArray(faceVector) },
            { "path", "user_biometric" },
            { "numCandidates", 100 },
            { "limit", 5 }
        }),
        new BsonDocument("$project", new BsonDocument
        {
            { "user_id", 1 },
            { "score", new BsonDocument("$meta", "vectorSearchScore") }
        })
    };

    var result = await _usersCollection.Aggregate<BsonDocument>(pipeline).ToListAsync();

    if (result.Count == 0)
    {
        Console.WriteLine("❌ No similar face found.");
        return null;
    }

    Console.WriteLine("🕵️‍♂️ Similarity results:");
    string? bestMatchId = null;
    double bestMatchScore = threshold;

    foreach (var doc in result)
    {
        string userId = doc.GetValue("user_id", new BsonString("Unknown")).AsString;
        double score = doc.GetValue("score", new BsonDouble(0)).ToDouble();

        Console.WriteLine($"-> User: {userId}, Similarity: {score:P2}");

        if (score >= threshold && score > bestMatchScore)
        {
            bestMatchScore = score;
            bestMatchId = userId;
        }
    }

    if (bestMatchId == null)
        Console.WriteLine("❌ No face passed the similarity threshold.");
    else
        Console.WriteLine($"✅ Best match: {bestMatchId} with similarity {bestMatchScore:P2}");

    return bestMatchId;
}


    }
}
