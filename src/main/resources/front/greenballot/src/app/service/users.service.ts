import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = 'api/v1/users';

  constructor(private cs: ConstantsService, private http: HttpClient) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }

  updateUserRole(id: number, newRole: string) {
    const body = {
      "id": id,
      "newRole": newRole
    }
    return this.http.patch(this.apiUrl + "/change-role", body)
  }

}
