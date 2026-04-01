import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deal } from '../models/deal.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Deal[] = [];
  private wishlistSubject = new BehaviorSubject<Deal[]>([]);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  addToWishlist(deal: Deal): void {
    if (!this.isInWishlist(deal.id!)) {
      this.wishlistItems.push(deal);
      this.wishlistSubject.next([...this.wishlistItems]);
      this.saveToStorage();
    }
  }

  removeFromWishlist(dealId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== dealId);
    this.wishlistSubject.next([...this.wishlistItems]);
    this.saveToStorage();
  }

  isInWishlist(dealId: number): boolean {
    return this.wishlistItems.some(item => item.id === dealId);
  }

  getWishlistItems(): Deal[] {
    return [...this.wishlistItems];
  }

  getWishlistCount(): number {
    return this.wishlistItems.length;
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.wishlistSubject.next([]);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    sessionStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  private loadFromStorage(): void {
    const saved = sessionStorage.getItem('wishlist');
    if (saved) {
      this.wishlistItems = JSON.parse(saved);
      this.wishlistSubject.next([...this.wishlistItems]);
    }
  }
}