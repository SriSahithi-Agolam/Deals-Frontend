import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: any[] = JSON.parse(sessionStorage.getItem('reviews') || '[]');

  addReview(dealId: string, merchantId: string, rating: number, comment: string) {
    const review = {
      id: Date.now().toString(),
      dealId,
      merchantId,
      rating,
      comment,
      date: new Date(),
      userId: JSON.parse(sessionStorage.getItem('user') || '{}').id
    };
    this.reviews.push(review);
    sessionStorage.setItem('reviews', JSON.stringify(this.reviews));
  }

  getDealReviews(dealId: string) {
    return this.reviews.filter(r => r.dealId === dealId);
  }

  getMerchantReviews(merchantId: string) {
    return this.reviews.filter(r => r.merchantId === merchantId);
  }

  getAverageRating(dealId: string) {
    const dealReviews = this.getDealReviews(dealId);
    return dealReviews.length ? dealReviews.reduce((sum, r) => sum + r.rating, 0) / dealReviews.length : 0;
  }
}