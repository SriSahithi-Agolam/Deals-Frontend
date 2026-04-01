import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ToastService } from '../../services/toast.service';
import { NotificationService } from '../../services/notification.service';
import { Deal } from '../../models/deal.model';
import { ReviewComponent } from '../review/review.component';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReviewComponent],
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  deals: Deal[] = [];
  filteredDeals: Deal[] = [];
  loading = true;
  
  // Filter properties
  searchTerm = '';
  locationFilter = '';
  selectedCategory = '';
  selectedDiscount = '';
  maxPrice = 100000;

  constructor(private dealService: DealService, private cartService: CartService, private wishlistService: WishlistService, private toastService: ToastService, private notificationService: NotificationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.notificationService.requestPermission();
    this.dealService.getAllDeals().subscribe({
      next: (data) => {
        console.log('Loaded deals:', data);
        this.deals = data;
        this.filteredDeals = data;
        this.loading = false;
        
        // Check for category filter from notification
        this.route.queryParams.subscribe(params => {
          if (params['category']) {
            this.selectedCategory = params['category'];
            this.filterDeals();
          }
        });
      },
      error: (err) => {
        console.error('Error loading deals', err);
        this.loading = false;
      }
    });
  }

  filterDeals(): void {
    this.filteredDeals = this.deals.filter(deal => {
      // Remove expired deals automatically
      if (this.isExpired(deal.expiryDate)) return false;
      
      // Search term filter
      const matchesSearch = !this.searchTerm || 
        deal.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        deal.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Location filter
      const matchesLocation = !this.locationFilter || 
        ((deal as any).location && (deal as any).location.toLowerCase().includes(this.locationFilter.toLowerCase()));
      
      // Category filter
      const matchesCategory = !this.selectedCategory || 
        deal.category.toLowerCase() === this.selectedCategory.toLowerCase();
      
      // Discount filter
      const matchesDiscount = !this.selectedDiscount || 
        deal.discount >= parseInt(this.selectedDiscount);
      
      // Price filter
      const matchesPrice = deal.price <= this.maxPrice;
      
      return matchesSearch && matchesLocation && matchesCategory && matchesDiscount && matchesPrice;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.locationFilter = '';
    this.selectedCategory = '';
    this.selectedDiscount = '';
    this.maxPrice = 100000;
    this.filteredDeals = this.deals;
  }

  isExpired(expiryDate: string): boolean {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry.getTime() < now.getTime();
  }

  isExpiringSoon(expiryDate: string): boolean {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const hoursDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    // Highlight if expiring within 48 hours
    return hoursDiff <= 48 && hoursDiff > 0;
  }

  getTimeRemaining(expiryDate: string): string {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  }

  getDealLocation(deal: Deal): string {
    return (deal as any).location || 'All Cities';
  }

  useDeal(deal: Deal): void {
    this.cartService.addToCart(deal);
    this.toastService.success(`${deal.title} added to cart!`);
  }

  toggleWishlist(deal: Deal): void {
    if (this.isInWishlist(deal.id!)) {
      this.wishlistService.removeFromWishlist(deal.id!);
      this.toastService.info('Removed from wishlist');
    } else {
      this.wishlistService.addToWishlist(deal);
      this.toastService.success('Added to wishlist!');
    }
  }

  isInWishlist(dealId: number): boolean {
    return this.wishlistService.isInWishlist(dealId);
  }
}
