import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface StoredOrder {
  id: number;
  userId: number;
  merchantId: number;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: string;
  deliveryAddress: string;
  orderDate: string;
  paymentMethod: string;
  orderItems: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderStorageService {
  private orders: StoredOrder[] = [];
  private ordersSubject = new BehaviorSubject<StoredOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  addOrder(order: any): StoredOrder {
    const newOrder: StoredOrder = {
      id: Date.now(), // Simple ID generation
      ...order,
      orderDate: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    this.orders.push(newOrder);
    this.ordersSubject.next([...this.orders]);
    this.saveToStorage();
    return newOrder;
  }

  getOrdersByUserId(userId: number): StoredOrder[] {
    return this.orders.filter(order => order.userId === userId);
  }

  private saveToStorage(): void {
    sessionStorage.setItem('orders', JSON.stringify(this.orders));
  }

  private loadFromStorage(): void {
    const saved = sessionStorage.getItem('orders');
    if (saved) {
      this.orders = JSON.parse(saved);
      this.ordersSubject.next([...this.orders]);
    }
  }
}