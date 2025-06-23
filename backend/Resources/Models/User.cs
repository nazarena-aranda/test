#nullable enable
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace APIt.Resources.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? User_Id { get; set; }

        public string TypeDocuments { get; set; }

        public string Documents { get; set; }

        public float[]? UserBiometric { get; set; }

        // Constructor usado al crear usuario (sin biometría)
        public User(string? userId, string typeDocuments, string documents)
        {
            User_Id = userId;
            TypeDocuments = typeDocuments;
            Documents = documents;
        }

        // Constructor con biometría
        public User(string? userId, string typeDocuments, string documents, float[]? userBiometric)
        {
            User_Id = userId;
            TypeDocuments = typeDocuments;
            Documents = documents;
            UserBiometric = userBiometric;
        }
    }
}
