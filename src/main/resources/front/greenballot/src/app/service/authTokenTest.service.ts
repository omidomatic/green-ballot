import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class AuthTokenTestService {
  apiUrl='api/v1/test';
  constructor(private cs:ConstantsService, private http:HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }
  test(){
    const headers = new HttpHeaders({'Content-Type': 'application/json'
      // , 'Authorization':'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvbWlkcGJ2YkBnbWFpbC5jb20iLCJpYXQiOjE3MjkzNDAyOTgsImV4cCI6MTcyOTQyNjY5OH0.XU4UvcfyxNKXwCS7tDt0MTIXeBoXBAa6hewy5L5S4_Y'
    });

    return this.http.get(this.apiUrl + "/authorization", {headers});
  }
}
