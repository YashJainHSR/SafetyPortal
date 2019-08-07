import { Component, OnInit, ViewChild} from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';
@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  banner: any = "/assets/frontbanner.png";
  imgURL: string = "/assets/front.jpg";
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  show() {
    const el = document.querySelector('#inputPassword') as HTMLElement;
    if (el.getAttribute('type') == 'password') {
      el.setAttribute('type', 'text');
    }
    else {
      el.setAttribute('type', 'password');
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
      data => {
        this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
      });
    
  }
  hr() {
    this.router.navigate(['submitrequest/HR']);
  }
  cr() {
    this.router.navigate(['submitrequest/CR']);
  }
  check() {
    this.router.navigate(['viewrequest']);
  }
}
