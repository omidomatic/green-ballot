import {Injectable} from '@angular/core';
import {ConstantsService} from "./constants.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  apiUrl = "api/v1/voting";

  constructor(private cs: ConstantsService,
              private http: HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }

  castVote(userId: number, projectId: string, vote:string): Observable<any> {
    const body = {
      "userId": userId,
      "projectId": projectId,
      "vote": vote
    }
    return this.http.post(this.apiUrl + "/vote", body, {headers: {"Content-Type": "application/json"}});
  }

}
