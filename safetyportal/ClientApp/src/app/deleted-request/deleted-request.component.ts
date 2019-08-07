import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';
import { DatabaseService } from '../_services/Database.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
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
export interface department {
  departmentName: string;
  hod: string;
  nodal: string;
}


@Component({
  selector: 'deleted-request',
  templateUrl: './deleted-request.component.html',
  styleUrls: ['./deleted-request.component.css'],
})

export class DeletedRequestComponent implements OnInit {
  public s1: Subscription;
  public s2: Subscription;
  public s3: Subscription;
  public s4: Subscription;
  loading: boolean = true;
  currentUser: User;
  public DeletedTable: RequestFormat[] = [];
  public deptList: department[] = [];
  public dept: Array<string> = [];
  dataSource = new MatTableDataSource<RequestFormat>();
  public restorereq: RequestFormat;
  constructor(private router: Router, private _databaseService: DatabaseService, private authenticationService: AuthenticationService) {
    this.s4 = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  displayedColumns = ['requestNo','status', 'severity', 'requestDate', 'department', 'section', 'agency', 'description', 'category', 'targetDate', 'overdueDays', 'del-resorebutton'];
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  calc(date: Date) {
    var today = moment().format("YYYY-MM-DD");
    var now = moment(today);
    var format = moment(date);
    if (moment.duration(now.diff(format)).asDays() > 0) {
      //return moment.duration(moment().diff(moment(date))).asDays();
     return now.to(format,true);
    }
    else {
      return "Not Overdue";
    }
  }
  async getHodData() {
    await new Promise(resolve => {
    this.s1 =  this._databaseService.getDepartmentList().subscribe(data => {
        this.deptList = data;
        this.deptList = this.deptList.filter(el => el.hod === this.currentUser.username);
        for (let i = 0; i < this.deptList.length; i++) {
          let deptfromlist: string = this.deptList[i].departmentName;
          this.dept.push(deptfromlist);
        }
        resolve()
      })
    }).then(() => {
      this.DeletedTable = this.DeletedTable.filter(el => (el.status !== "Pending") && (el.status !== "Completed") && (this.dept.indexOf(el.department) >= 0));
      this.dataSource = new MatTableDataSource<RequestFormat>(this.DeletedTable);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._changePageSize(10000);
      this.loading = false;
    })
  }
  async getNodalData() {
    await new Promise(resolve => {
      this.s2 = this._databaseService.getDepartmentList().subscribe(data => {
        this.deptList = data;
        this.deptList = this.deptList.filter(el => el.nodal === this.currentUser.username);
        for (let i = 0; i < this.deptList.length; i++) {
          let deptfromlist: string = this.deptList[i].departmentName;
          this.dept.push(deptfromlist);
        }
        resolve()
      })
    }).then(() => {
      this.DeletedTable = this.DeletedTable.filter(el => (el.status != "Pending") && (el.status != "Completed") && (this.dept.indexOf(el.department) >= 0));
      this.dataSource = new MatTableDataSource<RequestFormat>(this.DeletedTable);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._changePageSize(10000);
      this.loading = false;
    })
  }
  async getRequests() {
    await new Promise(resolve => {
      this.s3 = this._databaseService.getRequests().subscribe(
        data => {
          this.DeletedTable = data;
          resolve()
        })
    }).then(() => {
      if (this.currentUser.role == Role.User) {
        console.log(this.currentUser.role);
        this.DeletedTable = this.DeletedTable.filter(el => el.assignedTo == parseInt(this.currentUser.username) && (el.status != "Pending") && (el.status != "Completed"));
        console.log(this.DeletedTable);
        this.dataSource = new MatTableDataSource<RequestFormat>(this.DeletedTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._changePageSize(10000);
        this.loading = false;
      }
      else if (this.currentUser.role == Role.Admin) {
        this.DeletedTable = this.DeletedTable.filter(el => (el.status !== "Pending") && (el.status !== "Completed") );
        this.dataSource = new MatTableDataSource<RequestFormat>(this.DeletedTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._changePageSize(10000);

        this.loading = false;
      }
      else if (this.currentUser.role == Role.Safety) {
        this.DeletedTable = this.DeletedTable.filter(el => (el.status != "Pending") && (el.status != "Completed"));
        this.dataSource = new MatTableDataSource<RequestFormat>(this.DeletedTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._changePageSize(10000);
        this.loading = false;
      }
      else if (this.currentUser.role == Role.HOD) {
        this.getHodData();

      }
      else if (this.currentUser.role == Role.Nodal) {
        this.getNodalData();
      }
      
            
        }
    )
  }
  public getRowsValue() {
    return this.DeletedTable.length;
  }
  ngOnInit() {
    this.getRequests();
    const el = document.querySelector('mat-table') as HTMLElement;
    const top = document.querySelector('#topNav') as HTMLElement;
    const dash = document.querySelector('#dash') as HTMLElement;
    const wrapper = document.createElement('div');
    var topHeight: number = top.offsetHeight;
    var dashHeight: number = dash.offsetHeight;
    wrapper.setAttribute('id', 'mat-table-wrapper');
    wrapper.style.overflow = 'auto';
    wrapper.style.height = "calc(100vh - (" + topHeight.toString() + "px + " + dashHeight.toString() + "px + 100px))";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

  }
  restore(id: string) {
    this.restorereq = this.DeletedTable.find(el => el.requestNo == id);
    this.restorereq.status = "Pending";
    this._databaseService.updateRequest(this.restorereq).pipe(first()).subscribe(
      data => {
        this.getRequests();
      });
  }
  delete(id: number) {
    this._databaseService.deleteRequests(id).pipe(first()).subscribe(
      data => {
        this.getRequests();
      });
  }
  

}
