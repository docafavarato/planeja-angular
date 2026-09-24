import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CardDataForm, CardDetails } from './card-data'
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/cards'

  create(data: CardDataForm) : Observable<CardDetails> {
    return this.http.post<CardDetails>(this.baseUrl, data);
  }

  list(page: number = 0, size: number = 10) : Observable<PageResult<CardDetails>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<CardDetails>>(url);
  }

  getById(id: String) : Observable<CardDetails> {
    return this.http.get<CardDetails>(`${this.baseUrl}/${id}`);
  }

  update(id: string, data: CardDataForm) : Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data)
  }

  changeStatus(id: string) : Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, null)
  }
}
