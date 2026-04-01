import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserManagementService } from '../../services/user-management.service';
import { OrderCleanupService } from '../../services/order-cleanup.service';
import { SecureLoggerService } from '../../services/secure-logger.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h2>My Profile</h2>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
      
      <div class="profile-content">
        <!-- Profile Information -->
        <div class="profile-section">
          <h3>Profile Information</h3>
          <div class="profile-card">
            <div class="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                [(ngModel)]="userProfile.fullName" 
                [disabled]="!editMode"
                class="profile-input">
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                [(ngModel)]="userProfile.email" 
                [disabled]="!editMode"
                class="profile-input">
            </div>
            
            <div class="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                [(ngModel)]="userProfile.phone" 
                [disabled]="!editMode"
                class="profile-input">
            </div>
            
            <div class="profile-actions">
              <button 
                *ngIf="!editMode" 
                class="edit-btn" 
                (click)="enableEdit()">
                Edit Profile
              </button>
              <div *ngIf="editMode">
                <button class="save-btn" (click)="saveProfile()">Save</button>
                <button class="cancel-btn" (click)="cancelEdit()">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Order History Summary -->
        <div class="profile-section">
          <h3>Order Summary</h3>
          <div class="orders-summary">
            <div class="order-stats">
              <div class="stat-item">
                <span class="stat-number">{{ recentOrders.length }}</span>
                <span class="stat-label">Total Orders</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">₹{{ getTotalSpent() }}</span>
                <span class="stat-label">Total Spent</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ getPendingOrders() }}</span>
                <span class="stat-label">Pending Orders</span>
              </div>
            </div>
            
            <div class="view-all-orders">
              <a routerLink="/orders" class="view-all-btn">View All Orders</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }
    
    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .profile-content {
      display: grid;
      gap: 30px;
    }
    
    .profile-section h3 {
      color: #2c3e50;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    
    .profile-card, .orders-summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    .profile-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
    }
    
    .profile-input:disabled {
      background: #f8f9fa;
      color: #666;
    }
    
    .profile-actions {
      margin-top: 20px;
    }
    
    .edit-btn, .save-btn, .cancel-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    
    .edit-btn {
      background: #3498db;
      color: white;
    }
    
    .save-btn {
      background: #27ae60;
      color: white;
    }
    
    .cancel-btn {
      background: #95a5a6;
      color: white;
    }
    
    .order-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .stat-number {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .stat-label {
      color: #666;
      font-size: 0.9em;
    }
    
    .view-all-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
    }
    
    .view-all-orders {
      text-align: center;
    }
  `]
})
export class UserProfileComponent implements OnInit {
  editMode = false;
  userProfile: any = {
    fullName: 'User',
    email: '',
    phone: ''
  };
  
  originalProfile: any = {};
  recentOrders: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userManagement: UserManagementService,
    private orderCleanup: OrderCleanupService,
    private logger: SecureLoggerService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadRecentOrders();
  }

  private loadUserProfile(): void {
    const userEmail = sessionStorage.getItem('user_email') || 'user@example.com';
    this.userProfile.email = userEmail;
    this.userProfile.fullName = userEmail.split('@')[0];
  }

  private loadRecentOrders(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.orderCleanup.getCleanOrderHistory(userId).subscribe(orders => {
        this.recentOrders = orders.slice(0, 5);
      });
    }
  }

  enableEdit(): void {
    this.editMode = true;
    this.originalProfile = { ...this.userProfile };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.userProfile = { ...this.originalProfile };
  }

  saveProfile(): void {
    this.logger.info('Profile updated successfully');
    this.editMode = false;
    sessionStorage.setItem('user_email', this.userProfile.email);
  }

  getTotalSpent(): number {
    return this.recentOrders.reduce((total, order) => total + order.finalAmount, 0);
  }

  getPendingOrders(): number {
    return this.recentOrders.filter(order => order.status === 'PENDING').length;
  }

  logout(): void {
    sessionStorage.clear();
    window.location.href = '/';
  }
}