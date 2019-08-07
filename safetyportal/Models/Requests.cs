using System;
using System.Collections.Generic;

namespace safetyportal.Models
{
    public partial class Requests
    {
        public int RequestNo { get; set; }
        public string RequestDate { get; set; }
        public string Category { get; set; }
        public string Severity { get; set; }
        public string CreatedBy { get; set; }
        public string Department { get; set; }
        public string Section { get; set; }
        public string Agency { get; set; }
        public string Description { get; set; }
        public string ObservedBy { get; set; }
        public string ShownTo { get; set; }
        public long? AssignedTo { get; set; }
        public string ActionToBeTaken { get; set; }
        public string TargetDate { get; set; }
        public string ImageBefore { get; set; }
        public string Status { get; set; }
        public string ActionTaken { get; set; }
        public string ImageAfter { get; set; }
        public string CompletionDate { get; set; }
        public string ClosingDate { get; set; }
        public string JustificationForClosing { get; set; }
        public string Area { get; set; }
        public int? UserFlag { get; set; }
        public int? HodFlag { get; set; }
        public int? NodalFlag { get; set; }
        public int? SafetyFlag { get; set; }
        public int? AdminFlag { get; set; }
    }
}
