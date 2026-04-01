import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="review-section">
      <div class="rating-display">
        <span class="stars">★★★★★</span>
        <span class="avg-rating">{{avgRating.toFixed(1)}}</span>
        <span class="review-count">({{reviews.length}})</span>
      </div>
      
      <div class="add-review" *ngIf="!showForm">
        <button (click)="showForm = true">Rate this deal</button>
      </div>
      
      <div class="review-form" *ngIf="showForm">
        <div class="rating-input">
          <span *ngFor="let star of [1,2,3,4,5]" 
                (click)="rating = star" 
                [class.active]="star <= rating">★</span>
        </div>
        <textarea [(ngModel)]="comment" placeholder="Write a review..."></textarea>
        <button (click)="submitReview()">Submit</button>
        <button (click)="showForm = false">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .rating-display { margin-bottom: 10px; }
    .stars { color: #ffd700; font-size: 18px; }
    .rating-input span { cursor: pointer; font-size: 24px; color: #ddd; }
    .rating-input span.active { color: #ffd700; }
    textarea { width: 100%; height: 60px; margin: 10px 0; }
    button { margin: 5px; padding: 8px 16px; }
  `]
})
export class ReviewComponent {
  @Input() dealId!: string;
  @Input() merchantId!: string;
  
  rating = 0;
  comment = '';
  showForm = false;
  reviews: any[] = [];
  avgRating = 0;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.reviews = this.reviewService.getDealReviews(this.dealId);
    this.avgRating = this.reviewService.getAverageRating(this.dealId);
  }

  submitReview() {
    if (this.rating > 0) {
      this.reviewService.addReview(this.dealId, this.merchantId, this.rating, this.comment);
      this.loadReviews();
      this.showForm = false;
      this.rating = 0;
      this.comment = '';
    }
  }
}