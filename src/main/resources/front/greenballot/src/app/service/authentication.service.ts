import {Injectable} from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  apiUrl = 'api/v1/auth';

  loginObject: any = {
    email: '',
    password: ''
  }

  constructor(private cs: ConstantsService, private http: HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }

  login(email: string, password: string) {
    var credentials = {
      "email": email,
      "password": password
    };
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const bodyy = credentials;
    return this.http.post<any>(this.apiUrl + "/authenticate", bodyy, {headers});
  }

  register(userDetails: any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const bodyy =
      {
        "firstname": userDetails.firstname,
        "lastname": userDetails.lastname,
        "email": userDetails.email,
        "walletAddress":userDetails.walletAddress,
        "password": userDetails.password,
        "role": userDetails.role
      };
    // console.log(JSON.stringify(bodyy))
    return this.http.request('post', this.apiUrl + "/register", {
      headers,
      body: JSON.stringify(bodyy)
    });
  }


}
