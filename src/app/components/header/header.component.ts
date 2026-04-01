import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          <h2>Deals & Coupons</h2>
        </div>
        <nav class="nav-menu" *ngIf="isLoggedIn">
          <a routerLink="/deals" routerLinkActive="active">Deals</a>
          <a routerLink="/merchants" routerLinkActive="active">Merchants</a>
          <a routerLink="/orders" routerLinkActive="active">Orders</a>
          <a routerLink="/tracking" routerLinkActive="active">Track Orders</a>
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <a routerLink="/wishlist" routerLinkActive="active" class="wishlist-link">
            🤍 Wishlist ({{wishlistCount}})
          </a>
          <a routerLink="/cart" routerLinkActive="active" class="cart-link">
            🛒 Cart ({{cartCount}})
          </a>
          <a routerLink="/admin" routerLinkActive="active" *ngIf="userRole === 'ADMIN'">Admin Panel</a>
          <a routerLink="/merchant" routerLinkActive="active" *ngIf="userRole === 'MERCHANT'">Dashboard</a>
        </nav>
        <div class="auth-menu" *ngIf="!isLoggedIn">
          <a routerLink="/login" class="auth-link">Login</a>
          <a routerLink="/register" class="auth-link">Sign Up</a>
        </div>
        <div class="user-menu" *ngIf="isLoggedIn">
          <div class="notifications" (click)="toggleNotifications()">
            🔔 ({{unreadCount}})
          </div>
          <span class="user-role">{{userRole}}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      color: #2d3436;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid #f1f3f5;
    }
    
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      height: 70px;
      padding: 0 30px;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #ff6b35 0%, #f7b731 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }
    
    .logo::before {
      content: '🎁';
      font-size: 32px;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    
    .nav-menu {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .nav-menu a {
      color: #636e72;
      text-decoration: none;
      padding: 10px 18px;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;
      font-size: 15px;
    }
    
    .nav-menu a:hover, .nav-menu a.active {
      background: #fff5f0;
      color: #ff6b35;
      transform: translateY(-2px);
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-role {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
    }
    
    .logout-btn {
      background: linear-gradient(135deg, #fc5c65 0%, #eb3b5a 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(252, 92, 101, 0.3);
    }
    
    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(252, 92, 101, 0.4);
    }
    
    .auth-menu {
      display: flex;
      gap: 12px;
    }
    
    .auth-link {
      color: #ff6b35;
      text-decoration: none;
      padding: 10px 24px;
      border: 2px solid #ff6b35;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 600;
    }
    
    .auth-link:hover {
      background: #ff6b35;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    
    .cart-link {
      background: linear-gradient(135deg, #ff6b35 0%, #f7b731 100%) !important;
      color: white !important;
      border: none !important;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    
    .cart-link:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4) !important;
    }
    
    .wishlist-link {
      background: linear-gradient(135deg, #fd79a8 0%, #fc5c65 100%) !important;
      color: white !important;
      border: none !important;
      box-shadow: 0 4px 12px rgba(253, 121, 168, 0.3);
    }
    
    .wishlist-link:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 16px rgba(253, 121, 168, 0.4) !important;
    }
    
    .notifications {
      cursor: pointer;
      padding: 10px 14px;
      background: linear-gradient(135deg, #a55eea 0%, #8854d0 100%);
      color: white;
      border-radius: 10px;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(165, 94, 234, 0.3);
      position: relative;
    }
    
    .notifications:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 16px rgba(165, 94, 234, 0.4);
    }
    
    .notifications::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      background: #fc5c65;
      border-radius: 50%;
      border: 2px solid white;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
    }
    
    @media (max-width: 968px) {
      .nav-container {
        flex-wrap: wrap;
        height: auto;
        padding: 15px 20px;
      }
      
      .nav-menu {
        order: 3;
        width: 100%;
        margin-top: 15px;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .logo h2 {
        font-size: 20px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;
  cartCount = 0;
  wishlistCount = 0;
  unreadCount = 0;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService, private wishlistService: WishlistService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Initialize login state
    this.isLoggedIn = this.authService.isAuthenticated();
    this.userRole = this.authService.getUserRole();
    
    // Subscribe to token changes
    this.authService.token$.subscribe(token => {
      this.isLoggedIn = !!token;
      this.userRole = this.authService.getUserRole();
    });
    
    this.cartService.cart$.subscribe(items => {
      this.cartCount = this.cartService.getCartCount();
    });
    
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistCount = this.wishlistService.getWishlistCount();
    });
    
    this.notificationService.getNotifications().subscribe(notifications => {
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  toggleNotifications() {
    // Remove existing panel if open
    const existingPanel = document.getElementById('notification-panel');
    if (existingPanel) {
      existingPanel.remove();
      return;
    }
    
    // Create a live updating notification panel
    const notificationPanel = document.createElement('div');
    notificationPanel.id = 'notification-panel';
    notificationPanel.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      width: 350px;
      max-height: 500px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      overflow-y: auto;
    `;
    
    const updatePanel = () => {
      this.notificationService.getNotifications().subscribe(notifications => {
        const unread = notifications.filter(n => !n.read);
        
        notificationPanel.innerHTML = `
          <div style="padding: 15px; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
            <span>🔔 Live Notifications (${unread.length} new)</span>
            <span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; animation: pulse 1s infinite;">LIVE</span>
          </div>
          <div style="max-height: 400px; overflow-y: auto;">
            ${notifications.slice(0, 10).map(n => `
              <div onclick="window.location.href='${n.actionUrl}'; document.getElementById('notification-panel').remove();" style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; ${n.read ? 'opacity: 0.6;' : 'background: linear-gradient(90deg, #e3f2fd, #f3e5f5); border-left: 4px solid #2196f3; animation: slideIn 0.3s ease-out;'}">
              <div style="font-weight: bold; color: #333; display: flex; justify-content: space-between;">
                <span>${n.title}</span>
                ${!n.read ? '<span style="color: #f44336; font-size: 12px;">NEW</span>' : ''}
              </div>
              <div style="font-size: 14px; color: #666; margin: 4px 0;">${n.message}</div>
              <div style="font-size: 12px; color: #999; display: flex; justify-content: space-between;">
                <span>${new Date(n.timestamp).toLocaleTimeString()}</span>
                <span style="background: #${n.type === 'deal' ? 'ff9800' : n.type === 'order' ? '4caf50' : '9c27b0'}; color: white; padding: 1px 6px; border-radius: 8px; font-size: 10px;">${n.type.toUpperCase()}</span>
              </div>
              <div style="font-size: 11px; color: #2196f3; margin-top: 4px;">Click to view →</div>
            </div>
            `).join('')}
          </div>
          <div style="padding: 10px; text-align: center; background: #f8f9fa;">
            <button onclick="document.getElementById('notification-panel').remove()" style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Close</button>
            <button onclick="this.parentElement.parentElement.querySelector('div[style*=opacity]').style.display='none'" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Mark All Read</button>
          </div>
        `;
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      });
    };
    
    document.body.appendChild(notificationPanel);
    updatePanel();
    
    // Update panel every 5 seconds to show live notifications
    const updateInterval = setInterval(updatePanel, 5000);
    
    // Mark all as read after 3 seconds
    setTimeout(() => {
      this.notificationService.getNotifications().subscribe(notifications => {
        notifications.forEach(n => {
          if (!n.read) this.notificationService.markAsRead(n.id);
        });
      });
    }, 3000);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      clearInterval(updateInterval);
      if (document.body.contains(notificationPanel)) {
        notificationPanel.remove();
      }
    }, 15000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}