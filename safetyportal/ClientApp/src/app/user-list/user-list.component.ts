import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface LoginCredentials {
  id: number;
  username: string;
  password: string;
  role: string;
  token: string;
}
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  password: string;
  role: string;
  token: string;
}

export interface employeeList {
  employeeId: number;
  name: string;
}
@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],

})
export class UserListComponent implements OnInit {
  addeditCred: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public EmpList: employeeList[] = [];
  public CredentialsList: LoginCredentials[] = [];
  public editthiscred: LoginCredentials;
  public userform: LoginCredentials;
  public userinfo: UserInfo[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {
    
  }

  displayedColumns: string[] = ['srno', 'username', 'name', 'role', 'password' ,'del-editbutton'];
  dataSource = new MatTableDataSource<UserInfo>();
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  async getCredentialsList() {
    await new Promise(resolve => {
      this._databaseService.getEmployeeList().pipe(first()).subscribe(
        data => {
          this.EmpList = data;
          resolve();
        }
      )
    }).then(() => {
      this._databaseService.getAllCredentials().subscribe(data => {
        this.CredentialsList = data;
        this.CredentialsList = this.CredentialsList.sort(function (a, b) {
          var nameA = a.username.toUpperCase(); // ignore upper and lowercase
          var nameB = b.username.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });
        var user: UserInfo;
        var empl: employeeList;
        this.userinfo = [];
        for (let i = 0; i < this.CredentialsList.length; i++) {
          if (this.CredentialsList[i].username.startsWith("900")) {
            
            
              empl = this.EmpList.find(el => el.employeeId.toString() == this.CredentialsList[i].username);
            
            //empl = this.EmpList.find(el => el.employeeId.toString() == this.CredentialsList[i].username);
            if (empl == null) {
              empl = {
                employeeId: parseInt(this.CredentialsList[i].username),
                name: "Rectify Employee Data"
              };
            }
            user = {
              id: this.CredentialsList[i].id,
              username: this.CredentialsList[i].username,
              name: empl.name,
              password: this.CredentialsList[i].password,
              role: this.CredentialsList[i].role,
              token: this.CredentialsList[i].token
            }
            this.userinfo.push(user);
          }
          else {
            user = {
              id: this.CredentialsList[i].id,
              username: this.CredentialsList[i].username,
              name: "",
              password: this.CredentialsList[i].password,
              role: this.CredentialsList[i].role,
              token: this.CredentialsList[i].token
            }
            this.userinfo.push(user);
          }
        }
        this.dataSource = new MatTableDataSource<UserInfo>(this.userinfo);
        this.dataSource.sort = this.sort;

        }
      )
    });

  }


  delete(id: number) {
    this._databaseService.deleteCredentials(id).subscribe(() => {
      this.getCredentialsList();
    })
  }
  edit(id: number) {
    this.editthiscred = this.CredentialsList.find(el => el.id == id);
    this.addeditCred.patchValue(this.editthiscred);
    this.Task = "Save Changes";
    this.Title = "Edit Credentials"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add Credentials"
    this.Task = "Add to List";
    this.editflag = false;
    this.getCredentialsList();
    this.addeditCred = this.fb.group({
      id: [0],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      token: ['']
      
    });

    const el = document.querySelector('mat-table') as HTMLElement;
    const top = document.querySelector('#topNav') as HTMLElement;
    const wrapper = document.createElement('div');
    var topHeight: number = top.offsetHeight;
    wrapper.setAttribute('id', 'mat-table-wrapper');
    wrapper.style.overflow = 'auto';
    wrapper.style.height = "calc(100vh - (" + topHeight.toString() + "px + 40px))";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

  }
  // convenience getter for easy access to form fields
  get f() { return this.addeditCred.controls; }

  onSubmit() {
    if (this.addeditCred.invalid) {
      return;
    }
    else {
      if (this.editflag) {
        this.userform = this.addeditCred.value;
        this._databaseService.updateCredentials(this.userform).subscribe(() => {
          this.ngOnInit();
        });
      }
      else {
        this.userform = this.addeditCred.value;
        this._databaseService.saveCredentials(this.userform).subscribe(() => {
          this.ngOnInit();
        });
      }
    }
  }
}
