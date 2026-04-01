import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Merchant, Product } from '../models/merchant.model';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private apiUrl = 'http://localhost:8080/api/merchants';

  constructor(private http: HttpClient) {}

  getAllMerchants(): Observable<Merchant[]> {
    return this.http.get<Merchant[]>(this.apiUrl);
  }

  getMerchantById(id: number): Observable<Merchant> {
    return this.http.get<Merchant>(`${this.apiUrl}/${id}`);
  }

  getMerchantProducts(merchantId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${merchantId}/products`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${productId}`);
  }
}
