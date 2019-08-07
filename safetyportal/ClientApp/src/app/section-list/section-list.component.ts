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
export interface section {
  id: number;
  sectionName: string;
  departmentName: string;
}

@Component({
  selector: 'section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css'],

})
export class SectionListComponent implements OnInit {
  addeditSection: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public deptList: department[] = [];
  public editthissection: section;
  public sectionList: section[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {
    this.getDeptList();
  }

  displayedColumns: string[] = ['srno', 'sectionName', 'departmentName', 'del-editbutton'];
  dataSource = new MatTableDataSource<section>();
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
  getsectionList() {
    this._databaseService.getSectionList().subscribe(data => {
      this.sectionList = data;
      this.sectionList = this.sectionList.sort(function (a, b) {
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
      console.log(this.sectionList);
      this.dataSource = new MatTableDataSource<section>(this.sectionList);
      this.dataSource.sort = this.sort;
    });

  }

  delete(id: number) {
    this._databaseService.deleteSection(id).subscribe(() => {
      this.getsectionList();
    })
  }
  edit(id: number) {
    this.editthissection = this.sectionList.find(el => el.id == id);
    this.addeditSection.patchValue(this.editthissection);
    this.Task = "Save Changes";
    this.Title = "Edit Section"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add Section"
    this.Task = "Add to List";
    this.editflag = false;
    this.getsectionList();
    this.addeditSection = this.fb.group({
      id: [0],
      departmentName: ['', Validators.required],
      sectionName: ['', Validators.required]
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
  get f() { return this.addeditSection.controls; }

  onSubmit() {
    if (this.addeditSection.invalid) {
      return;
    }
    var formvalues: section = this.addeditSection.value;

    if (this.editflag) {
      this._databaseService.updateSection(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
    else {
      this._databaseService.saveSection(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
