using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class AssignToList
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; }
        public string Department { get; set; }
        public string Section { get; set; }
        public string Agency { get; set; }
    }
}
