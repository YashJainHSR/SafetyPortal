import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';
import { DatabaseService } from '../_services/Database.service';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../shared/modules/alert/services/alert.service';
import { Request } from '@angular/http';
export interface DepartmentList {
  departmentName: string;
  nodal: string;
}
export interface SectionList {
  sectionName: string;
  departmentName: string;
}
export interface AgencyList {
  agencyName: string;
}
export interface AssignToList {
  employeeId: string;
  department: string;
  section: string;
  agency: string;
}
export interface Assign {
  employeeId: string;
  name: string;
}
export interface employeeList {
  employeeId: string;
  name: string;
  area: string;
  email: string;
}
export interface RequestFormat {

  requestNo: string;
  requestDate: string;
  category: string;
  severity: string;
  createdBy: string;
  department: string;
  section: string;
  agency: string;
  description: string;
  observedBy: string;
  shownTo: string;
  assignedTo: number;
  actionToBeTaken: string;
  targetDate: string;
  imageBefore: string;
  status: string;
  actionTaken: string;
  imageAfter: string;
  completionDate: string;
  closingDate: string;
  justificationForClosing: string;
  area: string;
  userFlag: number;
  hodFlag: number;
  nodalFlag: number;
  safetyFlag: number;
  adminFlag: number;
}

@Component({
  selector: 'edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css'],

})

export class EditRequestComponent implements OnInit {
  public imagePath;
  ImageBefore: any ;
  parsed = false;
  currentUser: User;
  submitted = false;
  mailflag = false;
  loading = false;
  ImageAfter: any ;
  fileselected = false;
  fileToUpload: File;
  req: any;
  requestNo: number;

  public employeename: string;
  public DeptList: DepartmentList[] = [];
  public SecList: SectionList[] = [];
  public EmpList: employeeList[] = [];
  public SecListForDept: SectionList[] = [];
  public AgenList: AgencyList[] = [];
  public AssignTo: AssignToList[] = [];
  public AssignToConditional: any;
  public Assign: Assign[] = [];
  error: string;
  completed = false;
  public progress: number;
  public message: string;
  public dept: DepartmentList;

  public nodalselected: string;
  public request: RequestFormat;
  public requestFlag: RequestFormat;
  editForm: FormGroup;
  EcodePattern: string | RegExp;
  public employee: employeeList;
  ext: string;
  public formData = new FormData();
  public formDataMail = new FormData();
  constructor(private alertSerive: AlertService, private toastr: ToastrService, private http: HttpClient, private fb: FormBuilder, private router: Router, private _avRoute: ActivatedRoute, private _databaseService: DatabaseService, private authenticationService: AuthenticationService) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.requestNo = this._avRoute.snapshot.params['id'];

    this.EcodePattern = "^[9]{1}[0]{3}[0-9]{4}$";
    this.editForm = this.fb.group({
      requestNo: [],
      requestDate: [''],
      category: ['', Validators.required],
      severity: ['', Validators.required],
      createdBy: ['', Validators.required],
      department: ['', Validators.required],
      section: ['', Validators.required],
      agency: ['', Validators.required],
      description: [''],
      imageBefore: [''],
      observedBy: ['', Validators.required],
      shownTo: [''],
      assignedTo: ['', Validators.required],
      actionToBeTaken: ['', Validators.required],
      targetDate: ['', Validators.required],
      area: [''],
      status: [''],
      actionTaken: [''],
      completionDate: [''],
      closingDate: [''],
      justificationForClosing: [''],
      userFlag: [0],
      hodFlag: [0],
      nodalFlag: [0],
      safetyFlag: [0],
      adminFlag: [0],
      imageAfter: ['']

    });
    this.UpdateFlag();
    this.getDepartmentList();
    this.getEmployeeList();

  }

  async UpdateFlag() {
    await new Promise(resolve => {
      this._databaseService.getRequestById(this.requestNo).pipe(first()).subscribe(
        data => {
          this.requestFlag = data;
          if (this.currentUser.role == Role.User) {
            this.requestFlag.userFlag = 1;
          }
          else if (this.currentUser.role == Role.HOD) {
            this.requestFlag.hodFlag = 1;
          }
          else if (this.currentUser.role == Role.Nodal) {
            this.requestFlag.nodalFlag = 1;
          }
          //else if (this.currentUser.role == Role.Safety) {
          //  this.requestFlag.safetyFlag = 1;
          //}
          else if (this.currentUser.role == Role.Admin) {
            this.requestFlag.adminFlag = 1;
          }
          resolve()
        });
    }).then(() => {
      this._databaseService.updateRequest(this.requestFlag).pipe(first()).subscribe(
        data => {   }
      );
    })
  }


  getEmployeeList() {
    return this._databaseService.getEmployeeList().pipe(first()).subscribe(
      data => {
        this.EmpList = data;

      }
    )
  }
  async getDepartmentList() {
    await new Promise(resolve => {
      return this._databaseService.getDepartmentList().pipe(first()).subscribe(
        data => {
          this.DeptList = data;
          this.DeptList = this.DeptList.sort(function (a, b) {
            var nameA = a.departmentName.toUpperCase(); // ignore upper and lowercase
            var nameB = b.departmentName.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
          resolve()
        })
    }).then(() => {
      this.getSectionList();
    })
  }
  async getSectionList() {
    await new Promise(resolve => {
      return this._databaseService.getSectionList().pipe(first()).subscribe(
        data => {
          this.SecList = data;
          this.SecList = this.SecList.sort(
            function (a, b) {
              var nameA = a.sectionName.toUpperCase(); // ignore upper and lowercase
              var nameB = b.sectionName.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });
          resolve()
        })
    }).then(() => {
      this.getAgencyList();
    })
  }
  async getAgencyList() {
    await new Promise(resolve => {
      return this._databaseService.getAgencyList().pipe(first()).subscribe(
        data => {
          this.AgenList = data;
          this.AgenList = this.AgenList.sort(
            function (a, b) {
              var nameA = a.agencyName.toUpperCase(); // ignore upper and lowercase
              var nameB = b.agencyName.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });
          resolve()
        })
    }).then(() => {
      this.getAssignToList();
    })
  }
  async getAssignToList() {
    await new Promise(resolve => {
      return this._databaseService.getAssignToList().pipe(first()).subscribe(
        data => {
          this.AssignTo = data;
          resolve()
        })
    }).then(() => {
      this.parseData();
    })
  }
  deptselected() {
    this.dept = this.DeptList.find(el => el.departmentName === this.f.department.value);
    this.nodalselected = this.dept.nodal;
    this.SecListForDept = this.SecList.filter(el => el.departmentName === this.f.department.value);
  }
  deptSecAgenselected() {
    this.AssignToConditional = this.AssignTo.filter(el => el.department === this.f.department.value && el.section === this.f.section.value && el.agency === this.f.agency.value);
    var assigni: Assign;
    var emp: employeeList;
    this.Assign = [];
    for (let i = 0; i < this.AssignToConditional.length; i++) {
      emp = this.EmpList.find(el => el.employeeId == this.AssignToConditional[i].employeeId);
      assigni = {
        employeeId: emp.employeeId,
        name: emp.name
      }
      this.Assign.push(assigni);
    }
    this.Assign = this.Assign.sort(function (a, b) {
      var nameA = a.employeeId; // ignore upper and lowercase
      var nameB = b.employeeId; // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }
  ngOnInit() {
    
    if (this.currentUser.role == Role.User) {
      this.editForm.controls.createdBy.disable();
      this.editForm.controls.department.disable();
      this.editForm.controls.section.disable();
      this.editForm.controls.agency.disable();
      this.editForm.controls.description.disable();
      this.editForm.controls.observedBy.disable();
      this.editForm.controls.shownTo.disable();
      this.editForm.controls.assignedTo.disable();
      this.editForm.controls.targetDate.disable();
      this.editForm.controls.actionToBeTaken.disable();
      this.editForm.controls.closingDate.disable();
      this.editForm.controls.area.disable();
    }
    else if (this.currentUser.role == Role.HOD) {
      this.editForm.controls.createdBy.disable();
      this.editForm.controls.description.disable();
      this.editForm.controls.observedBy.disable();
      this.editForm.controls.shownTo.disable();
      this.editForm.controls.targetDate.disable();
      this.editForm.controls.actionToBeTaken.disable();
      this.editForm.controls.actionTaken.disable();
      this.editForm.controls.completionDate.disable();
      this.editForm.controls.closingDate.disable();
      this.editForm.controls.justificationForClosing.disable();
      this.editForm.controls.area.disable();
    }
    else if (this.currentUser.role == Role.Nodal) {
      this.editForm.controls.createdBy.disable();
      this.editForm.controls.description.disable();
      this.editForm.controls.observedBy.disable();
      this.editForm.controls.shownTo.disable();
      this.editForm.controls.targetDate.disable();
      this.editForm.controls.actionToBeTaken.disable();
      this.editForm.controls.actionTaken.disable();
      this.editForm.controls.completionDate.disable();
      this.editForm.controls.closingDate.disable();
      this.editForm.controls.justificationForClosing.disable();
      this.editForm.controls.area.disable();
    }
    else if (this.currentUser.role == Role.Safety) {
     
      this.editForm.controls.createdBy.disable();
      this.editForm.controls.description.disable();
      this.editForm.controls.observedBy.disable();
      this.editForm.controls.shownTo.disable();
      this.editForm.controls.actionTaken.disable();
      this.editForm.controls.completionDate.disable();
      this.editForm.controls.closingDate.disable();
    }
    else if (this.currentUser.role == Role.Admin) {
      this.editForm.controls.createdBy.disable();
      this.editForm.controls.description.disable();
      this.editForm.controls.observedBy.disable();
      this.editForm.controls.shownTo.disable();
      this.editForm.controls.actionTaken.disable();
      this.editForm.controls.completionDate.disable();
      this.editForm.controls.closingDate.disable();
    }
  }
  async parseData() {
    await new Promise(resolve => {
      return this._databaseService.getRequestById(this.requestNo).pipe(first()).subscribe(
        data => {
          this.request = data;
          if (this.request.assignedTo.toString() != this.currentUser.username && this.currentUser.role == Role.User) {
            this.router.navigate(['/']);
          }
          this.editForm.controls.department.setValue(this.request.department);
          this.deptselected();
          this.editForm.controls.section.setValue(this.request.section);
          this.editForm.controls.agency.setValue(this.request.agency);
          this.deptSecAgenselected();


          //this.editForm.controls.createdBy.setValue(this.currentUser.id);
          //this.editForm.controls.agency.setValue(this.request.agency);
          //this.editForm.controls.description.setValue(this.request.description);

          resolve()
        })
    }).then(() => {
      this.editForm.patchValue(this.request);
      this.parsed = true;
      if (this.f.imageBefore.value == "") {
        this.ImageBefore = "/assets/preview.jpg";
      }
      else {
        this.ImageBefore = "/assets/Request_Image_Uploads/" + this.requestNo + "_beforeImage." + this.request.imageBefore;
      }
      if (this.f.imageAfter.value == "") {
        this.ImageAfter = "/assets/preview.jpg";
      }
      else {
        this.ImageAfter = "/assets/Request_Image_Uploads/" + this.requestNo + "_afterImage." + this.request.imageAfter;
      }
      if (this.f.status.value == "Completed") {
        this.editForm.disable();
        this.completed = true;
      }
    })
  }
  getEmployee() {
    this.employee = this.EmpList.find(el => el.employeeId == this.f.createdBy.value);
    if (this.employee == undefined) {
      this.employeename = "Invalid Employee Id";
    }
    else {
      this.employeename = this.employee.name;

    }
  }
  get f() { return this.editForm.controls; }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  onBack() {
    this.router.navigate(['/']);
  }
  setmailflag() {
    this.mailflag = true;
  }
  mail() {
    var assigned = (this.f.assignedTo.value).toString();
    var assignedTomail = this.EmpList.find(el => el.employeeId == assigned).email;
    var name = this.EmpList.find(el => el.employeeId == assigned).name;
    console.log(assignedTomail);
    this.formDataMail.append("emailid", assignedTomail);
    this.formDataMail.append("subject", "Safety Portal: New Request #" + this.request.requestNo + " Assigned");
    this.formDataMail.append("body", "<b>Greetings for the day...!</b><br/><br/>Dear " + name + ", <br/><b><emp>Request #" + this.request.requestNo + "<emp></b> has been assigned to you.<br/ >Kindly check the same by following this link: <b><u>(" + location.origin + "/editrequest/" + this.request.requestNo + ")</u></b><br/><br/>Regards <br/>Safety Portal Team <br/> <br/><i>* This is an Autogenerated Mail.Please don't reply.*</i>");
    const mailinfo = new HttpRequest('POST', `api/Mail/Send`, this.formDataMail);
    this.http.request(mailinfo).subscribe(() => { });
  }
  onSubmit() {
    if (this.currentUser.role == Role.Safety) {
      this.requestFlag.safetyFlag = 1;
    }
    if (this.f.imageAfter.value != "" || this.f.actionTaken.value != "" || this.f.completionDate.value!="") {
      this.editForm.controls.actionTaken.setValidators(Validators.required);
      this.editForm.controls.completionDate.setValidators(Validators.required);
    }
    this.editForm.controls.actionTaken.updateValueAndValidity();
    this.editForm.controls.completionDate.updateValueAndValidity();
    // stop here if form is invalid
    if (this.editForm.invalid) {
      return;
    }
    {
      this.editForm.enable();
      this.submitted = true;
      this.loading = true;
      console.log("1");

      if (this.f.actionTaken.value != "") {
        this.editForm.controls.closingDate.patchValue(moment().format("DD-MM-YYYY, hh:mm:ss"));
        this.editForm.controls.status.patchValue("Completed");
      }
      var edit: RequestFormat = this.editForm.value;
      this._databaseService.updateRequest(edit).pipe(first()).subscribe(
        data => {
          this.req = data;
          if (this.fileselected) {
            var message = "Request Saved \n Please Wait - Image is being Uploaded.";
          }
          else {
            var message = "Request Saved";
          }
          this.toastr.success(message, "Task Completed!", {
            timeOut: 2000000
          });
          this.formData.append("iname", this.request.requestNo + "_afterImage");
          this.editForm.disable();
          if (this.fileselected) {
            const uploadReq = new HttpRequest('POST', `api/upload`, this.formData);
            this.http.request(uploadReq).subscribe(event => {
              if (event.type === HttpEventType.UploadProgress)
                this.progress = Math.round(100 * event.loaded / event.total);
              else if (event.type === HttpEventType.Response)
                this.message = event.body.toString();
            });
          }
          //else {
          //  this.delay(5000).then(() => location.reload());
          //}
          this.router.navigate(['/']);

          if (this.mailflag) {
            this.mail();
          }
          this.loading = false;
          message = "";
          this.alertSerive.create(
            "Request Saved", //title
            "success", //type
            2000000, // time
            message //body

          );
        }
      );
    }

  }


  preview(files) {
    if (files.length === 0)
      return;


    if (files.length > 0) {
      let file: File = files[0];

      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
      }
      this.ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      this.editForm.controls.imageAfter.patchValue(this.ext);
      this.fileToUpload = file;

      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.ImageAfter = reader.result;


        for (let file of files)
          this.formData.append(file.name, file);
        this.fileselected = true;
      }
    }
  }

}
