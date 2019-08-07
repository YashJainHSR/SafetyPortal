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
import { Subscription } from 'rxjs';


export interface DepartmentList {
  departmentName: string;
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


@Component({
  selector: 'app-submit-request',
  templateUrl: './submitrequest.component.html',
  styleUrls: ['./submitrequest.component.css'],

})

export class SubmitRequestComponent implements OnInit {
  public formData = new FormData();
  public formDataMail = new FormData();
  public imagePath;
  area: string;
  currentUser: User;
  submitted = false;
  loading = false;
  imgURL: any = "/assets/preview.jpg";
  fileselected = false;
  fileToUpload: File;
  req: any;
  ext: string;
  public cuser = false;
  public employeename: string;
  public s1: Subscription;
  public s2: Subscription;
  public s3: Subscription;
  public s4: Subscription;
  public s5: Subscription;
  public s6: Subscription;
  public s7: Subscription;
  public s8: Subscription;
  public DeptList: DepartmentList[] = [];
  public SecList: SectionList[] = [];
  public EmpList: employeeList[] = [];
  public SecListForDept: SectionList[] = [];
  public AgenList: AgencyList[] = [];
  public AssignTo: AssignToList[] = [];
  public AssignToConditional: any;
  public Assign: Assign[] = [];
  error: string;
  public progress: number;
  public message: string;
  submitForm: FormGroup;
  EcodePattern: string | RegExp;
  public employee: employeeList;
  constructor(private alertSerive: AlertService, private toastr: ToastrService, private http: HttpClient, private fb: FormBuilder, private router: Router, private _avRoute: ActivatedRoute, private _databaseService: DatabaseService, private authenticationService: AuthenticationService) {
    if (this._avRoute.snapshot.params["area"]) {
      this.area = this._avRoute.snapshot.params['area'];
    }
    else {
      this.s1 = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    this.getDepartmentList();
    this.getSectionList();
    this.getAgencyList();
    this.getAssignToList();
    this.getEmployeeList();
  }
  getEmployeeList() {
   this.s2 = this._databaseService.getEmployeeList().pipe(first()).subscribe(
      data => {
        this.EmpList = data;
        this.EmpList = this.EmpList.sort(function (a, b) {
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
        if (this.currentUser != null) {
          this.getEmployee();
        }
        

      }
    )
  }
  getDepartmentList() {
   this.s3 = this._databaseService.getDepartmentList().pipe(first()).subscribe(
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
      }
    )
  }
  getSectionList() {
   this.s4 = this._databaseService.getSectionList().pipe(first()).subscribe(
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

      }
    )
  }
  getAgencyList() {
   this.s5 = this._databaseService.getAgencyList().pipe(first()).subscribe(
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
      }
    )
  }
  getAssignToList() {
    this.s6 = this._databaseService.getAssignToList().pipe(first()).subscribe(
      data => {
        this.AssignTo = data;
      }
    )
  }
  deptselected() {
    this.SecListForDept = this.SecList.filter(el => el.departmentName === this.f.department.value);
  }
  deptSecAgenselected() {
    this.AssignToConditional = this.AssignTo.filter(el => el.department === this.f.department.value && el.section === this.f.section.value && el.agency === this.f.agency.value);
    this.AssignToConditional = this.AssignToConditional.sort();
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
    //private Preview = require("./preview.jpg");
   
    this.submitForm = this.fb.group({
      requestDate: [''],
      category: ['', Validators.required],
      severity: ['', Validators.required],
      createdBy: ['', Validators.required],
      department: ['', Validators.required],
      section: ['', Validators.required],
      agency: ['', Validators.required],
      description: ['', Validators.required],
      imageBefore: [''],
      observedBy: ['', Validators.required],
      shownTo: [''],
      assignedTo: ['', Validators.required],
      actionToBeTaken: ['', Validators.required],
      targetDate: ['', Validators.required],
      area: [''],
      status: ['Pending'],
      actionTaken: [''],
      imageAfter: [''],
      completionDate: [''],
      closingDate: ['N/A'],
      justificationForClosing: ['N/A'],
      userFlag: [0],
      hodFlag: [0],
      nodalFlag: [0],
      safetyFlag: [0],
      adminFlag: [0]

    });
    if (this.currentUser) {
      this.submitForm.controls.createdBy.patchValue(this.currentUser.username);
      this.cuser = true;
      this.submitForm.controls.createdBy.disable();
    }
  }
  getEmployee() {
    this.employee = this.EmpList.find(el => el.employeeId == this.f.createdBy.value);
    if (this.employee == undefined) {
      this.employeename = "Invalid Employee Id";
      if (this.currentUser.username == "NDO_HR" || this.currentUser.username == "NDO_CR") {
        this.employeename = "Night Duty Officer";
      }
    }
    else {
      this.employeename = this.employee.name;

    }
  }
  get f() { return this.submitForm.controls; }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  onSubmit() {

    // stop here if form is invalid
    if (this.submitForm.invalid) {
      return;
    }
    {
      this.submitForm.controls.createdBy.enable();
      this.submitted = true;
      this.loading = true;
      this.submitForm.controls.requestDate.patchValue(moment().format("DD-MM-YYYY, hh:mm:ss"));
      if (this.currentUser!=null) {
        if (this.currentUser.username == "NDO_HR") {
          this.submitForm.controls.area.patchValue("HR");
        }
        else if (this.currentUser.username == "NDO_CR") {
          this.submitForm.controls.area.patchValue("CR");
        }
        else {
          this.submitForm.controls.area.patchValue(this.employee.area);
        }
      }
      else {
        this.submitForm.controls.area.patchValue(this.area);
      }
     this.s7 = this._databaseService.saveRequest(this.submitForm.value).pipe(first()).subscribe(
        data => {
          this.req = data;
          if (this.fileselected) {
            var message = "Request Id : " + this.req + "\n Please Wait - Image is being Uploaded.";
          }
          else {
            var message = "Request Id : " + this.req;
          }
          this.mail();
          this.toastr.success(message, "Request Submitted!", {
            timeOut: 8000
          });
          this.formData.append("iname", data + "_beforeImage");
          if (this.fileselected) {
            const uploadReq = new HttpRequest('POST', `api/upload`, this.formData);
            this.s8 = this.http.request(uploadReq).subscribe(event => {
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
          this.loading = false;
          this.alertSerive.create(
            "Request Submitted", //title
            "success", //type
            2000000, // time
            message //body
          );
        }
      );
    }

  }
  mail() {
    var assigned = (this.f.assignedTo.value).toString();
    var assignedTomail = this.EmpList.find(el => el.employeeId == assigned).email;
    var name = this.EmpList.find(el => el.employeeId == assigned).name;
    console.log(assignedTomail);
    this.formDataMail.append("emailid", assignedTomail);
    this.formDataMail.append("subject", "Safety Portal: New Request #" + this.req + " Assigned");
    this.formDataMail.append("body", "<b>Greetings for the day...!</b><br/><br/>Dear " + name + ", <br/><b>Request #" + this.req + " </b> has been assigned to you.<br/ >Kindly check the same by following this link: <b><u>(" + location.origin + "/editrequest/" + this.req + ")</u></b><br/><br/>Regards <br/>Safety Portal Team <br/> <br/><i>* This is an Autogenerated Mail.Please don't reply.*</i>");
    const mailinfo = new HttpRequest('POST', `api/Mail/Send`, this.formDataMail);
    this.http.request(mailinfo).subscribe(() => { });
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
      this.submitForm.controls.imageBefore.patchValue(this.ext);
      this.fileToUpload = file;

      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURL = reader.result;


        for (let file of files)
          this.formData.append("filename", file);
        this.fileselected = true;
      }
    }
  }

}
