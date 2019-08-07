import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';

export interface DepartmentList {
  departmentName: string;
}
export interface SectionList {
  sectionName: string;
  departmentName: string;
}
export interface AgencyList {
  agencyName: string;
}
export interface AssignToList {
  id: number;
  employeeId: string;
  department: string;
  section: string;
  agency: string;
}
export interface Assign {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  section: string;
  agency: string;
}
export interface employeeList {
  employeeId: number;
  name: string;
}

@Component({
  selector: 'assign-employee',
  templateUrl: './assign-employee.component.html',
  styleUrls: ['./assign-employee.component.css'],

})
export class AssignEmployeeComponent implements OnInit{
  addeditAssignedTo: FormGroup;
  Task: string;
  Title: string;
  editflag: boolean;
  public DeptList: DepartmentList[] = [];
  public SecList: SectionList[] = [];
  public EmpList: employeeList[] = [];
  public SecListForDept: SectionList[] = [];
  public AgenList: AgencyList[] = [];
  public AssignTo: AssignToList[] = [];
  public editthisAssignedTo: AssignToList;
  public Assign: Assign[] = [];
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router) {
    this.getDepartmentList();
    this.getSectionList();
    this.getAgencyList();
  }


  displayedColumns: string[] = ['srno','employeeId','employeeName', 'department', 'section', 'agency', 'del-editbutton'];
  dataSource = new MatTableDataSource<Assign>();
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

 
  getDepartmentList() {
    this._databaseService.getDepartmentList().pipe(first()).subscribe(
      data => {
        this.DeptList = data;
        this.DeptList = this.DeptList.sort(function (a, b) {
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
      }
    )
  }
  getSectionList() {
    this._databaseService.getSectionList().pipe(first()).subscribe(
      data => {
        this.SecList = data;
        this.SecList = this.SecList.sort(
          function (a, b) {
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

      }
    )
  }
  deptselected() {
    this.SecListForDept = this.SecList.filter(el => el.departmentName === this.f.department.value);
  }
  getAgencyList() {
    this._databaseService.getAgencyList().pipe(first()).subscribe(
      data => {
        this.AgenList = data;
        this.AgenList = this.AgenList.sort(
          function (a, b) {
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
      }
    )
  }
  async getAssignToList() {
    await new Promise(resolve => {
      this._databaseService.getEmployeeList().pipe(first()).subscribe(
        data => {
          this.EmpList = data;
          this.EmpList = this.EmpList.sort(function (a, b) {
            var nameA = a.employeeId; // ignore upper and lowercase
            var nameB = b.employeeId; // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
          resolve();
        }
      )
    }).then(() => {
      this._databaseService.getAssignToList().pipe(first()).subscribe(
        data => {
          this.AssignTo = data;
          this.AssignTo = this.AssignTo.sort(
            function (a, b) {
              var nameA = a.employeeId.toUpperCase(); // ignore upper and lowercase
              var nameB = b.employeeId.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });
          var assigni: Assign;
          var empl: employeeList;
          this.Assign = [];
          for (let i = 0; i < this.AssignTo.length; i++) {
            
              empl = this.EmpList.find(el => el.employeeId.toString() == this.AssignTo[i].employeeId);
            
            if (empl == null) {
              empl = {
                employeeId: parseInt(this.AssignTo[i].employeeId),
                name: "Rectify Employee Data"
              };
            }
            assigni = {
              id: this.AssignTo[i].id,
              employeeId: (empl.employeeId).toString(),
              employeeName: empl.name,
              department: this.AssignTo[i].department,
              section: this.AssignTo[i].section,
              agency: this.AssignTo[i].agency
            }
            this.Assign.push(assigni);
          }
          this.dataSource = new MatTableDataSource<Assign>(this.Assign);
          this.dataSource.sort = this.sort;

        }
      )
    });
    
  }

  delete(id: number) {
    this._databaseService.deleteAssignTo(id).subscribe(() => {
      this.getAssignToList();
    })
  }
  edit(id: number) {
    this.editthisAssignedTo = this.AssignTo.find(el => el.id == id);
    this.addeditAssignedTo.controls.id.setValue(this.editthisAssignedTo.id);
    this.addeditAssignedTo.controls.employeeId.setValue(parseInt(this.editthisAssignedTo.employeeId));
    this.addeditAssignedTo.controls.department.setValue(this.editthisAssignedTo.department);
    this.deptselected();
    this.addeditAssignedTo.controls.section.setValue(this.editthisAssignedTo.section);
    this.addeditAssignedTo.controls.agency.setValue(this.editthisAssignedTo.agency);
    this.Task = "Save Changes";
    this.Title = "Edit Assigned Employee"
    this.editflag = true;
  }

  ngOnInit() {
    this.Title = "Assign Employee"
    this.Task = "Add to List";
    this.getAssignToList();
    this.editflag = false;
    this.addeditAssignedTo = this.fb.group({
      id: [0],
      employeeId: ['', Validators.required],
      department: ['', Validators.required],
      section: ['', Validators.required],
      agency: ['', Validators.required]
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
  get f() { return this.addeditAssignedTo.controls; }

  onSubmit() {
    if (this.addeditAssignedTo.invalid) {
      return;
    }
    else {
      var formvalues: AssignToList = this.addeditAssignedTo.value;
      if (this.editflag) {

        console.log(this.addeditAssignedTo.value);
        this._databaseService.updateAssignTo(formvalues).subscribe(() => {
          this.ngOnInit();
        });
      }
      else {
        console.log(this.addeditAssignedTo.value);
        this._databaseService.saveAssignTo(formvalues).subscribe(() => {
          this.ngOnInit();
        });
      }
    }
  }
}
