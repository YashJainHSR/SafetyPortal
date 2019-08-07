using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace safetyportal.Models
{
    public class DataAccessLayer
    {
        EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext db = new EJSHLSAFETYPORTALNEWSAFETYPORTALSAFETYPORTALDBMDFContext();

        //LoginCredential Table
        public IEnumerable<LoginCredentials> GetAllCredentials()
        {
            return db.LoginCredentials.ToList();

        }


        //To Add new Request LoginCredentials   
        public int AddCredential(LoginCredentials credential)
        {

            db.LoginCredentials.Add(credential);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar LoginCredentials  
        public int UpdateCredential(LoginCredentials credential)
        {
            db.Entry(credential).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //Get the details of a particular LoginCredentials  
        public LoginCredentials GetCredential(int id)
        {

            LoginCredentials credential = db.LoginCredentials.Find(id);
            return credential;

        }

        //To Delete the record of a particular LoginCredentials  
        public int DeleteCredential(int id)
        {

            LoginCredentials credential = db.LoginCredentials.Find(id);
            db.LoginCredentials.Remove(credential);
            db.SaveChanges();
            return 1;

        }

        //Request Table
        public IEnumerable<Requests> GetAllRequests()
        {
            return db.Requests.ToList();

        }


        //To Add new Request record   
        public int AddRequests(Requests request)
        {

            db.Requests.Add(request);
            db.SaveChanges();
            return request.RequestNo;

        }

        //To Update the records of a particluar Request  
        public int UpdateRequests(Requests request)
        {
            db.Entry(request).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //Get the details of a particular Request  
        public Requests GetRequests(int requestNo)
        {

            Requests request = db.Requests.Find(requestNo);
            return request;

        }

        //To Delete the record of a particular Request  
        public int DeleteRequests(int requestNo)
        {

            Requests request = db.Requests.Find(requestNo);
            db.Requests.Remove(request);
            db.SaveChanges();
            return 1;

        }

        //Agency List Table
        public IEnumerable<AgencyList> GetAgencyList()
        {

            return db.AgencyList.ToList();

        }


        //To Add new AgencyList record   
        public int AddAgencyList(AgencyList agency)
        {

            db.AgencyList.Add(agency);
            db.SaveChanges();
            return 1;
        }

        //To Update the records of a particluar AgencyList  
        public int UpdateAgencyList(AgencyList agency)
        {
            db.Entry(agency).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular AgencyList  
        public int DeleteAgencyList(int id)
        {
            AgencyList agency = db.AgencyList.Find(id);
            db.AgencyList.Remove(agency);
            db.SaveChanges();
            return 1;

        }


        //Assign To List Table
        public IEnumerable<AssignToList> GetAssignToList()
        {
            return db.AssignToList.ToList();

        }


        //To Add new AssignToList record   
        public int AddAssignToList(AssignToList assign)
        {

            db.AssignToList.Add(assign);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar AssignToList  
        public int UpdateAssignToList(AssignToList assign)
        {

            db.Entry(assign).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular AssignToList  
        public int DeleteAssignToList(int id)
        {

            AssignToList assign = db.AssignToList.Find(id);
            db.AssignToList.Remove(assign);
            db.SaveChanges();
            return 1;

        }

        //DepartmentList Table
        public IEnumerable<DepartmentList> GetDepartmentList()
        {

            return db.DepartmentList.ToList();

        }


        //To Add new DepartmentList record   
        public int AddDepartmentList(DepartmentList department)
        {

            db.DepartmentList.Add(department);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar DepartmentList  
        public int UpdateDepartmentList(DepartmentList department)
        {

            db.Entry(department).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular DepartmentList  
        public int DeleteDepartmentList(int id)
        {

            DepartmentList department = db.DepartmentList.Find(id);
            db.DepartmentList.Remove(department);
            db.SaveChanges();
            return 1;

        }

        //EmployeeList Table
        public IEnumerable<EmployeeList> GetEmployeeList()
        {

            return db.EmployeeList.ToList();

        }

        //Get the details of a particular Request  
        public EmployeeList GetEmployee(int employeeId)
        {

            EmployeeList employee = db.EmployeeList.Find(employeeId);
            return employee;

        }

        //To Add new EmployeeList record   
        public int AddEmployeeList(EmployeeList employee)
        {

            db.EmployeeList.Add(employee);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar EmployeeList  
        public int UpdateEmployeeList(EmployeeList employee)
        {

            db.Entry(employee).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular EmployeeList  
        public int DeleteEmployeeList(int id)
        {

            EmployeeList employee = db.EmployeeList.Find(id);
            db.EmployeeList.Remove(employee);
            db.SaveChanges();
            return 1;

        }
        //HodList Table
        public IEnumerable<HodList> GetHodList()
        {

            return db.HodList.ToList();

        }


        //To Add new HodList record   
        public int AddHodList(HodList hod)
        {

            db.HodList.Add(hod);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar HodList  
        public int UpdateHodList(HodList hod)
        {

            db.Entry(hod).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular HodList  
        public int DeleteHodList(int id)
        {

            HodList hod = db.HodList.Find(id);
            db.HodList.Remove(hod);
            db.SaveChanges();
            return 1;

        }
        //NodalList Table
        public IEnumerable<NodalList> GetNodalList()
        {

            return db.NodalList.ToList();

        }

        //Get the details of a particular Nodal  
        public NodalList GetNodal(int nodalId)
        {

            NodalList nodal = db.NodalList.Find(nodalId);
            return nodal;

        }

        //To Add new NodalList record   
        public int AddNodalList(NodalList nodal)
        {

            db.NodalList.Add(nodal);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar NodalList  
        public int UpdateNodalList(NodalList nodal)
        {

            db.Entry(nodal).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular NodalList  
        public int DeleteNodalList(int id)
        {

            NodalList nodal = db.NodalList.Find(id);
            db.NodalList.Remove(nodal);
            db.SaveChanges();
            return 1;

        }

        //OnlineStatus Table
        public IEnumerable<OnlineStatus> GetOnlineStatus()
        {

            return db.OnlineStatus.ToList();

        }


        //To Add new OnlineStatus record   
        public int AddOnlineStatus(OnlineStatus status)
        {

            db.OnlineStatus.Add(status);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar OnlineStatus  
        public int UpdateOnlineStatus(OnlineStatus status)
        {

            db.Entry(status).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //SectionList Table
        public IEnumerable<SectionList> GetSectionList()
        {

            return db.SectionList.ToList();

        }


        //To Add new SectionList record   
        public int AddSectionList(SectionList section)
        {

            db.SectionList.Add(section);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar SectionList  
        public int UpdateSectionList(SectionList section)
        {

            db.Entry(section).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular SectionList  
        public int DeleteSectionList(int id)
        {

            SectionList section = db.SectionList.Find(id);
            db.SectionList.Remove(section);
            db.SaveChanges();
            return 1;

        }
        //UserInfo Table
        public IEnumerable<UserInfo> GetUserInfo()
        {

            return db.UserInfo.ToList();

        }


        //To Add new UserInfo record   
        public int AddUserInfo(UserInfo user)
        {

            db.UserInfo.Add(user);
            db.SaveChanges();
            return 1;

        }

        //To Update the records of a particluar UserInfo  
        public int UpdateUserInfo(UserInfo user)
        {

            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();

            return 1;

        }

        //To Delete the record of a particular UserInfo  
        public int DeleteUserInfo(int id)
        {

            UserInfo user = db.UserInfo.Find(id);
            db.UserInfo.Remove(user);
            db.SaveChanges();
            return 1;

        }

    }
}
