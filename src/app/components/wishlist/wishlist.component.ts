import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Deal } from '../../models/deal.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-container">
      <h2>My Wishlist</h2>
      
      <div *ngIf="wishlistItems.length === 0" class="empty-wishlist">
        <p>Your wishlist is empty</p>
        <a routerLink="/deals" class="browse-deals">Browse Deals</a>
      </div>
      
      <div *ngIf="wishlistItems.length > 0">
        <div class="wishlist-header">
          <span>{{wishlistItems.length}} items in your wishlist</span>
          <button class="clear-all" (click)="clearWishlist()">Clear All</button>
        </div>
        
        <div class="wishlist-grid">
          <div class="wishlist-item" *ngFor="let deal of wishlistItems">
            <div class="item-content">
              <h3>{{ deal.title }}</h3>
              <p class="description">{{ deal.description }}</p>
              <div class="deal-info">
                <span class="discount">{{ deal.discount }}% OFF</span>
                <span class="price">₹{{ deal.price }}</span>
              </div>
              <div class="deal-details">
                <p><strong>Category:</strong> {{ deal.category }}</p>
                <p><strong>Coupon:</strong> <span class="coupon">{{ deal.couponCode }}</span></p>
                <p><strong>Expires:</strong> {{ deal.expiryDate | date }}</p>
              </div>
            </div>
            
            <div class="item-actions">
              <button class="add-to-cart" (click)="addToCart(deal)">
                Add to Cart
              </button>
              <button class="remove-btn" (click)="removeFromWishlist(deal.id!)">
                ❤️ Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
    
    .empty-wishlist {
      text-align: center;
      padding: 50px;
      color: #666;
    }
    
    .browse-deals {
      color: #3498db;
      text-decoration: none;
      font-weight: bold;
      padding: 10px 20px;
      border: 2px solid #3498db;
      border-radius: 4px;
      display: inline-block;
      margin-top: 20px;
    }
    
    .wishlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    
    .clear-all {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .wishlist-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .item-content h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
    }
    
    .description {
      color: #666;
      margin-bottom: 15px;
      font-size: 0.9em;
    }
    
    .deal-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .discount {
      background: #e74c3c;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.9em;
    }
    
    .price {
      font-size: 1.1em;
      font-weight: bold;
      color: #27ae60;
    }
    
    .deal-details {
      border-top: 1px solid #eee;
      padding-top: 15px;
      margin-bottom: 20px;
    }
    
    .deal-details p {
      margin: 5px 0;
      font-size: 0.9em;
    }
    
    .coupon {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      color: #e74c3c;
      font-weight: bold;
    }
    
    .item-actions {
      display: flex;
      gap: 10px;
    }
    
    .add-to-cart {
      flex: 1;
      background: #27ae60;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .remove-btn {
      background: #f8f9fa;
      color: #e74c3c;
      border: 1px solid #e74c3c;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .add-to-cart:hover {
      background: #229954;
    }
    
    .remove-btn:hover {
      background: #e74c3c;
      color: white;
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: Deal[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  addToCart(deal: Deal): void {
    this.cartService.addToCart(deal);
    this.toastService.success(`${deal.title} added to cart!`);
  }

  removeFromWishlist(dealId: number): void {
    this.wishlistService.removeFromWishlist(dealId);
    this.toastService.info('Removed from wishlist');
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist();
    this.toastService.info('Wishlist cleared');
  }
}