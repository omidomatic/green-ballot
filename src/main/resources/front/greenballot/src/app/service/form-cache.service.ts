import {Injectable} from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormCacheService {
  private storageKey = 'project-details';
  apiURL = "api/v1/project";

  constructor(private cs: ConstantsService, private http: HttpClient) {
    this.apiURL = cs.getAPIUrl() + this.apiURL;
  }

  saveProjectDetails(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getProjectDetails(userId: string): Observable<any> {
    const cachedData = localStorage.getItem(this.storageKey);

    if (cachedData) {
      return of(JSON.parse(cachedData));
    } else {
      const httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
      return this.http.get<any>(`${this.apiURL}/cache?userId=${userId}`, {headers: httpHeaders}).pipe(
        map(response => {
          this.saveProjectDetails(response);
          return response;
        }),
        catchError(error => {
          console.error("Failed to retrieve project details from server:", error);
          return of(null);
        })
      );
    }
  }

  clearServerCache(userId: string) {
    const body = {
      userId: userId
    }
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(this.apiURL + "/clear-cache",body,{headers:headers});
  }

  clearProjectDetails(): void {
    localStorage.removeItem(this.storageKey);
  }
}
