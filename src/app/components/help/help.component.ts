import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="help-container">
      <h1>Help Center</h1>
      <p class="subtitle">Find answers to common questions and get support</p>

      <div class="help-categories">
        <div class="category-card" *ngFor="let category of categories">
          <div class="category-icon">{{ category.icon }}</div>
          <h3>{{ category.title }}</h3>
          <p>{{ category.description }}</p>
          <button (click)="navigateTo(category.link)">Learn More</button>
        </div>
      </div>

      <div class="quick-help">
        <h2>Quick Help Topics</h2>
        <div class="help-topics">
          <div class="topic" *ngFor="let topic of topics">
            <h4>{{ topic.question }}</h4>
            <p>{{ topic.answer }}</p>
          </div>
        </div>
      </div>

      <div class="contact-support">
        <h2>Still Need Help?</h2>
        <p>Our support team is here to assist you</p>
        <button class="contact-btn" (click)="navigateTo('/contact')">Contact Support</button>
      </div>
    </div>
  `,
  styles: [`
    .help-container {
      max-width: 1200px;
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
    .help-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 50px;
    }
    .category-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    .category-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    .category-card h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .category-card p {
      color: #7f8c8d;
      margin-bottom: 20px;
    }
    .category-card button {
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
    .category-card button:hover {
      background: #2980b9;
    }
    .quick-help {
      margin-bottom: 50px;
    }
    .quick-help h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 30px;
    }
    .help-topics {
      display: grid;
      gap: 20px;
    }
    .topic {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #3498db;
    }
    .topic h4 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .topic p {
      color: #7f8c8d;
      line-height: 1.6;
    }
    .contact-support {
      text-align: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 50px;
      border-radius: 12px;
    }
    .contact-support h2 {
      margin-bottom: 10px;
    }
    .contact-support p {
      margin-bottom: 20px;
      font-size: 18px;
    }
    .contact-btn {
      background: white;
      color: #667eea;
      border: none;
      padding: 15px 40px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
    }
    .contact-btn:hover {
      transform: scale(1.05);
    }
  `]
})
export class HelpComponent {
  categories = [
    { icon: '🎟️', title: 'Deals & Coupons', description: 'Learn how to find and use deals', link: '/faq' },
    { icon: '💰', title: 'Cashback', description: 'Understand cashback points system', link: '/faq' },
    { icon: '🛒', title: 'Orders', description: 'Track and manage your orders', link: '/faq' },
    { icon: '💳', title: 'Payments', description: 'Payment methods and security', link: '/faq' }
  ];

  topics = [
    { question: 'How do I create an account?', answer: 'Click on "Sign Up" in the header, fill in your details, and verify your email.' },
    { question: 'How do I apply a coupon code?', answer: 'Add items to cart, proceed to checkout, and enter the coupon code in the designated field.' },
    { question: 'When will I receive my cashback?', answer: 'Cashback is credited within 24 hours of order confirmation.' },
    { question: 'How do I track my order?', answer: 'Go to "Track Orders" in the navigation menu and enter your order ID.' },
    { question: 'What if a deal is expired?', answer: 'Expired deals are automatically removed. If you find one, please report it to us.' }
  ];

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
