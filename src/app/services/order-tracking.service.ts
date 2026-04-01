import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {
  private statusUpdates = new BehaviorSubject<any>({});

  constructor() {
    // Start real-time tracking after a short delay
    setTimeout(() => {
      this.startRealTimeTracking();
    }, 3000);
  }

  startRealTimeTracking() {
    // Simulate real-time order status updates every 20 seconds
    interval(20000).subscribe(() => {
      const orders = JSON.parse(sessionStorage.getItem('orders') || '[]');
      if (orders.length > 0) {
        const randomOrder = orders[Math.floor(Math.random() * orders.length)];
        const statusUpdates = [
          { status: 'LIVE: Order Confirmed', message: 'Your order confirmed - Processing now!' },
          { status: 'LIVE: Payment Verified', message: 'Payment successful - Order activated!' },
          { status: 'LIVE: Kitchen Preparing', message: 'Chef started preparing your order!' },
          { status: 'LIVE: Quality Check', message: 'Order passing quality inspection!' },
          { status: 'LIVE: Packed & Ready', message: 'Order packed - Dispatch in progress!' },
          { status: 'LIVE: Out for Pickup', message: 'Delivery partner assigned - Picking up!' },
          { status: 'LIVE: In Transit', message: 'Order on the way - ETA 15 minutes!' },
          { status: 'LIVE: Nearby Location', message: 'Delivery partner 2km away!' },
          { status: 'LIVE: At Your Door', message: 'Delivery partner at your location!' },
          { status: 'DELIVERED', message: 'Order delivered successfully!' }
        ];
        const randomUpdate = statusUpdates[Math.floor(Math.random() * statusUpdates.length)];
        this.updateOrderStatus(randomOrder.id, randomUpdate.status);
      }
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    const current = this.statusUpdates.value;
    current[orderId] = { status, timestamp: new Date() };
    this.statusUpdates.next(current);
    
    // Send notification for status change
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🚚 Order Update', {
        body: `Order #${orderId} is now ${status}`,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDA3QkZGIi8+Cjwvc3ZnPgo=',
        tag: 'order-tracking'
      });
    }
  }

  getOrderStatus(orderId: string) {
    return this.statusUpdates.value[orderId] || { status: 'Processing', timestamp: new Date() };
  }

  getStatusUpdates() {
    return this.statusUpdates.asObservable();
  }
}