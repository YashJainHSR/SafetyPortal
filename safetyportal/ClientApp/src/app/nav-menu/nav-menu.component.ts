import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../_services/Database.service';
import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';

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
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent implements OnInit {
  //private LOGO = require("./helmet.jpg");
  public refresh: boolean;
  public Requests: RequestFormat[] = [];
  public PendingTable: RequestFormat[] = [];
  public SubmittedTable: RequestFormat[] = [];
  public CompletedTable: RequestFormat[] = [];
  public AllTable: RequestFormat[] = [];
  public InboxTable: RequestFormat[] = [];
  public DeletedTable: RequestFormat[] = [];
  public deptList: department[] = [];
  public dept: Array<string> = [];
  imgURL: any = "/assets/logo.jpg";
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private _databaseService: DatabaseService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  ngOnInit() {
    this.refresh = true;
  }
  async getnav() {
    await new Promise(resolve => {
      this._databaseService.getRequests().subscribe(
        data => {
          this.Requests = data;
          resolve()
        })
    }).then(() => {
      if (this.currentUser.role == Role.User) {
        console.log(this.currentUser.role);
        this.PendingTable = this.Requests.filter(el => el.assignedTo == parseInt(this.currentUser.username) && el.status == "Pending");
        this.SubmittedTable = this.Requests.filter(el => el.createdBy == this.currentUser.username);
        this.CompletedTable = this.Requests.filter(el => el.assignedTo == parseInt(this.currentUser.username) && el.status == "Completed");
        this.AllTable = this.Requests.filter(el => el.assignedTo == parseInt(this.currentUser.username) && (el.status === "Pending" || el.status === "Completed"));
        this.InboxTable = this.Requests.filter(el => el.assignedTo == parseInt(this.currentUser.username) && el.status == "Pending" && el.userFlag == 0);
        this.DeletedTable = this.Requests.filter(el => el.assignedTo == parseInt(this.currentUser.username) && (el.status != "Pending") && (el.status != "Completed"));
        this.refresh = false;
      }
      else if (this.currentUser.role == Role.Admin) {
        this.PendingTable = this.Requests.filter(el => el.status === "Pending");
        this.CompletedTable = this.Requests.filter(el => el.status === "Completed");
        this.AllTable = this.Requests.filter(el => (el.status === "Pending" || el.status === "Completed"));
        this.InboxTable = this.Requests.filter(el => el.status === "Pending" && el.adminFlag == 0);
        this.DeletedTable = this.Requests.filter(el => (el.status !== "Pending") && (el.status !== "Completed"));
        this.refresh = false;

      }
      else if (this.currentUser.role == Role.Safety) {
        this.PendingTable = this.Requests.filter(el => el.status === "Pending");
        this.CompletedTable = this.Requests.filter(el => el.status === "Completed");
        this.AllTable = this.Requests.filter(el => (el.status === "Pending" || el.status === "Completed"));
        this.InboxTable = this.Requests.filter(el => el.status === "Pending" && el.safetyFlag == 0);
        this.DeletedTable = this.Requests.filter(el => (el.status != "Pending") && (el.status != "Completed"));
        this.refresh = false;

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
  async getHodData() {
    await new Promise(resolve => {
      this._databaseService.getDepartmentList().subscribe(data => {
        this.deptList = data;
        this.deptList = this.deptList.filter(el => el.hod === this.currentUser.username);
        for (let i = 0; i < this.deptList.length; i++) {
          let deptfromlist: string = this.deptList[i].departmentName;
          this.dept.push(deptfromlist);
        }
        resolve()
      })
    }).then(() => {
      this.PendingTable = this.Requests.filter(el => el.status === "Pending" && (this.dept.indexOf(el.department) >= 0));
      this.CompletedTable = this.Requests.filter(el => el.status === "Completed" && (this.dept.indexOf(el.department) >= 0));
      this.AllTable = this.Requests.filter(el => (el.status === "Pending" || el.status === "Completed") && (this.dept.indexOf(el.department) >= 0));
      this.InboxTable = this.Requests.filter(el => el.status === "Pending" && (this.dept.indexOf(el.department) >= 0) && el.hodFlag == 0);
      this.DeletedTable = this.Requests.filter(el => (el.status !== "Pending") && (el.status !== "Completed") && (this.dept.indexOf(el.department) >= 0));
      this.refresh = false;

    })
  }
  async getNodalData() {
    await new Promise(resolve => {
      this._databaseService.getDepartmentList().subscribe(data => {
        this.deptList = data;
        this.deptList = this.deptList.filter(el => el.nodal === this.currentUser.username);
        for (let i = 0; i < this.deptList.length; i++) {
          let deptfromlist: string = this.deptList[i].departmentName;
          this.dept.push(deptfromlist);
        }
        resolve()
      })
    }).then(() => {
      this.PendingTable = this.Requests.filter(el => el.status === "Pending" && (this.dept.indexOf(el.department) >= 0));
      this.CompletedTable = this.Requests.filter(el => el.status === "Completed" && (this.dept.indexOf(el.department) >= 0));
      this.AllTable = this.Requests.filter(el => (el.status === "Pending" || el.status === "Completed") && (this.dept.indexOf(el.department) >= 0));
      this.InboxTable = this.Requests.filter(el => el.status === "Pending" && (this.dept.indexOf(el.department) >= 0) && el.nodalFlag == 0);
      this.DeletedTable = this.Requests.filter(el => (el.status != "Pending") && (el.status != "Completed") && (this.dept.indexOf(el.department) >= 0));
      this.refresh = false;

    })
  }
  
  public PendingCount() {
    return this.PendingTable.length;
  }
  public SubmittedCount() {
    return this.SubmittedTable.length;
  }
  public CompletedCount() {
    return this.CompletedTable.length;
  }
  public AllCount() {
    return this.AllTable.length;
  }
  public InboxCount() {
    return this.InboxTable.length;
  }
  public DeletedCount() {
    return this.DeletedTable.length;
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  get isNormal() {
    return this.currentUser && this.currentUser.role === Role.User;
  }
  get isSafety() {
    return this.currentUser && this.currentUser.role === Role.Safety;
  }
  get isNodal() {
    return this.currentUser && this.currentUser.role === Role.Nodal;
  }
  get isHOD() {
    return this.currentUser && this.currentUser.role === Role.HOD;
  }

  logout() {
    this.authenticationService.logout();
    this.refresh = true;
    this.router.navigate(['/login']);
  }
}
