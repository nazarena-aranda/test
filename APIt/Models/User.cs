#nullable enable
using System;

namespace APIt.Models
{
    public class User
    {
        public Guid id { get; set; } = Guid.NewGuid();
        public string[]? UserBiometric { get; set; }

        public User(string[]? userBiometric)
        {
            UserBiometric = userBiometric;
        }
    }
}
