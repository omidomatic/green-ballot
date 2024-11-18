import { Injectable } from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";



export interface GreenProject {
  id: number;
  name: string;
  category: string;
  fundingGoal:string;
  startDate:string;
  endDate:string;
  voteCount:number;
  status:string;
}
@Injectable({
  providedIn: 'root'
})
export class GreenProjectService {

  apiUrl='api/v1/project'
  constructor(private cs:ConstantsService,
              private http:HttpClient) {
    this.apiUrl = cs.getAPIUrl()+this.apiUrl;
  }

  getProjectsByUserId(userId: string, page: number, size: number):Observable<any>{
    const params = new HttpParams()
      .set('userId', userId)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl+"/get-projects", { params });
  }

}
