using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class EmployeeList
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Department { get; set; }
        public string Phone { get; set; }
        public string Intercom { get; set; }
        public string Area { get; set; }
    }
}
