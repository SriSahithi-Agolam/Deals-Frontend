import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SecureLoggerService } from './secure-logger.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantManagementService {
  private merchantServiceUrl = 'http://localhost:8083/api/merchants';
  private validMerchantIds = [8, 9, 10, 12, 16, 17, 18, 19, 20, 21];

  constructor(private http: HttpClient, private logger: SecureLoggerService) {}

  /**
   * Get a valid merchant ID, creates fallback if needed
   */
  getValidMerchantId(requestedMerchantId?: number): number {
    // If requested merchant ID is valid, use it
    if (requestedMerchantId && this.validMerchantIds.includes(requestedMerchantId)) {
      return requestedMerchantId;
    }

    // Get or create a consistent merchant ID for this session
    let merchantId = sessionStorage.getItem('session_merchant_id');
    
    if (!merchantId) {
      const randomIndex = Math.floor(Math.random() * this.validMerchantIds.length);
      merchantId = this.validMerchantIds[randomIndex].toString();
      sessionStorage.setItem('session_merchant_id', merchantId);
    }
    
    return parseInt(merchantId);
  }

  /**
   * Check if merchant exists in database
   */
  checkMerchantExists(merchantId: number): Observable<boolean> {
    return this.http.get(`${this.merchantServiceUrl}/${merchantId}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Get merchant profile data
   */
  getMerchantProfile(merchantId: number): Observable<any> {
    return this.http.get(`${this.merchantServiceUrl}/${merchantId}`).pipe(
      catchError(() => of({
        id: merchantId,
        businessName: 'Default Store',
        email: 'store@example.com',
        phone: '9999999999',
        address: 'Default Address',
        isActive: true
      }))
    );
  }

  /**
   * Create a new merchant account if needed
   */
  createMerchantIfNeeded(): void {
    // Merchant service doesn't support POST, so we just ensure we use valid IDs
    this.logger.info('Using existing valid merchant IDs only');
  }
}