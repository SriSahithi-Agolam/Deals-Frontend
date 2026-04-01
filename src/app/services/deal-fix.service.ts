import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealFixService {
  private dealUrl = 'http://localhost:8084/api/deals';
  private validMerchantIds = [8, 9, 10, 12, 16, 17, 18, 19, 20, 21];

  constructor(private http: HttpClient) {}

  /**
   * Fix all deals with invalid merchant IDs
   */
  fixAllDeals(): Observable<any> {
    return this.http.get<any[]>(this.dealUrl).pipe(
      map(deals => {
        const dealsToFix = deals.filter(deal => 
          !deal.merchantId || 
          !this.validMerchantIds.includes(deal.merchantId)
        );
        
        console.log(`Found ${dealsToFix.length} deals with invalid merchant IDs`);
        
        // Fix each deal
        const fixRequests = dealsToFix.map(deal => this.fixDeal(deal));
        
        return forkJoin(fixRequests);
      }),
      catchError(error => {
        console.error('Error fixing deals:', error);
        return of([]);
      })
    );
  }

  /**
   * Fix a single deal by assigning valid merchant ID
   */
  private fixDeal(deal: any): Observable<any> {
    // Assign a valid merchant ID based on deal category
    const newMerchantId = this.getValidMerchantIdForCategory(deal.category);
    
    const updatedDeal = {
      ...deal,
      merchantId: newMerchantId
    };

    // Update the deal
    return this.http.put(`${this.dealUrl}/${deal.id}`, updatedDeal).pipe(
      catchError(error => {
        console.error(`Error updating deal ${deal.id}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Get appropriate merchant ID based on deal category
   */
  private getValidMerchantIdForCategory(category: string): number {
    const categoryMerchantMap: { [key: string]: number[] } = {
      'Electronics': [8, 10, 16, 17], // Tech-related merchants
      'ELECTRONICS': [8, 10, 16, 17],
      'Food': [18, 19], // Food-related merchants
      'Fashion': [9, 12, 20, 21], // General retail merchants
      'default': [8, 9, 10, 12] // Default merchants
    };

    const possibleMerchants = categoryMerchantMap[category] || categoryMerchantMap['default'];
    const randomIndex = Math.floor(Math.random() * possibleMerchants.length);
    return possibleMerchants[randomIndex];
  }

  /**
   * Get deals with valid merchant IDs only
   */
  getValidDeals(): Observable<any[]> {
    return this.http.get<any[]>(this.dealUrl).pipe(
      map(deals => deals.filter(deal => 
        deal.merchantId && this.validMerchantIds.includes(deal.merchantId)
      )),
      catchError(error => {
        console.error('Error loading deals:', error);
        return of([]);
      })
    );
  }

  /**
   * Create sample deals with valid merchant IDs
   */
  createSampleDeals(): Observable<any> {
    const sampleDeals = [
      {
        title: "50% Off Electronics",
        description: "Amazing discount on all electronics",
        discount: 50.0,
        category: "ELECTRONICS",
        price: 1000.0,
        expiryDate: "2026-12-31",
        merchantId: 8,
        cashbackPoints: 100,
        usageLimit: 100,
        totalUsed: 0,
        couponCode: "ELEC50"
      },
      {
        title: "Pizza Special Deal",
        description: "Get 40% off on all pizzas",
        discount: 40.0,
        category: "Food",
        price: 500.0,
        expiryDate: "2026-12-31",
        merchantId: 19,
        cashbackPoints: 50,
        usageLimit: 50,
        totalUsed: 0,
        couponCode: "PIZZA40"
      },
      {
        title: "Fashion Sale",
        description: "Up to 60% off on fashion items",
        discount: 60.0,
        category: "Fashion",
        price: 2000.0,
        expiryDate: "2026-12-31",
        merchantId: 20,
        cashbackPoints: 150,
        usageLimit: 75,
        totalUsed: 0,
        couponCode: "FASHION60"
      }
    ];

    const createRequests = sampleDeals.map(deal => 
      this.http.post(this.dealUrl, deal).pipe(
        catchError(error => {
          console.error('Error creating deal:', error);
          return of(null);
        })
      )
    );

    return forkJoin(createRequests);
  }
}