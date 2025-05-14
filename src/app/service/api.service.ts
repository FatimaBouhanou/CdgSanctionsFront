import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
 // Adjust if needed

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private sanctionBaseUrl = environment.sanctionBaseUrl; // http://localhost:8080/api
  private historyBaseUrl = environment.historyBaseUrl;   // http://localhost:9090/api

  constructor(private http: HttpClient) { }

  // Get list of import history from 9090
  getAllHistory(): Observable<any> {
    return this.http.get(`${this.historyBaseUrl}/import-history/list`);
  }

  // Get sanctions by name from 8080
  getSanctionsByName(name: string): Observable<any> {
    return this.http.get(`${this.sanctionBaseUrl}/sanctions/search`, {
      params: { name }
    });
  }
  getAllSanctions(): Observable<any> {
    return this.http.get(`${this.sanctionBaseUrl}/sanctions/list`);
  }

}
