import {AfterViewInit, Injectable} from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ChangePasswordRequest} from "../dto/ChangePasswordRequest";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiUrl = 'api/v1/auth';
  passwordUpdateUrl = 'api/v1/users';
  logoutUrl = 'api/v1/auth';

  loginObject: any = {
    email: '',
    password: ''
  }

  registerObject: any = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'USER'
  }

  changePasswordRequest: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  }

  constructor(private cs: ConstantsService, private http: HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
    this.passwordUpdateUrl = cs.getAPIUrl() + this.passwordUpdateUrl;
    this.apiUrl = cs.getAPIUrl() + this.logoutUrl;
  }

  getAccountInfo() {

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`});
    const params = new HttpParams()
      .set('Authorization', localStorage.getItem('access_token')!);

    return this.http.request("get", this.apiUrl + '/getUser', {headers: headers, params: params})

  }

  updateAccountInfo(userInfo: any) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`});
    const body = userInfo;

    console.log(this.apiUrl + '/updateUser');
    return this.http.post(this.apiUrl + '/updateUser', body, {headers: headers});
  }

  updatePassword(passwordInfo: ChangePasswordRequest) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = passwordInfo;
    console.log(this.apiUrl + '/updateUser');
    return this.http.patch(this.passwordUpdateUrl + '/changePassword', passwordInfo, {headers: headers});
  }

  logout() {
    this.http.post<void>(this.logoutUrl + '/logout',{});
  }
}
