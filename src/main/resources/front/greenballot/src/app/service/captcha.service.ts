import {Injectable} from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  apiUrl = 'api/v1/captcha'

  constructor(private cs: ConstantsService, private http: HttpClient) {
    this.apiUrl = this.cs.getAPIUrl() + this.apiUrl;
  }

  getCaptcha(): Observable<any> {
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    // headers.set('Authorization', 'bearer ' + localStorage.getItem('token'))
    return this.http.get(this.apiUrl + '/generateCaptcha');

  }

  validateCaptcha(captchaId: String, userInput: String): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = {
      "captchaId": captchaId,
      "userInput": userInput
    };
    return this.http.request('post', this.apiUrl + '/validateCaptcha', {
      headers,
      body: JSON.stringify(body),
    });
  }
}
