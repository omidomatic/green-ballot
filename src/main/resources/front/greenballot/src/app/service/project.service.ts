import { Injectable } from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiUrl = 'api/v1/project';
  constructor(private cs: ConstantsService, private http: HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }

  submitNewProject(projectDetails:any){
    const  headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post(this.apiUrl+'/new',projectDetails,{headers:headers});
  }


}
