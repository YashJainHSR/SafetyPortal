import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AlertModule } from './shared'
// used to create fake backend
import { AuthGuard } from './_gaurd';
import { Role } from './_models';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { DatabaseService } from './_services/Database.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from '../material-module';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { NavMenuComponent} from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { SubmitRequestComponent } from './submitrequest/submitrequest.component';
import { SubmittedRequestComponent } from './submitted-request/submitted-request.component';
import { SearchComponent } from './search/search.component';
import { PendingRequestComponent } from './pending-request/pending-request.component';
import { DeletedRequestComponent } from './deleted-request/deleted-request.component';
import { CompletedRequestComponent } from './completed-request/completed-request.component';
import { AllRequestComponent } from './all-request/all-request.component';
import { InboxComponent } from './inbox/inbox.component';
import { DeptListComponent } from './dept-list/dept-list.component';
import { SectionListComponent } from './section-list/section-list.component';
import { AgencyListComponent } from './agency-list/agency-list.component';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';
import { HodListComponent } from './hod-list/hod-list.component';
import { NodalListComponent } from './nodal-list/nodal-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditRequestComponent } from './edit-request/edit-request.component';

import { LoginComponent } from './Login/login.component';
import { MatButtonModule, MatSelectModule, MatCheckboxModule, MatInputModule, MatCardModule, MatIconModule } from '@angular/material';
import { ViewRequestComponent } from './view-request/view-request.component';
import { MatNativeDateModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent, SubmitRequestComponent, SubmittedRequestComponent, SearchComponent, ViewRequestComponent, PendingRequestComponent, DeletedRequestComponent, CompletedRequestComponent, AllRequestComponent, InboxComponent,
    DeptListComponent, SectionListComponent, AgencyListComponent, AssignEmployeeComponent, HodListComponent, NodalListComponent, EmployeeListComponent, UserListComponent,
    HomeComponent, LoginComponent, ResetPasswordComponent, EditRequestComponent
    
  ],
  imports: [
    AgGridModule.withComponents(null), ToastrModule.forRoot(),
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule, CommonModule, AlertModule,
    ReactiveFormsModule,
    FormsModule, BrowserAnimationsModule, MatSelectModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatIconModule, DemoMaterialModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard]  },
      { path: 'submitrequest', component: SubmitRequestComponent, canActivate: [AuthGuard], data: { roles: [Role.User] } },
      { path: 'submittedrequest', component: SubmittedRequestComponent, canActivate: [AuthGuard], data: { roles: [Role.User] } },
      { path: 'submitrequest/:area', component: SubmitRequestComponent},
      { path: 'pendingrequest', component: PendingRequestComponent, canActivate: [AuthGuard] },
      { path: 'completerequest', component: CompletedRequestComponent, canActivate: [AuthGuard] },
      { path: 'deletedrequest', component: DeletedRequestComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] }  },
      { path: 'allrequest', component: AllRequestComponent, canActivate: [AuthGuard] },
      { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard] },
      { path: 'deptlist', component: DeptListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'sectionlist', component: SectionListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'agencylist', component: AgencyListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'assignemployee', component: AssignEmployeeComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'hodlist', component: HodListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'nodallist', component: NodalListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'emplist', component: EmployeeListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'userlist', component: UserListComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin, Role.Safety] } },
      { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [AuthGuard]},
      { path: 'editrequest/:id', component: EditRequestComponent, canActivate: [AuthGuard] },
      { path: 'viewrequest', component: ViewRequestComponent},


      { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: '**', redirectTo: '' }
    ])

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    DatabaseService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
