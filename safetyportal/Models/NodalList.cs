using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class NodalList
    {
        public int Id { get; set; }
        public string NodalId { get; set; }
        public string NodalName { get; set; }
        public string Email { get; set; }
    }
}
