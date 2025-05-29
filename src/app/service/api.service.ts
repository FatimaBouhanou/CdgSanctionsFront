// src/app/service/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { Sanction } from '../models/sanctions.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private sanctionBaseUrl = environment.sanctionBaseUrl;
  private historyBaseUrl = environment.historyBaseUrl;

  constructor(private http: HttpClient) {}

  getAllHistory(): Observable<any> {
    return this.http.get(`${this.historyBaseUrl}/import-history/list`);
  }

  getAllSanctions(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.sanctionBaseUrl}/sanctions/list`).pipe(
      catchError(error => this.handleError('Failed to load sanctions', error))
    );
  }

  searchSanctions(name: string): Observable<any>;
  searchSanctions(name: string, page: number, size: number): Observable<any>;
  searchSanctions(name: string, page?: number, size?: number): Observable<any> {
    const params: any = { name };
    if (page !== undefined && size !== undefined) {
      params.page = page.toString();
      params.size = size.toString();
    }

    return this.http.get<any>(`${this.sanctionBaseUrl}/sanctions/search`, { params }).pipe(
      catchError(error => this.handleError('Failed to search sanctions', error))
    );
  }

  private handleError(message: string, error: any): Observable<never> {
    console.error(`${message}:`, error);
    return throwError(() => new Error(message));
  }
}
