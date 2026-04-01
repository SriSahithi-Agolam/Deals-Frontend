import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h2>Shopping Cart</h2>
      <div *ngIf="cartItems.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <a routerLink="/deals" class="continue-shopping">Continue Shopping</a>
      </div>
      <div *ngIf="cartItems.length > 0">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartItems">
            <div class="item-info">
              <h4>{{ item.deal.title }}</h4>
              <p class="item-price">₹{{ getDiscountedPrice(item.deal) }}</p>
              <p class="original-price">₹{{ item.deal.price }}</p>
              <span class="discount">{{ item.deal.discount }}% OFF</span>
            </div>
            <div class="quantity-controls">
              <button (click)="decreaseQuantity(item.deal.id!)">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button (click)="increaseQuantity(item.deal.id!)">+</button>
            </div>
            <div class="item-total">
              <p>₹{{ getItemTotal(item) }}</p>
              <button class="remove-btn" (click)="removeItem(item.deal.id!)">Remove</button>
            </div>
          </div>
        </div>
        <div class="cart-summary">
          <div class="summary-row">
            <span>Total Items: {{ getTotalItems() }}</span>
          </div>
          <div class="summary-row total">
            <span>Total: ₹{{ getCartTotal() }}</span>
          </div>
          <button class="checkout-btn" (click)="checkout()">Proceed to Checkout</button>
          <button class="clear-btn" (click)="clearCart()">Clear Cart</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .empty-cart {
      text-align: center;
      padding: 50px;
    }
    .continue-shopping {
      color: #3498db;
      text-decoration: none;
      font-weight: bold;
    }
    .cart-items {
      margin-bottom: 30px;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 15px;
      background: white;
    }
    .item-info h4 {
      margin: 0 0 10px 0;
      color: #2c3e50;
    }
    .item-price {
      font-size: 1.2em;
      font-weight: bold;
      color: #27ae60;
      margin: 5px 0;
    }
    .original-price {
      text-decoration: line-through;
      color: #999;
      margin: 0;
    }
    .discount {
      background: #e74c3c;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8em;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .quantity-controls button {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 4px;
    }
    .quantity {
      font-weight: bold;
      min-width: 20px;
      text-align: center;
    }
    .item-total {
      text-align: right;
    }
    .item-total p {
      font-size: 1.1em;
      font-weight: bold;
      margin: 0 0 10px 0;
    }
    .remove-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .cart-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .summary-row.total {
      font-size: 1.2em;
      font-weight: bold;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
    .checkout-btn {
      width: 100%;
      background: #27ae60;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 4px;
      font-size: 1.1em;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .clear-btn {
      width: 100%;
      background: #95a5a6;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getDiscountedPrice(deal: any): number {
    return Math.round(deal.price * (1 - deal.discount / 100));
  }

  getItemTotal(item: CartItem): number {
    return Math.round(this.getDiscountedPrice(item.deal) * item.quantity);
  }

  getTotalItems(): number {
    return this.cartService.getCartCount();
  }

  getCartTotal(): number {
    return Math.round(this.cartService.getCartTotal());
  }

  increaseQuantity(dealId: number): void {
    const item = this.cartItems.find(item => item.deal.id === dealId);
    if (item) {
      this.cartService.updateQuantity(dealId, item.quantity + 1);
    }
  }

  decreaseQuantity(dealId: number): void {
    const item = this.cartItems.find(item => item.deal.id === dealId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(dealId, item.quantity - 1);
    }
  }

  removeItem(dealId: number): void {
    this.cartService.removeFromCart(dealId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}