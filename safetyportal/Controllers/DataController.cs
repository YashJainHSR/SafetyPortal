using System.Net.Http;
using System.Web;
using System.Configuration;
using System.Web.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net.Mail;
using safetyportal.Models;
using Microsoft.AspNetCore.Mvc;
namespace safetyportal.Controllers
{
    public class DataController : Controller
    {
        DataAccessLayer objdata = new DataAccessLayer();

        //Mailing
        [HttpPost]
        [Route("api/Mail/Send")]
        public void SendMail()
        {
            var emailid = Request.Form["emailid"];
            var subject = Request.Form["subject"];
            var body = Request.Form["body"];
            MailMessage mail = new MailMessage();
            mail.Subject = subject;
            mail.From = new MailAddress("safetyportal@jshl.in");
            mail.To.Add(emailid);
            mail.Body = body;
            mail.IsBodyHtml = true;
            
            SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
            smtp.EnableSsl = true;
            smtp.Credentials = new System.Net.NetworkCredential("safetyportal@jshl.in", "power@123");

            try
            {
                smtp.Send(mail);
            }
            catch (Exception ex)
            {
                Console.WriteLine("{0} Exception caught.", ex);
            }
        }

        //Credential Table
        [HttpGet]
        [Route("api/Credential/All")]
        public IEnumerable<LoginCredentials> GetAllCredentials()
        {
            return objdata.GetAllCredentials();
        }

        [HttpPost]
        [Route("api/Credential/Create")]
        public int CreateCredential([FromBody] LoginCredentials Credential)
        {
            return objdata.AddCredential(Credential);
        }

        [HttpGet]
        [Route("api/Credential/Details/{id}")]
        public LoginCredentials DetailsCredential(int id)
        {
            return objdata.GetCredential(id);
        }

        [HttpPut]
        [Route("api/Credential/Edit")]
        public int EditCredential([FromBody]LoginCredentials Credential)
        {
            return objdata.UpdateCredential(Credential);
        }

        [HttpDelete]
        [Route("api/Credential/Delete/{id}")]
        public int DeleteCredential(int id)
        {
            return objdata.DeleteCredential(id);
        }



        //Request Table
        [HttpGet]
        [Route("api/Request/All")]
        public IEnumerable<Requests> GetRequests()
        {
            return objdata.GetAllRequests();
        }

        [HttpPost]
        [Route("api/Request/Create")]
        public int CreateRequests([FromBody] Requests request)
        {
            return objdata.AddRequests(request);
        }

        [HttpGet]
        [Route("api/Request/Details/{requestNo}")]
        public Requests DetailsRequests(int requestNo)
        {
            return objdata.GetRequests(requestNo);
        }

        [HttpPut]
        [Route("api/Request/Edit")]
        public int EditRequests([FromBody]Requests request)
        {
            return objdata.UpdateRequests(request);
        }

        [HttpDelete]
        [Route("api/Request/Delete/{requestNo}")]
        public int DeleteRequests(int requestNo)
        {
            return objdata.DeleteRequests(requestNo);
        }

        //Agency List Table
        [HttpGet]
        [Route("api/Agency/All")]
        public IEnumerable<AgencyList> GetAllAgency()
        {
            return objdata.GetAgencyList();
        }

        [HttpPost]
        [Route("api/Agency/Create")]
        public int CreateAgency([FromBody] AgencyList agency)
        {
            return objdata.AddAgencyList(agency);
        }

        [HttpPut]
        [Route("api/Agency/Edit")]
        public int EditAgency([FromBody]AgencyList agency)
        {
            return objdata.UpdateAgencyList(agency);
        }

        [HttpDelete]
        [Route("api/Agency/Delete/{id}")]
        public int DeleteAgency(int id)
        {
            return objdata.DeleteAgencyList(id);
        }
        
        //AssignTo List Table
        [HttpGet]
        [Route("api/AssignTo/All")]
        public IEnumerable<AssignToList> GetAllAssignToList()
        {
            return objdata.GetAssignToList();
        }

        [HttpPost]
        [Route("api/AssignTo/Create")]
        public int CreateAssignTo([FromBody] AssignToList assignto)
        {
            return objdata.AddAssignToList(assignto);
        }

        [HttpPut]
        [Route("api/AssignTo/Edit")]
        public int EditAssignTo([FromBody]AssignToList assignto)
        {
            return objdata.UpdateAssignToList(assignto);
        }

        [HttpDelete]
        [Route("api/AssignTo/Delete/{id}")]
        public int DeleteAssignTo(int id)
        {
            return objdata.DeleteAssignToList(id);
        }

        //Department List Table
        [HttpGet]
        [Route("api/Department/All")]
        public IEnumerable<DepartmentList> GetAllDepartmentList()
        {
            return objdata.GetDepartmentList();
        }

        [HttpPost]
        [Route("api/Department/Create")]
        public int CreateDepartment([FromBody] DepartmentList department)
        {
            return objdata.AddDepartmentList(department);
        }

        [HttpPut]
        [Route("api/Department/Edit")]
        public int EditDepartment([FromBody]DepartmentList department)
        {
            return objdata.UpdateDepartmentList(department);
        }

        [HttpDelete]
        [Route("api/Department/Delete/{id}")]
        public int DeleteDepartment(int id)
        {
            return objdata.DeleteDepartmentList(id);
        }

        //EmployeeList Table
        [HttpGet]
        [Route("api/Employee/All")]
        public IEnumerable<EmployeeList> GetAllEmployeeList()
        {
            return objdata.GetEmployeeList();
        }

        [HttpGet]
        [Route("api/Employee/Details/{employeeid}")]
        public EmployeeList DetailsEmployee(int employeeid)
        {
            return objdata.GetEmployee(employeeid);
        }

        [HttpPost]
        [Route("api/Employee/Create")]
        public int CreateEmployee([FromBody] EmployeeList employee)
        {
            return objdata.AddEmployeeList(employee);
        }

        [HttpPut]
        [Route("api/Employee/Edit")]
        public int EditEmployee([FromBody]EmployeeList employee)
        {
            return objdata.UpdateEmployeeList(employee);
        }

        [HttpDelete]
        [Route("api/Employee/Delete/{id}")]
        public int DeleteEmployee(int id)
        {
            return objdata.DeleteEmployeeList(id);
        }

        //HodList Table
        [HttpGet]
        [Route("api/HOD/All")]
        public IEnumerable<HodList> GetAllHodList()
        {
            return objdata.GetHodList();
        }

        [HttpPost]
        [Route("api/HOD/Create")]
        public int CreateHod([FromBody] HodList hod)
        {
            return objdata.AddHodList(hod);
        }

        [HttpPut]
        [Route("api/HOD/Edit")]
        public int EditHod([FromBody]HodList hod)
        {
            return objdata.UpdateHodList(hod);
        }

        [HttpDelete]
        [Route("api/HOD/Delete/{id}")]
        public int DeleteHod(int id)
        {
            return objdata.DeleteHodList(id);
        }
        
        //NodalList Table
        [HttpGet]
        [Route("api/Nodal/All")]
        public IEnumerable<NodalList> GetAllNodalList()
        {
            return objdata.GetNodalList();
        }

        [HttpPost]
        [Route("api/Nodal/Create")]
        public int CreateNodal([FromBody] NodalList nodal)
        {
            return objdata.AddNodalList(nodal);
        }

        [HttpPut]
        [Route("api/Nodal/Edit")]
        public int EditNodal([FromBody]NodalList nodal)
        {
            return objdata.UpdateNodalList(nodal);
        }

        [HttpDelete]
        [Route("api/Nodal/Delete/{id}")]
        public int DeleteNodal(int id)
        {
            return objdata.DeleteNodalList(id);
        }

        //OnlineStatus Table
        [HttpGet]
        [Route("api/Status/All")]
        public IEnumerable<OnlineStatus> GetAllOnlineStatus()
        {
            return objdata.GetOnlineStatus();
        }

        [HttpPost]
        [Route("api/Status/Create")]
        public int CreateStatus([FromBody] OnlineStatus status)
        {
            return objdata.AddOnlineStatus(status);
        }

        [HttpPut]
        [Route("api/Status/Edit")]
        public int EditStatus([FromBody]OnlineStatus status)
        {
            return objdata.UpdateOnlineStatus(status);
        }

        //SectionList Table
        [HttpGet]
        [Route("api/Section/All")]
        public IEnumerable<SectionList> GetAllSectionList()
        {
            return objdata.GetSectionList();
        }

        [HttpPost]
        [Route("api/Section/Create")]
        public int CreateSection([FromBody] SectionList section)
        {
            return objdata.AddSectionList(section);
        }

        [HttpPut]
        [Route("api/Section/Edit")]
        public int EditSection([FromBody]SectionList section)
        {
            return objdata.UpdateSectionList(section);
        }

        [HttpDelete]
        [Route("api/Section/Delete/{id}")]
        public int DeleteSection(int id)
        {
            return objdata.DeleteSectionList(id);
        }
        
        //UserInfo Table
        [HttpGet]
        [Route("api/User/All")]
        public IEnumerable<UserInfo> GetAllUserInfo()
        {
            return objdata.GetUserInfo();
        }

        [HttpPost]
        [Route("api/User/Create")]
        public int CreateUser([FromBody] UserInfo user)
        {
            return objdata.AddUserInfo(user);
        }

        [HttpPut]
        [Route("api/User/Edit")]
        public int EditUser([FromBody]UserInfo user)
        {
            return objdata.UpdateUserInfo(user);
        }

        [HttpDelete]
        [Route("api/User/Delete/{id}")]
        public int DeleteUser(int id)
        {
            return objdata.DeleteUserInfo(id);
        }



    }
}
