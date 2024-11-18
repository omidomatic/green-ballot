import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class FormSyncService {
  private apiUrl = 'api/v1/project/cache';
  private userId = ''; // Replace with actual user identification

  constructor(private http: HttpClient, private cs: ConstantsService) {
    this.apiUrl = cs.getAPIUrl() + this.apiUrl;
  }

  syncFormData(formData: any, userId: string): void {
    this.userId = userId;
    this.http
      .post(`${this.apiUrl}`, formData)
      .subscribe({
        next: () => console.log('Form data synchronized with server.'),
        error: (err) => console.error('Error syncing form data:', err),
      });
  }

  fetchFormData(): void {
    this.http
      .get(`${this.apiUrl}?userId=${this.userId}`)
      .subscribe({
        next: (data) => {
          // Handle the fetched data
        },
        error: (err) => console.error('Error fetching form data:', err),
      });
  }
}
