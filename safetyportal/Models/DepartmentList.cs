using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class DepartmentList
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; }
        public string Hod { get; set; }
        public string Nodal { get; set; }
    }
}
