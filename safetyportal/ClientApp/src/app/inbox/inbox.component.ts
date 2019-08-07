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
  selector: 'inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})

export class InboxComponent implements OnInit {
  public s1: Subscription;
  public s2: Subscription;
  public s3: Subscription;
  public s4: Subscription;
  loading: boolean = true;
  currentUser: User;
  public InboxTable: RequestFormat[] = [];
  public deptList: department[] = [];
  public dept: Array<string> = [];
  dataSource = new MatTableDataSource<RequestFormat>();
  public delreq: RequestFormat;
  constructor(private router: Router, private _databaseService: DatabaseService, private authenticationService: AuthenticationService) {
    this.s4 = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser.role == Role.User || this.currentUser.role == Role.Nodal) {
      this.displayedColumns = ['requestNo', 'severity', 'requestDate', 'department', 'section', 'agency', 'description', 'category', 'targetDate', 'overdueDays'];
    }
    else {
      this.displayedColumns = ['requestNo', 'severity', 'requestDate', 'department', 'section', 'agency', 'description', 'category', 'targetDate', 'overdueDays','button'];

    }
  }
  displayedColumns: string[];
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
      this.InboxTable = this.InboxTable.filter(el => el.status === "Pending" && (this.dept.indexOf(el.department) >= 0) && el.hodFlag == 0);
      this.dataSource = new MatTableDataSource<RequestFormat>(this.InboxTable);
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
      this.InboxTable = this.InboxTable.filter(el => el.status === "Pending" && (this.dept.indexOf(el.department) >= 0) && el.nodalFlag ==0);
      this.dataSource = new MatTableDataSource<RequestFormat>(this.InboxTable);
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
          this.InboxTable = data;
          resolve()
        })
    }).then(() => {
      if (this.currentUser.role == Role.User) {
        console.log(this.currentUser.role);
        this.InboxTable = this.InboxTable.filter(el => el.assignedTo == parseInt(this.currentUser.username) && el.status == "Pending" && el.userFlag == 0);
        console.log(this.InboxTable);
        this.dataSource = new MatTableDataSource<RequestFormat>(this.InboxTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._changePageSize(10000);
        this.loading = false;
      }
      else if (this.currentUser.role == Role.Admin) {
        this.InboxTable = this.InboxTable.filter(el => el.status === "Pending" && el.adminFlag == 0);
        this.dataSource = new MatTableDataSource<RequestFormat>(this.InboxTable);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._changePageSize(10000);
        this.loading = false;
      }
      else if (this.currentUser.role == Role.Safety) {
        this.InboxTable = this.InboxTable.filter(el => el.status === "Pending" && el.safetyFlag == 0);
        this.dataSource = new MatTableDataSource<RequestFormat>(this.InboxTable);
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
    return this.InboxTable.length;
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
  select(id: string) {
    this.delreq = this.InboxTable.find(el => el.requestNo == id);
    this.delreq.status = "Deleted_" + this.currentUser.username;
    this._databaseService.updateRequest(this.delreq).pipe(first()).subscribe(
      data => {
        this.getRequests();
      });
  }
  selectRow(id: number) {
    this.router.navigate(['editrequest/'+id] );
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    /* save to file */
    XLSX.writeFile(wb, 'Safety Portal PendingReq Report ' + now + '.xlsx');

  }

}
