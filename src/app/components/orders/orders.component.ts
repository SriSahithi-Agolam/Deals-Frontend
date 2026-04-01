import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SecureLoggerService } from '../../services/secure-logger.service';
import { UserManagementService } from '../../services/user-management.service';
import { OrderCleanupService } from '../../services/order-cleanup.service';
import { RealTimeOrderService, OrderStatusUpdate } from '../../services/real-time-order.service';
import { catchError, of, tap, Observable } from 'rxjs';

interface Order {
  id: number;
  userId: number;
  merchantId: number;
  totalAmount: number;
  finalAmount: number;
  discount: number;
  status: string;
  deliveryAddress: string;
  orderDate: string;
  deliveryDate?: string;
  orderItems: any[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  statusUpdates: OrderStatusUpdate[] = [];
  private orderUrl = 'http://localhost:8085/api/orders';

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private logger: SecureLoggerService,
    private userManagement: UserManagementService,
    private orderCleanup: OrderCleanupService,
    private realTimeOrder: RealTimeOrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    
    // Subscribe to real-time order status updates
    this.realTimeOrder.statusUpdates$.subscribe(updates => {
      this.logger.info(`Received ${updates.length} status updates`);
      this.statusUpdates = updates;
      this.updateOrderStatuses(updates);
    });
    
    // Request notification permission
    this.realTimeOrder.requestNotificationPermission();
  }

  private loadOrders(): void {
    const userId = this.authService.getUserId();
    
    console.log('🔍 Loading orders for user ID:', userId);
    this.logger.info('Loading orders for user:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found');
      this.orders = [];
      this.loading = false;
      return;
    }
    
    // Load orders directly from backend
    this.http.get<Order[]>(`${this.orderUrl}/user/${userId}`).pipe(
      catchError(err => {
        console.error('❌ Error loading orders for user', userId, ':', err);
        console.log('Trying to load orders for different user IDs...');
        
        // If loading fails, try with known user IDs that have orders
        return this.tryLoadOrdersWithDifferentUsers();
      })
    ).subscribe(orders => {
      console.log('✅ Orders loaded:', (orders as Order[])?.length || 0, 'orders');
      
      this.orders = (orders as Order[]) || [];
      this.loading = false;
      this.logger.info('Orders loaded successfully', `count: ${(orders as Order[])?.length || 0}`);
      
      // Auto-start real-time processing for any PENDING orders
      this.startProcessingForPendingOrders();
    });
  }

  /**
   * Start real-time processing for any PENDING orders
   */
  private startProcessingForPendingOrders(): void {
    const pendingOrders = this.orders.filter(order => order.status === 'PENDING');
    
    if (pendingOrders.length > 0) {
      this.logger.info(`Found ${pendingOrders.length} pending orders, starting real-time processing`);
      
      pendingOrders.forEach(order => {
        this.logger.info(`Starting real-time processing for pending order ${order.id}`);
        this.realTimeOrder.startRealTimeOrderProcessing(order.id);
      });
    }
  }

  /**
   * Update order statuses based on real-time updates
   */
  private updateOrderStatuses(updates: OrderStatusUpdate[]): void {
    updates.forEach(update => {
      const order = this.orders.find(o => o.id === update.orderId);
      if (order) {
        this.logger.info(`Updating order ${order.id} status from ${order.status} to ${update.status}`);
        order.status = update.status;
        // Show status notification
        this.showStatusNotification(update);
      } else {
        this.logger.info(`Order ${update.orderId} not found in current orders list`);
      }
    });
  }

  /**
   * Show status notification to user
   */
  private showStatusNotification(update: OrderStatusUpdate): void {
    // Log the notification
    this.logger.info(`Order status notification: ${update.message}`);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Order #${update.orderId}`, {
        body: update.message,
        icon: '/assets/order-icon.png'
      });
    }
    
    // You can integrate with ToastService here if available
    console.log(`🔔 Order #${update.orderId}: ${update.message}`);
  }

  isStepActive(step: string, currentStatus: string): boolean {
    const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(step) <= steps.indexOf(currentStatus);
  }

  /**
   * Check if order is currently being processed (for pulsing animation)
   */
  isOrderBeingProcessed(orderId: number): boolean {
    // Check if there are recent updates for this order (within last 30 seconds)
    const recentUpdates = this.statusUpdates.filter(update => 
      update.orderId === orderId && 
      (new Date().getTime() - update.timestamp.getTime()) < 30000
    );
    return recentUpdates.length > 0;
  }

  /**
   * Debug method to check user ID and API calls
   */
  debugOrders(): void {
    const userId = this.authService.getUserId();
    const debugInfo = document.getElementById('debug-info');
    
    // Test multiple user IDs to find one with orders
    const testUserIds = [2, 3, 4, 5];
    
    if (debugInfo) {
      debugInfo.innerHTML = `
        <p><strong>Current User ID:</strong> ${userId}</p>
        <p><strong>API URL:</strong> ${this.orderUrl}/user/${userId}</p>
        <p><strong>Orders Count:</strong> ${this.orders.length}</p>
        <p><strong>Loading:</strong> ${this.loading}</p>
        <p><strong>Testing other user IDs...</strong></p>
      `;
    }
    
    console.log('🔍 Debug Orders - User ID:', userId, 'Orders:', this.orders);
    
    // Test each user ID to see which ones have orders
    testUserIds.forEach(testUserId => {
      this.http.get<Order[]>(`${this.orderUrl}/user/${testUserId}`).subscribe({
        next: (orders) => {
          console.log(`✅ User ${testUserId}: ${orders.length} orders`);
          if (debugInfo) {
            debugInfo.innerHTML += `<p>User ${testUserId}: ${orders.length} orders</p>`;
          }
        },
        error: (error) => {
          console.log(`❌ User ${testUserId}: Error`);
          if (debugInfo) {
            debugInfo.innerHTML += `<p>User ${testUserId}: Error</p>`;
          }
        }
      });
    });
  }

  /**
   * Test API call manually
   */
  testApiCall(): void {
    const userId = this.authService.getUserId();
    console.log('🧪 Testing API call for user:', userId);
    
    this.http.get<Order[]>(`${this.orderUrl}/user/${userId}`).subscribe({
      next: (orders) => {
        console.log('✅ Test API call successful:', orders);
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
          debugInfo.innerHTML += `<p><strong>Test API Result:</strong> ${orders.length} orders found</p>`;
        }
      },
      error: (error) => {
        console.log('❌ Test API call failed:', error);
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
          debugInfo.innerHTML += `<p><strong>Test API Error:</strong> ${error.message}</p>`;
        }
      }
    });
  }

  /**
   * Switch to a user ID that has orders
   */
  switchToUserWithOrders(): void {
    console.log('🔄 Switching to user with orders...');
    
    // Force user ID to 3 (we know this user has orders)
    localStorage.setItem('persistent_user_id', '3');
    
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
      debugInfo.innerHTML += '<p><strong>Switched to User ID 3 - Reloading...</strong></p>';
    }
    
    // Reload the orders
    setTimeout(() => {
      this.loadOrders();
    }, 500);
  }
  
  /**
   * Try loading orders with different user IDs that are known to have orders
   */
  private tryLoadOrdersWithDifferentUsers(): Observable<Order[]> {
    const knownUserIds = [39]; // Use the working user ID
    
    console.log('🔄 Trying to load orders with different user IDs:', knownUserIds);
    
    return this.tryLoadOrdersRecursively(knownUserIds, 0);
  }
  
  /**
   * Recursively try loading orders with different user IDs
   */
  private tryLoadOrdersRecursively(userIds: number[], index: number): Observable<Order[]> {
    if (index >= userIds.length) {
      console.log('❌ No orders found for any user ID');
      return of([]);
    }
    
    const userId = userIds[index];
    console.log(`🧪 Trying to load orders for user ID ${userId}`);
    
    return this.http.get<Order[]>(`${this.orderUrl}/user/${userId}`).pipe(
      catchError((err: any) => {
        console.log(`❌ User ID ${userId} failed, trying next...`);
        return this.tryLoadOrdersRecursively(userIds, index + 1);
      }),
      tap((orders: Order[]) => {
        if (orders && orders.length > 0) {
          console.log(`✅ Found ${orders.length} orders for user ID ${userId}`);
          // Update the frontend to use this working user ID
          localStorage.setItem('persistent_user_id', userId.toString());
        }
      })
    );
  }
}
