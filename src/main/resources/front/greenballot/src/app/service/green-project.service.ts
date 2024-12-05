import {Injectable} from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";


export interface GreenProject {
  id: number;
  name: string;
  category: string;
  fundingGoal: string;
  startDate: string;
  endDate: string;
  voteCount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class GreenProjectService {

  apiUrl = 'api/v1/project'

  constructor(private cs: ConstantsService,
              private http: HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }

  getProjectsByUserId(userId: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl + "/get-projects", {params});
  }

  getProjectByStatus(status:string,page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('projectStatus',status)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl + "/get-project-by-status", {params});
  }

  verifyProject(id:number) {
    return this.http.post(this.apiUrl + "/verify",id,{
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getProjectById(id:number){
    const params = new HttpParams()
      .set('id',id)
    return this.http.get(this.apiUrl + "/get-project",{params});
  }
  rejectProject(id: number) {
    return this.http.post<any>(this.apiUrl + "/reject", id,{
      headers: { 'Content-Type': 'application/json' }});
  }

  deleteProject(id:number) {
    return this.http.post(this.apiUrl + "/delete",id,{
      headers: { 'Content-Type': 'application/json' }
    });
  }

  downloadFile(filename:string):Observable<any>{
    var headers = new HttpHeaders().set('Content-Type', 'application/json');

    // headers.set('Authorization', 'bearer ' + localStorage.getItem('token'))
    return this.http.get(this.apiUrl + '/featured-image/'+filename);

  }

  getFeaturedImage(fileName: string):Observable<Blob> {
    return this.http.get(`${this.apiUrl}/featured-image/${fileName}`, {
      responseType: 'blob', // Fetch binary data
    });
  }
}
