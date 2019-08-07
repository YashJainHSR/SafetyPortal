import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MatCheckboxChange } from '@angular/material';
import { first } from 'rxjs/operators';
import { DatabaseService } from '../_services/Database.service';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import * as moment from 'moment';
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
export interface DepartmentList {
  departmentName: string;
  nodal: string;
}
export interface SectionList {
  sectionName: string;
  departmentName: string;
}
export interface AgencyList {
  agencyName: string;
}
export interface AssignToList {
  employeeId: string;
  department: string;
  section: string;
  agency: string;
}
export interface Assign {
  employeeId: string;
  name: string;
}
export interface employeeList {
  employeeId: string;
  name: string;
  area: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  counterChange = new EventEmitter();
  public load: boolean = false;
  public employeename: string;
  public DeptList: DepartmentList[] = [];
  public SecList: SectionList[] = [];
  public EmpList: employeeList[] = [];
  public SecListForDept: SectionList[] = [];
  public AgenList: AgencyList[] = [];
  public AssignTo: AssignToList[] = [];
  public AssignToConditional: AssignToList[] = [];
  public Assign: Assign[] = [];
  public dept: DepartmentList;
  public EveryRequest: RequestFormat[] = [];
  public FilteredRequest: RequestFormat[] = [];
  selectedDepartmentValue: Array<string> = [];
  selectedCreatedByValue: Array<string> = ["NDO_CR", "NDO_HR"];
  selectedObservedByValue: Array<string> = [];
  selectedSectionValue: Array<string> = [];
  selectedAgencyValue: Array<string> = [];
  selectedAssignedToValue: Array<string> = [];
  selectedStatusValue: Array<string> = ["Pending", "Completed"];

  selectedCategoryValue = ['Unsafe Condition', 'Unsafe Act', 'Near Miss'];
  selectedSeverityValue = ['Normal', 'Critical', 'Most Critical'];
  topGap = 50;
  loading: boolean = true;
  filterForm: FormGroup;
  constructor(private cdr: ChangeDetectorRef  ,private _databaseService: DatabaseService, private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.getRequests();
  }

  displayedColumns: string[] = ['srno','requestNo', 'status', 'requestDate', 'department', 'section', 'agency', 'description', 'observedBy', 'shownTo', 'actionToBeTaken', 'assignedTo', 'targetDate', 'category', 'createdBy', 'actionTaken', 'completionDate', 'closingDate', 'justificationForClosing', 'severity', 'aging', 'area'];
  //dataSource = new MatTableDataSource<RequestFormat>(this.FilteredRequest);
dataSource = new MatTableDataSource<RequestFormat>();

  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  get f() { return this.filterForm.controls; }
  calc(date: Date) {
    var today = moment().format("YYYY-MM-DD");
    var now = moment(today);
    var format = moment(date.toString(), ["DD-MM-YYYY, hh:mm:ss"]).format("YYYY-MM-DD");
      return now.to(format, true);
  }
  getRequests() {
    this._databaseService.getRequests().subscribe(
      data => {
        this.EveryRequest = data;
        //this.dataSource = new MatTableDataSource<RequestFormat>(this.EveryRequest);
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        //this.paginator._changePageSize(10000);
        this.loading = false;
      });

  }
  //Status
  isStatusChecked(): boolean {
    return this.f.status.value && this.selectedStatusValue.length && this.f.status.value.length === this.selectedStatusValue.length;

  }

  isStatusIndeterminate(): boolean {
    return this.f.status.value && this.selectedStatusValue.length && this.f.status.value.length && this.f.status.value.length < this.selectedStatusValue.length;
  }

  toggleStatusSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.status.setValue(this.selectedStatusValue);
    }
    else {
      this.f.status.setValue([]);
    }
  }
  //Category
  isCategoryChecked(): boolean {
    return this.f.category.value && this.selectedCategoryValue.length && this.f.category.value.length === this.selectedCategoryValue.length;
  }

  isCategoryIndeterminate(): boolean {
    return this.f.category.value && this.selectedCategoryValue.length && this.f.category.value.length && this.f.category.value.length < this.selectedCategoryValue.length;
  }

  toggleCategorySelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.category.setValue(this.selectedCategoryValue);
    }
    else {
      this.f.category.setValue([]);
    }
  }
  //Severity
  isSeverityChecked(): boolean {
    return this.f.severity.value && this.selectedSeverityValue.length && this.f.severity.value.length === this.selectedSeverityValue.length;
  }

  isSeverityIndeterminate(): boolean {
    return this.f.severity.value && this.selectedSeverityValue.length && this.f.severity.value.length && this.f.severity.value.length < this.selectedSeverityValue.length;
  }

  toggleSeveritySelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.severity.setValue(this.selectedSeverityValue);
    }
    else {
      this.f.severity.setValue([]);
    }
  }
  //Department
  isDepartmentChecked(): boolean {
    return this.f.department.value && this.selectedDepartmentValue.length && this.f.department.value.length === this.selectedDepartmentValue.length;
  }

  isDepartmentIndeterminate(): boolean {
    return this.f.department.value && this.selectedDepartmentValue.length && this.f.department.value.length && this.f.department.value.length < this.selectedDepartmentValue.length;
  }

  toggleDepartmentSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.department.setValue(this.selectedDepartmentValue);
    }
    else {
      this.f.department.setValue([]);
    }
    this.deptselected();

  }
  //Section
  isSectionChecked(): boolean {
    return this.f.section.value && this.selectedSectionValue.length && this.f.section.value.length === this.selectedSectionValue.length;
  }

  isSectionIndeterminate(): boolean {
    return this.f.section.value && this.selectedSectionValue.length && this.f.section.value.length && this.f.section.value.length < this.selectedSectionValue.length;
  }

  toggleSectionSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.section.setValue(this.selectedSectionValue);
    }
    else {
      this.f.section.setValue([]);
    }
    this.deptSecAgenselected();

  }
  //Agency
  isAgencyChecked(): boolean {
    return this.f.agency.value && this.selectedAgencyValue.length && this.f.agency.value.length === this.selectedAgencyValue.length;
  }

  isAgencyIndeterminate(): boolean {
    return this.f.agency.value && this.selectedAgencyValue.length && this.f.agency.value.length && this.f.agency.value.length < this.selectedAgencyValue.length;
  }

  toggleAgencySelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.agency.setValue(this.selectedAgencyValue);
    }
    else {
      this.f.agency.setValue([]);
    }
    this.deptSecAgenselected();

  }
  //CreatedBy
  isCreatedByChecked(): boolean {
    return this.f.createdBy.value && this.selectedCreatedByValue.length && this.f.createdBy.value.length === this.selectedCreatedByValue.length;
  }

  isCreatedByIndeterminate(): boolean {
    return this.f.createdBy.value && this.selectedCreatedByValue.length && this.f.createdBy.value.length && this.f.createdBy.value.length < this.selectedCreatedByValue.length;
  }

  toggleCreatedBySelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.createdBy.setValue(this.selectedCreatedByValue);
    }
    else {
      this.f.createdBy.setValue([]);
    }
  }
  //ObservedBy
  isObservedByChecked(): boolean {
    return this.f.observedBy.value && this.selectedObservedByValue.length && this.f.observedBy.value.length === this.selectedObservedByValue.length;
  }

  isObservedByIndeterminate(): boolean {
    return this.f.observedBy.value && this.selectedObservedByValue.length && this.f.observedBy.value.length && this.f.observedBy.value.length < this.selectedObservedByValue.length;
  }

  toggleObservedBySelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.observedBy.setValue(this.selectedObservedByValue);
    }
    else {
      this.f.observedBy.setValue([]);
    }
  }
  //AssignedTo
  isAssignedToChecked(): boolean {
    return this.f.assignedTo.value && this.selectedAssignedToValue.length && this.f.assignedTo.value.length === this.selectedAssignedToValue.length;
  }

  isAssignedToIndeterminate(): boolean {
    return this.f.assignedTo.value && this.selectedAssignedToValue.length && this.f.assignedTo.value.length && this.f.assignedTo.value.length < this.selectedAssignedToValue.length;
  }

  toggleAssignedToSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.f.assignedTo.setValue(this.selectedAssignedToValue);
    }
    else {
      this.f.assignedTo.setValue([]);
    }
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }
  ngOnInit() {
    
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      status: ['', Validators.required],
      category: ['', Validators.required],
      severity: ['', Validators.required],
      createdBy: ['', Validators.required],
      department: ['', Validators.required],
      section: ['', Validators.required],
      agency: ['', Validators.required],
      observedBy: ['', Validators.required],
      assignedTo: ['', Validators.required],
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getDepartmentList();
    this.getEmployeeList();
    this.filterForm.controls.category.patchValue(this.selectedCategoryValue);
    this.filterForm.controls.severity.patchValue(this.selectedSeverityValue);
    this.filterForm.controls.status.patchValue(this.selectedStatusValue);
    const el = document.querySelector('mat-table') as HTMLElement;
    const top = document.querySelector('#topNav') as HTMLElement;
    const dash = document.querySelector('#dash') as HTMLElement;
    const wrapper = document.createElement('div');
    var topHeight: number = top.offsetHeight;
    var dashHeight: number = dash.offsetHeight;
    this.topGap = topHeight;
    wrapper.setAttribute('id', 'mat-table-wrapper');
    wrapper.style.overflow = 'auto';
    wrapper.style.height = "calc(100vh - (" + topHeight.toString() + "px + " + dashHeight.toString() + "px + 100px))";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  getEmployeeList() {
    return this._databaseService.getEmployeeList().pipe(first()).subscribe(
      data => {
        this.EmpList = data;
        this.EmpList = this.EmpList.sort(
          function (a, b) {
            var nameA = parseInt(a.employeeId); // ignore upper and lowercase
            var nameB = parseInt(b.employeeId); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
        for (let i = 0; i < this.EmpList.length; i++) {
          let createdBylist: string = this.EmpList[i].employeeId;
          this.selectedCreatedByValue.push(createdBylist);
          this.selectedObservedByValue.push(createdBylist);
        }
        this.filterForm.controls.createdBy.patchValue(this.selectedCreatedByValue);
        this.filterForm.controls.observedBy.patchValue(this.selectedObservedByValue);
      }
    )
  }
  async getDepartmentList() {
    await new Promise(resolve => {
      return this._databaseService.getDepartmentList().pipe(first()).subscribe(
        data => {
          this.DeptList = data;
          this.DeptList = this.DeptList.sort(function (a, b) {
            var nameA = a.departmentName.toString().toUpperCase(); // ignore upper and lowercase
            var nameB = b.departmentName.toString().toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
          for (let i = 0; i < this.DeptList.length; i++) {
            let deptfromlist: string = this.DeptList[i].departmentName;
            this.selectedDepartmentValue.push(deptfromlist);
          }
          this.filterForm.controls.department.patchValue(this.selectedDepartmentValue);
          resolve()
        })
    }).then(() => {
      this.getSectionList();
    })
  }
  async getSectionList() {
    await new Promise(resolve => {
      return this._databaseService.getSectionList().pipe(first()).subscribe(
        data => {
          this.SecList = data;
          this.SecList = this.SecList.sort(
            function (a, b) {
              var nameA = a.sectionName.toString().toUpperCase(); // ignore upper and lowercase
              var nameB = b.sectionName.toString().toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });
          resolve()
        })
    }).then(() => {
      this.getAgencyList();
    })
  }
  async getAgencyList() {
    await new Promise(resolve => {
      return this._databaseService.getAgencyList().pipe(first()).subscribe(
        data => {
          this.AgenList = data;
          this.AgenList = this.AgenList.sort(
            function (a, b) {
              var nameA = a.agencyName.toString().toUpperCase(); // ignore upper and lowercase
              var nameB = b.agencyName.toString().toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });
          for (let i = 0; i < this.AgenList.length; i++) {
            let agenfromlist: string = this.AgenList[i].agencyName;
            this.selectedAgencyValue.push(agenfromlist);
          }
          this.filterForm.controls.agency.patchValue(this.selectedAgencyValue);
          resolve()
        })
    }).then(() => {
      this.getAssignToList();

    })
  }
  async getAssignToList() {
    await new Promise(resolve => {
      return this._databaseService.getAssignToList().pipe(first()).subscribe(
        data => {
          this.AssignTo = data;
          resolve()
        })
    }).then(() => {
      this.deptselected();
      this.deptSecAgenselected();
      this.load = true;
    })
  }
  deptselected() {
    //this.dept = this.DeptList.find(el => el.departmentName === this.f.department.value);
    this.SecListForDept = this.SecList.filter(el => (this.f.department.value.indexOf(el.departmentName) >= 0));
    this.selectedSectionValue = [];
    for (let i = 0; i < this.SecListForDept.length; i++) {
      let sectionfromlist: string = this.SecListForDept[i].sectionName;
      this.selectedSectionValue.push(sectionfromlist);
    }
    this.filterForm.controls.section.patchValue(this.selectedSectionValue);
    this.deptSecAgenselected();

  }
  deptSecAgenselected() {

    this.AssignToConditional = this.AssignTo.filter(el => (this.f.department.value.indexOf(el.department) >= 0) && (this.f.section.value.indexOf(el.section) >= 0) && (this.f.agency.value.indexOf(el.agency) >= 0));
    this.selectedAssignedToValue = [];
    var assigni: Assign;
    var emp: employeeList;
    this.Assign = [];
    for (let i = 0; i < this.AssignToConditional.length; i++) {
      emp = this.EmpList.find(el => el.employeeId == this.AssignToConditional[i].employeeId);
      this.selectedAssignedToValue.push(emp.employeeId);
      assigni = {
        employeeId: emp.employeeId,
        name: emp.name
      }
      this.Assign.push(assigni);
    }
    this.filterForm.controls.assignedTo.patchValue(this.selectedAssignedToValue);


    this.Assign = this.Assign.sort(function (a, b) {
      var nameA = a.employeeId.toString().toUpperCase(); // ignore upper and lowercase
      var nameB = b.employeeId.toString().toUpperCase(); // ignore upper and lowercase
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
  onSubmit() {
    if (this.f.startDate.value == "") {
      var sd = "2010-01-01";
      this.f.startDate.patchValue(sd);
    }
    if (this.f.endDate.value == "") {
      var today = moment().format("YYYY-MM-DD");
      this.f.endDate.patchValue(today);
    }
    if (this.filterForm.invalid) {
      return;
    }
    else {
      this.FilteredRequest = this.EveryRequest.filter(el => (moment(moment(el.requestDate.toString(), ["DD-MM-YYYY, hh:mm:ss"]).format("YYYY-MM-DD")).isBetween(this.f.startDate.value, this.f.endDate.value, null, '[]')) && (this.f.status.value.indexOf(el.status) >= 0) && (this.f.category.value.indexOf(el.category) >= 0) && (this.f.severity.value.indexOf(el.severity) >= 0) && (this.f.department.value.indexOf(el.department) >= 0) && (this.f.section.value.indexOf(el.section) >= 0) && (this.f.agency.value.indexOf(el.agency) >= 0) && (((this.f.createdBy.value).map(String)).indexOf(el.createdBy) >= 0) && (this.f.observedBy.value.indexOf(parseInt(el.observedBy)) >= 0) && (this.f.assignedTo.value.indexOf(el.assignedTo) >= 0));
      this.dataSource = new MatTableDataSource<RequestFormat>(this.FilteredRequest);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._changePageSize(10000);
      this.loading = false;
    }
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    /* save to file */
    XLSX.writeFile(wb, 'Safety Portal Search Report ' + now + '.xlsx');

  }

}
