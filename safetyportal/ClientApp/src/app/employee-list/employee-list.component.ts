import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface department {
  id: number;
  departmentName: string;
}
export interface employee {
  employeeId: number;
  name: string;
  email: string;
  department: string;
  phone: string;
  intercom: string;
  area: string;
}

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],

})
export class EmployeeListComponent implements OnInit {
  addeditEmployee: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public employeeList: employee[] = [];
  public editthisEmployee: employee;
  public deptList: department[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {
    this.getDeptList();
  }

  displayedColumns: string[] = ['srno', 'employeeId', 'name', 'email', 'department', 'phone', 'intercom', 'area', 'del-editbutton'];
  dataSource = new MatTableDataSource<employee>();
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  getDeptList() {
    this._databaseService.getDepartmentList().subscribe(data => {
      this.deptList = data;
      this.deptList = this.deptList.sort(function (a, b) {
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
    });
  }
  getEmployeeList() {
    this._databaseService.getEmployeeList().subscribe(data => {
      this.employeeList = data;
      this.employeeList = this.employeeList.sort(function (a, b) {
        var nameA = a.employeeId; 
        var nameB = b.employeeId;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        
        return 0;
      });
      this.dataSource = new MatTableDataSource<employee>(this.employeeList);
      this.dataSource.sort = this.sort;
    });
   
  }
  
  delete(id: number) {
    this._databaseService.deleteEmployee(id).subscribe(() => {
      this.getEmployeeList();
    })
  }
  edit(id: number) {
    this.editthisEmployee = this.employeeList.find(el => el.employeeId == id);
    this.addeditEmployee.patchValue(this.editthisEmployee);
    this.Task = "Save Changes";
    this.Title = "Edit Employee"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add Employee"
    this.Task = "Add to List";
    this.editflag = false;
    this.getEmployeeList();
    this.addeditEmployee = this.fb.group({
      employeeId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      department: ['', Validators.required],
      phone: ['', Validators.required],
      intercom: ['', Validators.required],
      area: ['', Validators.required],
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
  get f() { return this.addeditEmployee.controls; }

  onSubmit() {
    if (this.addeditEmployee.invalid) {
      return;
    }
    var formvalues: employee = this.addeditEmployee.value;
    if (this.editflag) {
      this._databaseService.updateEmployee(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
    else {
      this._databaseService.saveEmployee(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
