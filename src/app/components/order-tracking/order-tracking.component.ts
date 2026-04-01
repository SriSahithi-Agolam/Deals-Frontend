import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderTrackingService } from '../../services/order-tracking.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tracking-container">
      <h2>Order Tracking</h2>
      <div class="order-list">
        <div class="order-item" *ngFor="let order of orders">
          <div class="order-header">
            <h3>Order #{{order.id}}</h3>
            <span class="status" [class]="getStatusClass(order.status)">{{order.status}}</span>
          </div>
          <div class="status-timeline">
            <div class="step" [class.active]="isStepActive('Processing', order.status)">Processing</div>
            <div class="step" [class.active]="isStepActive('Shipped', order.status)">Shipped</div>
            <div class="step" [class.active]="isStepActive('Delivered', order.status)">Delivered</div>
          </div>
          <p class="timestamp">Last updated: {{order.timestamp | date:'short'}}</p>
          <button (click)="simulateStatusUpdate(order.id)">Simulate Update</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container { padding: 20px; }
    .order-item { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }
    .order-header { display: flex; justify-content: space-between; align-items: center; }
    .status { padding: 5px 10px; border-radius: 15px; color: white; }
    .status.processing { background: #ffa500; }
    .status.shipped { background: #007bff; }
    .status.delivered { background: #28a745; }
    .status-timeline { display: flex; gap: 20px; margin: 15px 0; }
    .step { padding: 8px 12px; background: #f8f9fa; border-radius: 5px; }
    .step.active { background: #007bff; color: white; }
    button { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class OrderTrackingComponent implements OnInit {
  orders: any[] = [];

  constructor(
    private trackingService: OrderTrackingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadOrders();
    this.trackingService.getStatusUpdates().subscribe(updates => {
      this.updateOrderStatuses(updates);
    });
  }

  loadOrders() {
    const storedOrders = JSON.parse(sessionStorage.getItem('orders') || '[]');
    this.orders = storedOrders.map((order: any) => ({
      ...order,
      ...this.trackingService.getOrderStatus(order.id)
    }));
  }

  updateOrderStatuses(updates: any) {
    this.orders.forEach(order => {
      if (updates[order.id]) {
        order.status = updates[order.id].status;
        order.timestamp = updates[order.id].timestamp;
      }
    });
  }

  simulateStatusUpdate(orderId: string) {
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    const currentOrder = this.orders.find(o => o.id === orderId);
    const currentIndex = statuses.indexOf(currentOrder?.status || 'Processing');
    const nextStatus = statuses[Math.min(currentIndex + 1, statuses.length - 1)];
    
    this.trackingService.updateOrderStatus(orderId, nextStatus);
    this.notificationService.sendNotification('Order Update', `Order #${orderId} is now ${nextStatus}`, 'order');
  }

  getStatusClass(status: string) {
    return status.toLowerCase();
  }

  isStepActive(step: string, currentStatus: string) {
    const steps = ['Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(step) <= steps.indexOf(currentStatus);
  }
}