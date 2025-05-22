#nullable enable
using System;

namespace APIt.Models
{
    public class User
    {
        public string[]? User_Id { get; set; }
        public string? TypeDocuments { get; set; }
        public string? Documents { get; set; }
        public string[]? UserBiometric { get; set; }

        public User(string[]? userId, string? typeDocuments, string? documents, string[]? userBiometric)
        {
            User_Id = userId;
            TypeDocuments = typeDocuments;
            Documents = documents;
            UserBiometric = userBiometric;
        }
    }
}
