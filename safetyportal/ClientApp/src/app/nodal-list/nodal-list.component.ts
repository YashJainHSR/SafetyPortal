import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface nodal {
  id: number;
  nodalId: string;
  nodalName: string;
  email: string;
}

@Component({
  selector: 'nodal-list',
  templateUrl: './nodal-list.component.html',
  styleUrls: ['./nodal-list.component.css'],

})
export class NodalListComponent implements OnInit {
  addeditNodal: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public editthisnodal: nodal;
  public nodalList: nodal[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {

  }

  displayedColumns: string[] = ['srno', 'nodalId', 'nodalName', 'email', 'del-editbutton'];
  dataSource = new MatTableDataSource<nodal>();
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;


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
      this.dataSource = new MatTableDataSource<nodal>(this.nodalList);
      this.dataSource.sort = this.sort;
    });

  }

  delete(id: number) {
    this._databaseService.deleteNodal(id).subscribe(() => {
      this.getnodalList();
    })
  }
  edit(id: number) {
    this.editthisnodal = this.nodalList.find(el => el.id == id);
    this.addeditNodal.patchValue(this.editthisnodal);
    this.Task = "Save Changes";
    this.Title = "Edit Nodal"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add Nodal"
    this.Task = "Add to List";
    this.editflag = false;
    this.getnodalList();
    this.addeditNodal = this.fb.group({
      id: [0],
      nodalId: ['', Validators.required],
      nodalName: ['', Validators.required],
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
  get f() { return this.addeditNodal.controls; }

  onSubmit() {
    if (this.addeditNodal.invalid) {
      return;
    }
    var formvalues: nodal = this.addeditNodal.value;

    if (this.editflag) {
      this._databaseService.updateNodal(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
    else {
      this._databaseService.saveNodal(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
