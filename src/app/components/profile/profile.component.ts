import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile">
      <h2>Profile</h2>
      
      <div class="profile-card">
        <img src="https://via.placeholder.com/100" alt="Avatar">
        <div class="info">
          <h3>{{ profile.fullName || 'Your Name' }}</h3>
          <p>{{ profile.email || 'your@email.com' }}</p>
          <p>{{ profile.phone || 'Add phone' }}</p>
          <small>User ID: {{ userId }}</small>
        </div>
        <button (click)="editing = !editing">{{ editing ? 'Cancel' : 'Edit' }}</button>
      </div>

      <div *ngIf="editing" class="edit-form">
        <input [(ngModel)]="profile.fullName" placeholder="Full Name">
        <input [(ngModel)]="profile.email" placeholder="Email">
        <input [(ngModel)]="profile.phone" placeholder="Phone">
        <button (click)="save()" [disabled]="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
      </div>

      <div class="stats">
        <div class="stat">
          <span>{{ stats.orders }}</span>
          <small>Orders</small>
        </div>
        <div class="stat">
          <span>₹{{ stats.savings }}</span>
          <small>Saved</small>
        </div>
        <div class="stat">
          <span>{{ stats.points }}</span>
          <small>Points</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile { max-width: 600px; margin: 0 auto; padding: 20px; }
    .profile-card { display: flex; align-items: center; gap: 20px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .profile-card img { width: 100px; height: 100px; border-radius: 50%; }
    .info { flex: 1; }
    .info h3 { margin: 0; }
    .info p { margin: 5px 0; color: #666; }
    .info small { color: #999; font-size: 12px; }
    .edit-form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .edit-form input { width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; }
    .stats { display: flex; gap: 20px; }
    .stat { background: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat span { display: block; font-size: 24px; font-weight: bold; color: #007bff; }
    .stat small { color: #666; }
    button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class ProfileComponent implements OnInit {
  editing = false;
  saving = false;
  userId: number | null = null;
  profile = { 
    fullName: '', 
    email: '', 
    phone: '' 
  };
  stats = {
    orders: 0,
    savings: 0,
    points: 0
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.userId = this.authService.getUserId();
    
    // Load from localStorage if available
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      this.profile = JSON.parse(saved);
    } else {
      // Set default values
      this.profile = {
        fullName: 'Demo User',
        email: 'demo@example.com',
        phone: '9999999999'
      };
    }
    
    // Mock stats for now
    this.stats = {
      orders: 5,
      savings: 1250,
      points: 420
    };
  }

  save(): void {
    if (!this.profile.fullName || !this.profile.email) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.saving = true;
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
    
    setTimeout(() => {
      this.editing = false;
      this.saving = false;
      this.toastService.success('Profile saved successfully!');
    }, 500);
  }
}