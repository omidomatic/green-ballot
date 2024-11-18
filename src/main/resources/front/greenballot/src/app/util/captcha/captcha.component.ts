import {Component, OnInit, Output} from '@angular/core';
import {CaptchaService} from "../../service/captcha.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,

  ],
  providers: [MessageService]
})
export class CaptchaComponent implements OnInit {
  captchaUrl: any;
  userInputCaptcha: string = '';
  captchaUUID: string = '';
  @Output()
  isValidated: boolean = false;

  constructor(
    private messageService: MessageService,
    private captchaService: CaptchaService,
  ) {
  }

  ngOnInit(): void {
    this.fetchCaptcha();
    this.userInputCaptcha = '';
  }

  fetchCaptcha() {
    this.captchaService.getCaptcha().subscribe(response => {
      this.captchaUrl = response.data; // Set the captcha image URL from the response
      this.captchaUUID = response.captchaId;
      // console.log(response.data);
    });
  }

  validateCaptcha() {
    if (this.userInputCaptcha.length == 5) {
      this.captchaService.validateCaptcha(this.captchaUUID, this.userInputCaptcha).subscribe(resp => {
        if (resp.status == "success") {
          this.isValidated = true;
          console.log('captcha validation set ' + this.isValidated);
        } else {
          console.log(resp.status);
          this.messageService.add({
            severity: 'error',
            summary: 'Incorrect Captcha',
            detail: 'Please enter the captcha again.',
          });
          this.fetchCaptcha();
        }
      });
    }
  }
}
