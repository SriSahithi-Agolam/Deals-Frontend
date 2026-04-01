import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderCleanupService {
  private orderUrl = 'http://localhost:8085/api/orders';

  constructor(private http: HttpClient) {}

  /**
   * Clean up old test orders, keep only recent real orders
   */
  cleanupTestOrders(): Observable<any> {
    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    console.log('Cleaning up orders older than:', todayStr);
    
    // In a real system, you'd call a DELETE endpoint
    // For now, we'll just identify which orders to keep
    return this.http.get(`${this.orderUrl}/admin/all`);
  }

  /**
   * Identify real user orders vs test data
   */
  identifyRealOrders(orders: any[]): any[] {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Keep orders from today and orders with real addresses
    return orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const orderDateStr = orderDate.toISOString().split('T')[0];
      
      // Keep if:
      // 1. Order is from today
      // 2. Address contains real location indicators (hyd, Hyderabad, etc.)
      // 3. Not obvious test data (Test Address, 123 Main St, etc.)
      
      const isToday = orderDateStr === todayStr;
      const hasRealAddress = order.deliveryAddress && (
        order.deliveryAddress.includes('hyd') ||
        order.deliveryAddress.includes('Hyderabad') ||
        order.deliveryAddress.includes('501401')
      );
      const isNotTestAddress = !order.deliveryAddress?.includes('Test Address') &&
                              !order.deliveryAddress?.includes('123 Main St') &&
                              !order.deliveryAddress?.includes('123 Home Street');
      
      return isToday || (hasRealAddress && isNotTestAddress);
    });
  }

  /**
   * Get clean order history for a user
   */
  getCleanOrderHistory(userId: number): Observable<any[]> {
    return new Observable(observer => {
      this.http.get<any[]>(`${this.orderUrl}/user/${userId}`).subscribe(orders => {
        const cleanOrders = this.identifyRealOrders(orders);
        observer.next(cleanOrders);
        observer.complete();
      });
    });
  }
}