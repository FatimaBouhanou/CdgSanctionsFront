// src/app/service/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { Sanction } from '../models/sanctions.model';
import { SanctionS } from '../models/sanction-s.model'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private sanctionBaseUrl = environment.sanctionBaseUrl;
  private historyBaseUrl = environment.historyBaseUrl;

  constructor(private http: HttpClient) {}

  // pwc sanctions
  getAllSanctions(): Observable<Sanction[]> {
    return this.http.get<Sanction[]>(`${this.sanctionBaseUrl}/sanctions/list`).pipe(
      catchError(error => this.handleError('Failed to load sanctions', error))
    );
  }

  searchSanctions(name: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.sanctionBaseUrl}/sanctions/search`, {
      params: { name, page: page.toString(), size: size.toString() }
    }).pipe(
      catchError(error => this.handleError('Failed to search sanctions', error))
    );
  }

  //securities
  getAllSecurities(): Observable<SanctionS[]> {
    return this.http.get<SanctionS[]>(`${this.sanctionBaseUrl}/sanctions/securities/list`).pipe(
      catchError(error => this.handleError('Failed to load securities', error))
    );
  }

  searchSecurities(name: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.sanctionBaseUrl}/sanctions/securities/search`, {

      params: { name, page: page.toString(), size: size.toString() }
    }).pipe(
      catchError(error => this.handleError('Failed to search securities', error))
    );
  }

  private handleError(message: string, error: any): Observable<never> {
    console.error(`${message}:`, error);
    return throwError(() => new Error(message));
  }

  //history
  getAllHistory(): Observable<any> {
    return this.http.get(`${this.historyBaseUrl}/import-history/list`);
  }
}


