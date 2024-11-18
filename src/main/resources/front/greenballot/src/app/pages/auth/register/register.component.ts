import {Component, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgClass, NgStyle} from "@angular/common";
import {CaptchaComponent} from "../../../util/captcha/captcha.component";
import {AuthenticationService} from "../../../service/authentication.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    Button,
    CardModule,
    CheckboxModule,
    PasswordModule,
    FormsModule,
    NgStyle,
    NgClass,
    CaptchaComponent
  ],
  providers: [MessageService, CaptchaComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  userDetails: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    repeatPassword: '',
    walletAddress: '',
    role: 'USER'
  }


  @ViewChild(CaptchaComponent) captcha!: CaptchaComponent;

  constructor(private authService: AuthenticationService,
              private messageService: MessageService,
              private router: Router,
  ) {
  }

  register() {
    if (this.captcha.isValidated) {
      this.authService.register(this.userDetails).subscribe(
        {
          next: (res: any) => {
            console.log('Access token:', res.access_token);
            localStorage.setItem('access_token', res.access_token);
            this.messageService.add({
              severity: 'success',
              summary: 'Register Successful',
              detail: 'You are successfully logged in!',
            });

            this.router.navigate(['/landing'], {queryParams: {loggedIn: true}});
          },
          error: (err) => {
            console.error('Login error:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Register Failed',
              detail: 'Registration failed. Please try again.',
            });
          }
        });
    }else{
      this.messageService.add({
        severity: 'warn',
        summary: 'Captcha Failed!',
        detail: 'Please reenter captcha.',
      });
    }
  }
}
