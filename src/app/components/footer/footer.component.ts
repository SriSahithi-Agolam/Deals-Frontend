import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>About Deals & Coupons</h3>
          <p>Your one-stop destination for the best deals, coupons, and cashback offers. Save money on every purchase!</p>
        </div>
        
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/deals">Browse Deals</a></li>
            <li><a routerLink="/merchants">Merchants</a></li>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a routerLink="/help">Help Center</a></li>
            <li><a routerLink="/faq">FAQ</a></li>
            <li><a routerLink="/terms">Terms & Conditions</a></li>
            <li><a routerLink="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>Contact Us</h3>
          <ul class="contact-info">
            <li>📧 support&#64;dealscoupons.com</li>
            <li>📞 1800-123-4567</li>
            <li>📍 Mumbai, India</li>
          </ul>
          <div class="social-links">
            <a href="#" (click)="openSocial($event, 'facebook')" title="Facebook">📘</a>
            <a href="#" (click)="openSocial($event, 'twitter')" title="Twitter">🐦</a>
            <a href="#" (click)="openSocial($event, 'instagram')" title="Instagram">📷</a>
            <a href="#" (click)="openSocial($event, 'linkedin')" title="LinkedIn">💼</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Deals & Coupons Finder. All rights reserved.</p>
        <p class="tagline">Save More, Live Better 💰</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 40px 20px 20px;
      margin-top: 60px;
    }
    
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      padding-bottom: 30px;
      border-bottom: 1px solid #34495e;
    }
    
    .footer-section h3 {
      color: #3498db;
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .footer-section p {
      line-height: 1.6;
      color: #bdc3c7;
      font-size: 14px;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section ul li {
      margin-bottom: 10px;
    }
    
    .footer-section ul li a {
      color: #ecf0f1;
      text-decoration: none;
      transition: color 0.3s;
      font-size: 14px;
    }
    
    .footer-section ul li a:hover {
      color: #3498db;
    }
    
    .contact-info li {
      color: #bdc3c7;
      font-size: 14px;
      margin-bottom: 8px;
    }
    
    .social-links {
      display: flex;
      gap: 15px;
      margin-top: 15px;
    }
    
    .social-links a {
      font-size: 24px;
      text-decoration: none;
      transition: transform 0.3s;
    }
    
    .social-links a:hover {
      transform: scale(1.2);
    }
    
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      padding-top: 20px;
    }
    
    .footer-bottom p {
      margin: 5px 0;
      color: #95a5a6;
      font-size: 14px;
    }
    
    .tagline {
      color: #3498db;
      font-weight: bold;
    }
    
    @media (max-width: 768px) {
      .footer-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .footer {
        padding: 30px 15px 15px;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  openSocial(event: Event, platform: string) {
    event.preventDefault();
    alert(`Follow us on ${platform}!`);
  }
}
