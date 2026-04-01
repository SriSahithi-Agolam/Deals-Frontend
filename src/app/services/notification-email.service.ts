import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  sentAt?: Date;
  template?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private notificationQueue: Notification[] = [];

  constructor() {
    this.loadNotifications();
  }

  // Send order confirmation email
  sendOrderConfirmation(email: string, orderId: string, orderDetails: any): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'email',
      recipient: email,
      subject: `Order Confirmation - #${orderId}`,
      message: this.generateOrderConfirmationEmail(orderId, orderDetails),
      status: 'pending',
      createdAt: new Date(),
      template: 'order_confirmation'
    };
    this.queueNotification(notification);
  }

  // Send deal alert
  sendDealAlert(email: string, dealTitle: string, discount: number): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'email',
      recipient: email,
      subject: `🔥 Hot Deal Alert: ${dealTitle}`,
      message: this.generateDealAlertEmail(dealTitle, discount),
      status: 'pending',
      createdAt: new Date(),
      template: 'deal_alert'
    };
    this.queueNotification(notification);
  }

  // Send SMS notification
  sendSMS(phoneNumber: string, message: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'sms',
      recipient: phoneNumber,
      message: message,
      status: 'pending',
      createdAt: new Date()
    };
    this.queueNotification(notification);
  }

  // Send payment confirmation
  sendPaymentConfirmation(email: string, amount: number, transactionId: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'email',
      recipient: email,
      subject: 'Payment Confirmation',
      message: this.generatePaymentConfirmationEmail(amount, transactionId),
      status: 'pending',
      createdAt: new Date(),
      template: 'payment_confirmation'
    };
    this.queueNotification(notification);
  }

  // Send password reset email
  sendPasswordReset(email: string, resetLink: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'email',
      recipient: email,
      subject: 'Password Reset Request',
      message: this.generatePasswordResetEmail(resetLink),
      status: 'pending',
      createdAt: new Date(),
      template: 'password_reset'
    };
    this.queueNotification(notification);
  }

  // Send 2FA code
  send2FACode(email: string, code: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'email',
      recipient: email,
      subject: 'Your 2FA Code',
      message: this.generate2FAEmail(code),
      status: 'pending',
      createdAt: new Date(),
      template: '2fa_code'
    };
    this.queueNotification(notification);
  }

  // Send shipment notification
  sendShipmentNotification(email: string, orderId: string, trackingNumber: string): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'email',
      recipient: email,
      subject: `Your Order #${orderId} Has Been Shipped!`,
      message: this.generateShipmentEmail(orderId, trackingNumber),
      status: 'pending',
      createdAt: new Date(),
      template: 'shipment_notification'
    };
    this.queueNotification(notification);
  }

  private queueNotification(notification: Notification): void {
    this.notificationQueue.push(notification);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.notificationQueue.length === 0) return;

    const notification = this.notificationQueue.shift();
    if (notification) {
      this.sendNotification(notification);
    }
  }

  private sendNotification(notification: Notification): void {
    // Simulate sending notification
    setTimeout(() => {
      notification.status = 'sent';
      notification.sentAt = new Date();
      this.saveNotification(notification);
      this.processQueue();
    }, 1000);
  }

  private saveNotification(notification: Notification): void {
    const current = this.notifications.value;
    current.push(notification);
    this.notifications.next(current);
    localStorage.setItem('notifications', JSON.stringify(current));
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  private loadNotifications(): void {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      this.notifications.next(JSON.parse(saved));
    }
  }

  // Email template generators
  private generateOrderConfirmationEmail(orderId: string, details: any): string {
    return `
      Thank you for your order!
      
      Order ID: ${orderId}
      Total Amount: ₹${details.totalAmount}
      Delivery Address: ${details.deliveryAddress}
      
      Your order will be delivered within 3-5 business days.
      Track your order: https://yourapp.com/tracking/${orderId}
    `;
  }

  private generateDealAlertEmail(dealTitle: string, discount: number): string {
    return `
      🔥 Hot Deal Alert!
      
      ${dealTitle} is now available with ${discount}% discount!
      
      Limited time offer - Don't miss out!
      Shop now: https://yourapp.com/deals
    `;
  }

  private generatePaymentConfirmationEmail(amount: number, transactionId: string): string {
    return `
      Payment Confirmed!
      
      Amount: ₹${amount}
      Transaction ID: ${transactionId}
      
      Your payment has been successfully processed.
    `;
  }

  private generatePasswordResetEmail(resetLink: string): string {
    return `
      Password Reset Request
      
      Click the link below to reset your password:
      ${resetLink}
      
      This link expires in 24 hours.
      If you didn't request this, please ignore this email.
    `;
  }

  private generate2FAEmail(code: string): string {
    return `
      Your 2FA Code: ${code}
      
      This code expires in 10 minutes.
      Do not share this code with anyone.
    `;
  }

  private generateShipmentEmail(orderId: string, trackingNumber: string): string {
    return `
      Your Order Has Been Shipped!
      
      Order ID: ${orderId}
      Tracking Number: ${trackingNumber}
      
      Track your shipment: https://yourapp.com/tracking/${trackingNumber}
    `;
  }
}
