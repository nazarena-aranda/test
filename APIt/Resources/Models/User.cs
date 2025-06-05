#nullable enable
using System;

namespace APIt.Resources.Models
{
    public class User
    {
        public string[]? User_Id { get; set; }
        public string TypeDocuments { get; set; }
        public string Documents { get; set; }
        public string[]? UserBiometric { get; set; }

        public int FailedAttempts { get; set; }
        public int SuccessfulAttempts { get; set; }

        public User(string[]? userId, string typeDocuments, string documents, string[]? userBiometric = null)
        {
            User_Id = userId;
            TypeDocuments = typeDocuments;
            Documents = documents;
            UserBiometric = userBiometric;
            FailedAttempts = 0;
            SuccessfulAttempts = 0;
        }
    }
}
