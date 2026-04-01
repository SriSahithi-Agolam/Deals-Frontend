import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<any[]>([]);

  constructor() {
    // Notifications will only be triggered by actual events
  }

  startRealTimeNotifications() {
    // Send random deal alerts every 1 second for real-time demo
    interval(1000).subscribe(() => {
      const dealAlerts = [
        { title: '🔥 LIVE: Flash Sale!', message: 'Electronics 70% OFF - Only 5 minutes left!', category: 'Electronics' },
        { title: '⚡ BREAKING: Lightning Deal!', message: 'Fashion BOGO - Ending in 3 minutes!', category: 'Fashion' },
        { title: '🎯 URGENT: New Merchant!', message: 'FreshMart 50% OFF - First 100 customers!', category: 'Food' },
        { title: '🛍️ LIVE DEAL: Trending!', message: 'Home & Garden 80% OFF - Stock running low!', category: 'Electronics' },
        { title: '⏰ FINAL CALL!', message: 'Deal expires in 2 minutes - Last chance!', category: 'Fashion' },
        { title: '💎 VIP ALERT!', message: 'Premium members 60% OFF - Exclusive access!', category: 'Books' },
        { title: '🎉 WEEKEND FLASH!', message: 'All categories 25% OFF - Live now!', category: 'Travel' },
        { title: '🚀 HOT DEAL LIVE!', message: 'Travel packages ₹999 - Booking fast!', category: 'Travel' },
        { title: '💰 CASHBACK LIVE!', message: '20% instant cashback - Active now!', category: 'Electronics' },
        { title: '🎁 GIFT ALERT!', message: 'Free gifts with ₹2000+ orders - Live!', category: 'Fashion' },
        { title: '📱 TECH FLASH!', message: 'Smartphones 60% OFF - Limited stock!', category: 'Electronics' },
        { title: '👗 FASHION LIVE!', message: 'Designer wear 45% OFF - Trending now!', category: 'Fashion' }
      ];
      const randomAlert = dealAlerts[Math.floor(Math.random() * dealAlerts.length)];
      this.sendNotification(randomAlert.title, randomAlert.message, 'deal', `/deals?category=${randomAlert.category}`);
    });
  }

  sendNotification(title: string, message: string, type: 'deal' | 'order' | 'general' = 'general', actionUrl?: string) {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      actionUrl: actionUrl || '/deals'
    };
    
    const current = this.notifications.value;
    current.unshift(notification);
    this.notifications.next(current);

    // Browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(title, { 
        body: message,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkZENzAwIi8+Cjwvc3ZnPgo=',
        tag: 'deals-app'
      });
    }
  }

  getNotifications() {
    return this.notifications.asObservable();
  }

  markAsRead(id: string) {
    const current = this.notifications.value;
    const notification = current.find(n => n.id === id);
    if (notification) notification.read = true;
    this.notifications.next(current);
  }

  requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }
}