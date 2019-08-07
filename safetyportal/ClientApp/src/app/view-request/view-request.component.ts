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
  selector: 'view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css'],

})

export class ViewRequestComponent implements OnInit {
  ImageBefore: any ;
  submitted = false;
  ImageAfter: any ;
  public createdByName: string;
  public observedByName: string;
  public assignedToName: string;

  public EmpList: employeeList[] = [];
  error: string;
  public request: RequestFormat;
  view: FormGroup;
  public employee: employeeList;
  constructor(private fb: FormBuilder, private router: Router,private _databaseService: DatabaseService) {
    
  }

  getEmployeeList() {
    return this._databaseService.getEmployeeList().pipe(first()).subscribe(
      data => {
        this.EmpList = data;

      }
    )
  }
  
 
  ngOnInit() {
    this.submitted = false;

    this.ImageBefore = "/assets/preview.jpg";
    this.ImageAfter = "/assets/preview.jpg";
    this.view = this.fb.group({
      requestNo: ['', Validators.required],
    });
    this.getEmployeeList();
  }
  async getRequest() {
    await new Promise(resolve => {
      return this._databaseService.getRequestById(this.f.requestNo.value).pipe(first()).subscribe(
        data => {
          if (data == null) {
            this.error = "Wrong Request Number";
          }
          else {
            this.request = data;
          }
          resolve()
        })
    }).then(() => {
      if (this.request) {
        if (this.request.imageBefore != "") {

          this.ImageBefore = "/assets/Request_Image_Uploads/" + this.request.requestNo + "_beforeImage." + this.request.imageBefore;
        }
        if (this.request.imageAfter != "") {
          this.ImageAfter = "/assets/Request_Image_Uploads/" + this.request.requestNo + "_afterImage." + this.request.imageAfter;
        }
        this.createdByName = this.getEmployee(this.request.createdBy);
        this.assignedToName = this.getEmployee(this.request.assignedTo);
        this.observedByName = this.getEmployee(this.request.observedBy);
      }
    });
  }
  public getEmployee(id: any) {
    this.employee = this.EmpList.find(el => el.employeeId == id.toString());
    return this.employee.name;
  }

  get f() { return this.view.controls; }
 
  onBack() {
    this.router.navigate(['/']);
  }
 
  onSubmit() {
    this.error = "";
    if (this.view.invalid) {
      this.error = "Please Enter Request Number";
      return;
    }
    this.submitted = true;
    this.getRequest();
  }


  

}
