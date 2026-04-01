import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SearchFilter {
  query: string;
  category?: string;
  priceRange?: { min: number; max: number };
  discount?: { min: number; max: number };
  location?: string;
  rating?: number;
  sortBy?: 'price' | 'discount' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchHistory = new BehaviorSubject<string[]>([]);
  private recentSearches: string[] = [];

  constructor() {
    this.loadSearchHistory();
  }

  searchDeals(deals: any[], filters: SearchFilter): any[] {
    let results = deals;

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(deal =>
        deal.title.toLowerCase().includes(query) ||
        deal.description?.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      results = results.filter(deal => deal.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange) {
      results = results.filter(deal =>
        deal.price >= filters.priceRange!.min &&
        deal.price <= filters.priceRange!.max
      );
    }

    // Discount range filter
    if (filters.discount) {
      results = results.filter(deal =>
        deal.discount >= filters.discount!.min &&
        deal.discount <= filters.discount!.max
      );
    }

    // Location filter
    if (filters.location) {
      results = results.filter(deal =>
        deal.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Rating filter
    if (filters.rating) {
      results = results.filter(deal => (deal.rating || 0) >= filters.rating!);
    }

    // Sorting
    if (filters.sortBy) {
      results = this.sortResults(results, filters.sortBy, filters.sortOrder || 'asc');
    }

    // Add to search history
    if (filters.query) {
      this.addToSearchHistory(filters.query);
    }

    return results;
  }

  private sortResults(deals: any[], sortBy: string, order: string): any[] {
    const sorted = [...deals].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'discount':
          aVal = a.discount;
          bVal = b.discount;
          break;
        case 'rating':
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case 'newest':
          aVal = new Date(a.createdDate || 0).getTime();
          bVal = new Date(b.createdDate || 0).getTime();
          break;
        default:
          return 0;
      }

      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  }

  addToSearchHistory(query: string): void {
    if (!this.recentSearches.includes(query)) {
      this.recentSearches.unshift(query);
      if (this.recentSearches.length > 10) {
        this.recentSearches.pop();
      }
      this.saveSearchHistory();
    }
  }

  getSearchHistory(): Observable<string[]> {
    return this.searchHistory.asObservable();
  }

  clearSearchHistory(): void {
    this.recentSearches = [];
    this.saveSearchHistory();
  }

  private saveSearchHistory(): void {
    localStorage.setItem('searchHistory', JSON.stringify(this.recentSearches));
    this.searchHistory.next(this.recentSearches);
  }

  private loadSearchHistory(): void {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      this.recentSearches = JSON.parse(saved);
      this.searchHistory.next(this.recentSearches);
    }
  }

  getSuggestions(query: string, deals: any[]): string[] {
    if (!query) return [];
    const q = query.toLowerCase();
    const suggestions = new Set<string>();

    deals.forEach(deal => {
      if (deal.title.toLowerCase().includes(q)) {
        suggestions.add(deal.title);
      }
      if (deal.category.toLowerCase().includes(q)) {
        suggestions.add(deal.category);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }
}
