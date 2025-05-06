import { EventEmitter,Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static baseUrl = 'http://localhost:9090/api/import-history'; // Base URL for the API
  
  constructor(private http: HttpClient) { }



 getAllHistory(): Observable<any> {
  return this.http.get(`${ApiService.baseUrl}/list`);
}

}
