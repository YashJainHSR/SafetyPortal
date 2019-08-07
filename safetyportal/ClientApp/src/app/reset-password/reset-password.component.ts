import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../_services/Database.service';
import { AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';
import { User, Role } from '../_models/index';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent implements OnInit {
  resetpassword: FormGroup;
  currentUser: User;
  currentUserEdit: User;
  public error: string;
  submitted: boolean;
  constructor(private _databaseService: DatabaseService, private fb: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);  }
  ngOnInit() {
    this.submitted = false;
    this.resetpassword = this.fb.group({
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
    });

  }

  onSubmit() {
    this.submitted = true;
    if (this.resetpassword.invalid) {
      this.error = "Please Enter the Password";
      return;
    }
    else if (this.resetpassword.controls.password.value != this.resetpassword.controls.cpassword.value) {
      this.error = "Please Check the Password";
    }
    else {
      this.currentUserEdit = this.currentUser;
      this.currentUserEdit.password = this.resetpassword.controls.password.value;
      this.currentUserEdit.token = "";
      this._databaseService.updateCredentials(this.currentUserEdit).subscribe(() => {
        this.ngOnInit();
        this.router.navigate(['/']);
      });
      this.error ="Password Changed Successfully"
    }
  }
 
}

