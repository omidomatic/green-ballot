import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CardModule} from "primeng/card";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {Button, ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {AuthenticationService} from "../../../service/authentication.service";
import {HttpClient, HttpRequest} from "@angular/common/http";
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {RippleModule} from "primeng/ripple";
import {Router} from "@angular/router";
import {LandingComponent} from "../../landing/landing.component";
import {CaptchaComponent} from "../../../util/captcha/captcha.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    PasswordModule,
    FormsModule,
    Button,
    CheckboxModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    CaptchaComponent,
  ],
  providers: [MessageService, CaptchaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements AfterViewInit  {

  password!: string;
  email!: string;

  rememberToggle: boolean = false;
  isLoggedIn:boolean=false;

  @ViewChild(CaptchaComponent) captcha!: CaptchaComponent;
  constructor(private auth: AuthenticationService,
              private messageService: MessageService,
              private router: Router,
              private cdr: ChangeDetectorRef,

              ) {
  }

  ngOnInit(): void {
    // Check if token exists but move the logic to AfterViewInit
    const token = localStorage.getItem('access_token');
    if (token) {
      // Store token check result to use it in AfterViewInit
      this.isLoggedIn = true;
    }

  }

  ngAfterViewInit(): void {
    if (this.isLoggedIn) {
      // Show toast message after the view is initialized
      this.messageService.add({
        severity: 'info',
        summary: 'Already Logged In',
        detail: "You're already logged in!",
      });

      // Ensure the change detection runs
      this.cdr.detectChanges();

      // Redirect after 3 seconds
      setTimeout(() => {
        this.redirectToLandingPage();
      }, 3000);
    }
  }
  redirectToLandingPage() {
    this.router.navigate(['/landing']);
  }

  login() {
    if(this.captcha.isValidated) {
      this.auth.login(this.email, this.password).subscribe(
        {
          next: (res) => {
            console.log('Access token:', res.access_token);
            localStorage.setItem('access_token', res.access_token);
            this.messageService.add({
              severity: 'success',
              summary: 'Login Successful',
              detail: 'You are successfully logged in!',
            });

            this.router.navigate(['/landing'], {queryParams: {loggedIn: true}});
          },
          error: (err) => {
            console.error('Login error:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Login Failed',
              detail: 'Invalid credentials. Please try again.',
            });
          }
        });
    }else{
      this.messageService.add({
        severity: 'Error',
        summary: 'Captcha Failed',
        detail: 'Invalid captcha. Please try again.',
      });
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
}
