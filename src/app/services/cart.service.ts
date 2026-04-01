import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deal } from '../models/deal.model';

export interface CartItem {
  deal: Deal;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  addToCart(deal: Deal, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.deal.id === deal.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ deal, quantity });
    }
    
    this.cartSubject.next([...this.cartItems]);
    this.saveToStorage();
  }

  removeFromCart(dealId: number): void {
    this.cartItems = this.cartItems.filter(item => item.deal.id !== dealId);
    this.cartSubject.next([...this.cartItems]);
    this.saveToStorage();
  }

  updateQuantity(dealId: number, quantity: number): void {
    const item = this.cartItems.find(item => item.deal.id === dealId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeFromCart(dealId);
      } else {
        this.cartSubject.next([...this.cartItems]);
        this.saveToStorage();
      }
    }
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const discountedPrice = item.deal.price * (1 - item.deal.discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }

  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private loadFromStorage(): void {
    const saved = sessionStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this.cartSubject.next([...this.cartItems]);
    }
  }

  constructor() {
    this.loadFromStorage();
  }
}