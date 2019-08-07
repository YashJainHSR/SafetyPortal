import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpRequest } from '@angular/common/http';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable, config } from 'rxjs';
@Injectable()
export class DatabaseService {
  myAppUrl: string = "";

  constructor(private _http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.myAppUrl = baseUrl;
  }
  
  //Credentials
  getAllCredentials() {
    return this._http.get<any>(this.myAppUrl + 'api/Credential/All');
  }

  getCredentialsById(id: number) {
    return this._http.get<any>(this.myAppUrl + "api/Credential/Details/" + id);
  }

  saveCredentials(credential) {
    return this._http.post(this.myAppUrl + 'api/Credential/Create', credential);
  }

  updateCredentials(credential) {
    return this._http.put(this.myAppUrl + 'api/Credential/Edit', credential);
  }

  deleteCredentials(id) {
    return this._http.delete(this.myAppUrl + "api/Credential/Delete/" + id);
  }

   //Requests
  getRequests() {
    return this._http.get<any>(this.myAppUrl + 'api/Request/All');
  }

  getRequestById(id: number) {
    return this._http.get<any>(this.myAppUrl + "api/Request/Details/" + id);
  }

  saveRequest(employee) {
    return this._http.post(this.myAppUrl + 'api/Request/Create', employee);
  }

  updateRequest(employee) {
    return this._http.put(this.myAppUrl + 'api/Request/Edit', employee);
  }

  deleteRequests(id) {
    return this._http.delete(this.myAppUrl + "api/Request/Delete/" + id);
  }

  //AgencyList
  getAgencyList() {
    return this._http.get<any>(this.myAppUrl + 'api/Agency/All');
  }

  saveAgency(agency) {
    return this._http.post(this.myAppUrl + 'api/Agency/Create', agency);
  }

  updateAgency(agency) {
    return this._http.put(this.myAppUrl + 'api/Agency/Edit', agency);
  }

  deleteAgency(id) {
    return this._http.delete(this.myAppUrl + "api/Agency/Delete/" + id);
  }

  
  //AssignToList
  getAssignToList() {
    return this._http.get<any>(this.myAppUrl + 'api/AssignTo/All');
  }

  saveAssignTo(assign) {
    return this._http.post(this.myAppUrl + 'api/AssignTo/Create', assign);
  }

  updateAssignTo(assign) {
    return this._http.put(this.myAppUrl + 'api/AssignTo/Edit', assign);
  }

  deleteAssignTo(id) {
    return this._http.delete(this.myAppUrl + "api/AssignTo/Delete/" + id);
  }

  //DepartmentList
  getDepartmentList() {
    return this._http.get<any>(this.myAppUrl + 'api/Department/All');
  }

  saveDepartment(department) {
    return this._http.post(this.myAppUrl + 'api/Department/Create', department);
  }

  updateDepartment(department) {
    return this._http.put(this.myAppUrl + 'api/Department/Edit', department);
  }

  deleteDepartment(id) {
    return this._http.delete(this.myAppUrl + "api/Department/Delete/" + id);
  }
  
  //EmployeeList
  getEmployeeList() {
    return this._http.get<any>(this.myAppUrl + 'api/Employee/All');
  }

  getEmployeeById(id: number) {
    return this._http.get<any>(this.myAppUrl + "api/Employee/Details/" + id);
  }

  saveEmployee(employee) {
    return this._http.post(this.myAppUrl + 'api/Employee/Create', employee);
  }

  updateEmployee(employee) {
    return this._http.put(this.myAppUrl + 'api/Employee/Edit', employee);
  }

  deleteEmployee(id) {
    return this._http.delete(this.myAppUrl + "api/Employee/Delete/" + id);
  }
  
  //HODList
  getHODList() {
    return this._http.get<any>(this.myAppUrl + 'api/HOD/All');
  }
  
  saveHOD(hod) {
    return this._http.post(this.myAppUrl + 'api/HOD/Create', hod);
  }

  updateHOD(hod) {
    return this._http.put(this.myAppUrl + 'api/HOD/Edit', hod);
  }

  deleteHOD(id) {
    return this._http.delete(this.myAppUrl + "api/HOD/Delete/" + id);
  }
  
  //NodalList
  getNodalList() {
    return this._http.get<any>(this.myAppUrl + 'api/Nodal/All');
  }
  
  saveNodal(nodal) {
    return this._http.post(this.myAppUrl + 'api/Nodal/Create', nodal);
  }

  updateNodal(nodal) {
    return this._http.put(this.myAppUrl + 'api/Nodal/Edit', nodal);
  }

  deleteNodal(id) {
    return this._http.delete(this.myAppUrl + "api/Nodal/Delete/" + id);
  }

  //StatusList
  getStatusList() {
    return this._http.get<any>(this.myAppUrl + 'api/Status/All');
  }
  
  saveStatus(status) {
    return this._http.post(this.myAppUrl + 'api/Status/Create', status);
  }

  updateStatus(status) {
    return this._http.put(this.myAppUrl + 'api/Status/Edit', status);
  }
  
  //SectionList
  getSectionList() {
    return this._http.get<any>(this.myAppUrl + 'api/Section/All');
  }
  
  saveSection(status) {
    return this._http.post(this.myAppUrl + 'api/Section/Create', status);
  }

  updateSection(status) {
    return this._http.put(this.myAppUrl + 'api/Section/Edit', status);
  }

  deleteSection(id) {
    return this._http.delete(this.myAppUrl + "api/Section/Delete/" + id);
  }
  
  //UserList
  getUserList() {
    return this._http.get<any>(this.myAppUrl + 'api/User/All');
  }
  
  saveUser(status) {
    return this._http.post(this.myAppUrl + 'api/User/Create', status);
  }

  updateUser(status) {
    return this._http.put(this.myAppUrl + 'api/User/Edit', status);
  }

  deleteUser(id) {
    return this._http.delete(this.myAppUrl + "api/User/Delete/" + id);
  }


  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}  
