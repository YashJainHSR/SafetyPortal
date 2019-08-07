import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface department {
  id: number;
  departmentName: string;
  hod: string;
  nodal: string;
}
export interface hod {
  id: number;
  hodid: string;
  hodName: string;
  email: string;
}
export interface nodal {
  id: number;
  nodalId: string;
  nodalName: string;
  email: string;
}

@Component({
  selector: 'dept-list',
  templateUrl: './dept-list.component.html',
  styleUrls: ['./dept-list.component.css'],

})
export class DeptListComponent implements OnInit{
  addeditDept: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public deptList: department[] = [];
  public editthisdept: department;
  public hodList: hod[] = [];
  public nodalList: nodal[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {

    this.getnodalList();
    this.gethodList();
  }

  displayedColumns: string[] = ['srno', 'departmentName', 'hod', 'nodal', 'del-editbutton'];
  dataSource = new MatTableDataSource<department>();
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
      this.dataSource = new MatTableDataSource<department>(this.deptList);
      this.dataSource.sort = this.sort;
    });
  }
  gethodList() {
    this._databaseService.getHODList().subscribe(data => {
      this.hodList = data;
      this.hodList = this.hodList.sort(function (a, b) {
        var nameA = a.hodid.toUpperCase(); // ignore upper and lowercase
        var nameB = b.hodid.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      console.log(this.hodList);
    });

  }
  getnodalList() {
    this._databaseService.getNodalList().subscribe(data => {
      this.nodalList = data;
      this.nodalList = this.nodalList.sort(function (a, b) {
        var nameA = a.nodalId.toUpperCase(); // ignore upper and lowercase
        var nameB = b.nodalId.toUpperCase(); // ignore upper and lowercase
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

  deletedept(id: number) {
    this._databaseService.deleteDepartment(id).subscribe(() => {
      this.getDeptList();
    })
  }
  editdept(id: number) {
    this.editthisdept = this.deptList.find(el => el.id == id);
    this.addeditDept.patchValue(this.editthisdept);
    this.Task = "Save Changes";
    this.Title = "Edit Department"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add Department"
    this.Task = "Add to List";
    this.editflag = false;
    this.getDeptList();
    this.addeditDept = this.fb.group({
      id:[0],
      departmentName: ['', Validators.required],
      hod: ['', Validators.required],
      nodal: ['', Validators.required]
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
  get f() { return this.addeditDept.controls; }

  onSubmit() {
    if (this.addeditDept.invalid) {
      return;
    }
    var formvalues: department = this.addeditDept.value;
    if (this.editflag) {
      this._databaseService.updateDepartment(formvalues).subscribe(() => {
          this.ngOnInit();
      });
    }
    else {
      this._databaseService.saveDepartment(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
