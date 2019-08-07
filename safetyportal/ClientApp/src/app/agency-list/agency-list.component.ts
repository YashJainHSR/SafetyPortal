import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface Agency {
  id: number;
  agencyName: string;
}

@Component({
  selector: 'agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.css'],

})
export class AgencyListComponent implements OnInit {
  addeditAgency: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public AgencyList: Agency[] = [];
  public editthisagency: Agency;
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {
    
  }

  displayedColumns: string[] = ['srno', 'agencyName', 'del-editbutton'];
  dataSource = new MatTableDataSource<Agency>();
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  getAgencyList() {
    this._databaseService.getAgencyList().subscribe(data => {
      this.AgencyList = data;
      this.AgencyList = this.AgencyList.sort(function (a, b) {
        var nameA = a.agencyName.toUpperCase(); // ignore upper and lowercase
        var nameB = b.agencyName.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      this.dataSource = new MatTableDataSource<Agency>(this.AgencyList);
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: number) {
    this._databaseService.deleteAgency(id).subscribe(() => {
      this.getAgencyList();
    })
  }
  edit(id: number) {
    this.editthisagency = this.AgencyList.find(el => el.id == id);
    this.addeditAgency.patchValue(this.editthisagency);
    this.Task = "Save Changes";
    this.Title = "Edit Agency"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Add Agency"
    this.Task = "Add to List";
    this.editflag = false;
    this.getAgencyList();
    console.log(this.AgencyList);
    this.addeditAgency = this.fb.group({
      id: [0],
      agencyName: ['', Validators.required],
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
  get f() { return this.addeditAgency.controls; }

  onSubmit() {
    if (this.addeditAgency.invalid) {
      return;
    }
    var formvalues: Agency = this.addeditAgency.value;
    if (this.editflag) {
      this._databaseService.updateAgency(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
    else {
      this._databaseService.saveAgency(formvalues).subscribe(() => {
        this.ngOnInit();
      });
    }
  }
}
