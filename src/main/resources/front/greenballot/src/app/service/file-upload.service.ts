import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  apiURL: string = 'api/v1/project';

  constructor(private http: HttpClient, private cs: ConstantsService) {
    this.apiURL = cs.getAPIUrl() + this.apiURL;
  }

  uploadFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const headers: HttpHeaders = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    // headers.set('Authorization','Bearer '+localStorage.getItem('token'));


    const newRequest = new HttpRequest('POST', this.apiURL + '/upload', formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'text',
    });
    return this.http.request(newRequest);
    // return this.http.post(this.uploadUrl, formData, {
    //   reportProgress: true,
    //   responseType: 'text'
    // });

  }


}
