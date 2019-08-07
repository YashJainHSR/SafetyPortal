using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class UserInfo
    {
        public int UserId { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string Email { get; set; }
        public string Hod { get; set; }
        public string Intercom { get; set; }
        public string Mobile { get; set; }
        public string Nodal { get; set; }
        public string Area { get; set; }
    }
}
