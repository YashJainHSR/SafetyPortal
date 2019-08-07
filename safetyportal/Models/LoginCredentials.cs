using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class LoginCredentials
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
    }
}
