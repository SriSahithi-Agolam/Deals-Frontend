import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-merchant',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="merchant-dashboard">
      <h2>Merchant Dashboard</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>My Deals</h3>
          <p class="stat-number">{{myDeals}}</p>
        </div>
        <div class="stat-card">
          <h3>Total Sales</h3>
          <p class="stat-number">₹{{totalSales}}</p>
        </div>
        <div class="stat-card">
          <h3>Orders</h3>
          <p class="stat-number">{{totalOrders}}</p>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <p class="stat-number">₹{{revenue}}</p>
        </div>
      </div>
      
      <!-- Add Deal Form -->
      <div class="add-deal-section">
        <h3>➕ Add New Deal</h3>
        <form (ngSubmit)="addDeal()" #dealForm="ngForm" class="deal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Deal Title *</label>
              <input type="text" [(ngModel)]="newDeal.title" name="title" required>
            </div>
            <div class="form-group">
              <label>Category *</label>
              <select [(ngModel)]="newDeal.category" name="category" required>
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Travel">Travel</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Original Price (₹) *</label>
              <input type="number" [(ngModel)]="newDeal.price" name="price" required min="1">
            </div>
            <div class="form-group">
              <label>Discount (%) *</label>
              <input type="number" [(ngModel)]="newDeal.discount" name="discount" required min="1" max="90">
            </div>
          </div>
          
          <div class="form-group">
            <label>Description *</label>
            <textarea [(ngModel)]="newDeal.description" name="description" required rows="3"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Image URL</label>
              <input type="url" [(ngModel)]="newDeal.image" name="image" placeholder="https://example.com/image.jpg">
            </div>
            <div class="form-group">
              <label>Valid Until</label>
              <input type="date" [(ngModel)]="newDeal.validUntil" name="validUntil">
            </div>
          </div>
          
          <button type="submit" [disabled]="!dealForm.valid || adding" class="add-btn">
            {{ adding ? 'Adding...' : 'Add Deal' }}
          </button>
        </form>
      </div>
      
      <div class="merchant-menu">
        <div class="menu-item" (click)="navigateTo('/deals')">
          <h3>🎯 View All Deals</h3>
          <p>Browse all available deals</p>
        </div>
        <div class="menu-item" (click)="navigateTo('/orders')">
          <h3>📦 Orders</h3>
          <p>View and manage customer orders</p>
        </div>
        <div class="menu-item" (click)="navigateTo('/analytics')">
          <h3>📊 Analytics</h3>
          <p>View deal performance and insights</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .merchant-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card h3 {
      margin: 0 0 10px 0;
      font-size: 0.9em;
      opacity: 0.9;
    }
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      margin: 0;
    }
    
    .add-deal-section {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      border: 1px solid #ddd;
    }
    
    .add-deal-section h3 {
      color: #27ae60;
      margin: 0 0 20px 0;
      font-size: 1.3em;
    }
    
    .deal-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      font-weight: bold;
      margin-bottom: 5px;
      color: #555;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #27ae60;
      box-shadow: 0 0 5px rgba(39, 174, 96, 0.3);
    }
    
    .add-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
      align-self: flex-start;
    }
    
    .add-btn:hover:not(:disabled) {
      background: #229954;
    }
    
    .add-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    .merchant-menu {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .menu-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s;
    }
    .menu-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      border-color: #27ae60;
    }
    h2 { color: #2c3e50; text-align: center; }
    .menu-item h3 { color: #27ae60; margin: 0 0 10px 0; }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MerchantComponent implements OnInit {
  myDeals = 12;
  totalSales = 45600;
  totalOrders = 89;
  revenue = 12300;
  adding = false;
  
  newDeal = {
    title: '',
    category: '',
    price: null,
    discount: null,
    description: '',
    image: '',
    validUntil: ''
  };

  constructor(private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    // Load real merchant stats from backend
  }

  navigateTo(route: string): void {
    console.log('Navigate to:', route);
    this.router.navigate([route]);
  }
  
  addDeal(): void {
    this.adding = true;
    
    // Create deal object
    const deal = {
      id: Date.now(),
      title: this.newDeal.title,
      category: this.newDeal.category,
      price: this.newDeal.price,
      discount: this.newDeal.discount,
      description: this.newDeal.description,
      image: this.newDeal.image || 'https://via.placeholder.com/300x200',
      validUntil: this.newDeal.validUntil,
      merchantId: 1, // Default merchant ID
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    console.log('Adding new deal:', deal);
    
    // Save to localStorage (in real app, this would be backend API call)
    const existingDeals = JSON.parse(localStorage.getItem('merchant_deals') || '[]');
    existingDeals.push(deal);
    localStorage.setItem('merchant_deals', JSON.stringify(existingDeals));
    
    // Also add to main deals list
    const allDeals = JSON.parse(localStorage.getItem('deals') || '[]');
    allDeals.push(deal);
    localStorage.setItem('deals', JSON.stringify(allDeals));
    
    setTimeout(() => {
      this.adding = false;
      this.toastService.success('Deal added successfully! 🎉');
      
      // Reset form
      this.newDeal = {
        title: '',
        category: '',
        price: null,
        discount: null,
        description: '',
        image: '',
        validUntil: ''
      };
      
      // Update stats
      this.myDeals++;
      
    }, 1000);
  }
}