import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface hod {
  id: number;
  hodid: string;
  hodname: string;
  email: string;
}

@Component({
  selector: 'hod-list',
  templateUrl: './hod-list.component.html',
  styleUrls: ['./hod-list.component.css'],

})
export class HodListComponent implements OnInit {
  addeditHOD: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public editthishod: hod;
  public hodList: hod[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {
    
  }

  displayedColumns: string[] = ['srno', 'hodid', 'hodname', 'email', 'del-editbutton'];
  dataSource = new MatTableDataSource<hod>();
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

 
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
      this.dataSource = new MatTableDataSource<hod>(this.hodList);
      this.dataSource.sort = this.sort;
    });

  }
  
  delete(id: number) {
    this._databaseService.deleteHOD(id).subscribe(() => {
      this.gethodList();
    })
  }
  edit(id: number) {
    this.editthishod = this.hodList.find(el => el.id == id);
    this.addeditHOD.patchValue(this.editthishod);
    this.Task = "Save Changes";
    this.Title = "Edit HOD"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add HOD"
    this.Task = "Add to List";
    this.editflag = false;
    this.gethodList();
    this.addeditHOD = this.fb.group({
      id: [0],
      hodid: ['', Validators.required],
      hodname: ['', Validators.required],
      email: ['', Validators.required]
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
  get f() { return this.addeditHOD.controls; }

  onSubmit() {
    if (this.addeditHOD.invalid) {
      return;
    }
    var formvalues: hod = this.addeditHOD.value;

    if (this.editflag) {
      this._databaseService.updateHOD(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
    else {
      this._databaseService.saveHOD(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
