import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="faq-container">
      <h1>Frequently Asked Questions</h1>
      <p class="subtitle">Everything you need to know about Deals & Coupons</p>

      <div class="faq-categories">
        <button 
          *ngFor="let cat of categories" 
          [class.active]="selectedCategory === cat"
          (click)="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="faq-list">
        <div class="faq-item" *ngFor="let faq of getFilteredFaqs(); let i = index">
          <div class="faq-question" (click)="toggleFaq(i)">
            <h3>{{ faq.question }}</h3>
            <span class="toggle-icon">{{ openFaqs.has(i) ? '−' : '+' }}</span>
          </div>
          <div class="faq-answer" [class.open]="openFaqs.has(i)">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      text-align: center;
      color: #2c3e50;
      font-size: 42px;
      margin-bottom: 10px;
    }
    .subtitle {
      text-align: center;
      color: #7f8c8d;
      font-size: 18px;
      margin-bottom: 40px;
    }
    .faq-categories {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }
    .faq-categories button {
      background: white;
      border: 2px solid #3498db;
      color: #3498db;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
    }
    .faq-categories button.active {
      background: #3498db;
      color: white;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .faq-item {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .faq-question {
      padding: 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8f9fa;
    }
    .faq-question:hover {
      background: #e9ecef;
    }
    .faq-question h3 {
      color: #2c3e50;
      margin: 0;
      font-size: 18px;
    }
    .toggle-icon {
      font-size: 24px;
      color: #3498db;
      font-weight: bold;
    }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .faq-answer.open {
      max-height: 500px;
    }
    .faq-answer p {
      padding: 20px;
      color: #7f8c8d;
      line-height: 1.6;
      margin: 0;
    }
  `]
})
export class FaqComponent {
  selectedCategory = 'All';
  categories = ['All', 'Account', 'Deals', 'Cashback', 'Orders', 'Payments'];
  openFaqs = new Set<number>();

  faqs = [
    { category: 'Account', question: 'How do I create an account?', answer: 'Click "Sign Up" in the header, enter your details (name, email, password), select your role (USER/MERCHANT), and submit. You\'ll receive a confirmation and can start using the platform immediately.' },
    { category: 'Account', question: 'Can I change my password?', answer: 'Yes, go to your Profile page and click "Change Password". Enter your current password and new password to update.' },
    { category: 'Account', question: 'What are the different user roles?', answer: 'We have 3 roles: USER (browse deals, make purchases), MERCHANT (create and manage deals), and ADMIN (manage the entire platform).' },
    { category: 'Deals', question: 'How do I find deals?', answer: 'Browse the Deals page to see all available offers. You can filter by category (Electronics, Fashion, Food, Travel, Books) or search by merchant.' },
    { category: 'Deals', question: 'Are all deals verified?', answer: 'Yes! All deals are verified by our team and directly provided by merchants. We ensure authenticity and validity.' },
    { category: 'Deals', question: 'How do I use a coupon code?', answer: 'Add items to your cart, proceed to checkout, and enter the coupon code in the designated field. The discount will be applied automatically.' },
    { category: 'Deals', question: 'Can I save deals for later?', answer: 'Yes! Click the heart icon on any deal to add it to your Wishlist. Access your wishlist from the header menu.' },
    { category: 'Cashback', question: 'How does cashback work?', answer: 'You earn cashback points on every purchase. Points are automatically credited to your account within 24 hours of order confirmation.' },
    { category: 'Cashback', question: 'How do I redeem cashback points?', answer: 'Go to your Profile, view your cashback balance, and click "Redeem Points". You can use points like real money on your next purchase.' },
    { category: 'Cashback', question: 'Do cashback points expire?', answer: 'No, your cashback points never expire. Use them whenever you want!' },
    { category: 'Orders', question: 'How do I track my order?', answer: 'Go to "Track Orders" in the navigation menu or visit the Orders page. You can see real-time status updates.' },
    { category: 'Orders', question: 'Can I cancel my order?', answer: 'Yes, you can cancel orders that are in PENDING or CONFIRMED status. Go to Orders page and click "Cancel Order".' },
    { category: 'Orders', question: 'What are the order statuses?', answer: 'Orders go through: PENDING → CONFIRMED → SHIPPED → DELIVERED. You can track each stage in real-time.' },
    { category: 'Payments', question: 'What payment methods do you accept?', answer: 'We accept Credit Cards, Debit Cards, UPI, Net Banking, and Razorpay. All transactions are secure and encrypted.' },
    { category: 'Payments', question: 'Is my payment information secure?', answer: 'Absolutely! We use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers.' },
    { category: 'Payments', question: 'Can I get a refund?', answer: 'Yes, refunds are processed for cancelled orders. Contact support or the admin can process refunds from the admin panel.' }
  ];

  toggleFaq(index: number) {
    if (this.openFaqs.has(index)) {
      this.openFaqs.delete(index);
    } else {
      this.openFaqs.add(index);
    }
  }

  getFilteredFaqs() {
    if (this.selectedCategory === 'All') {
      return this.faqs;
    }
    return this.faqs.filter(faq => faq.category === this.selectedCategory);
  }
}
