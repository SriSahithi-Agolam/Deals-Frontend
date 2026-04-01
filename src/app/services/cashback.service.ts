import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CashbackBalance } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CashbackService {
  private apiUrl = 'http://localhost:8080/api/cashback';

  constructor(private http: HttpClient) {}

  getBalance(userId: number): Observable<CashbackBalance> {
    return this.http.get<CashbackBalance>(`${this.apiUrl}/balance/${userId}`);
  }

  redeemPoints(userId: number, points: number): Observable<CashbackBalance> {
    return this.http.post<CashbackBalance>(`${this.apiUrl}/redeem`, { userId, points });
  }
}
