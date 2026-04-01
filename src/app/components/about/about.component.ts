import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <section class="hero-section">
        <h1>About Deals & Coupons Finder</h1>
        <p class="tagline">Your trusted partner for saving money on every purchase</p>
      </section>

      <section class="mission-section">
        <div class="content-box">
          <h2>Our Mission</h2>
          <p>We believe everyone deserves to save money while shopping. Our platform connects you with the best deals, coupons, and cashback offers from top merchants across India.</p>
        </div>
        
        <div class="content-box">
          <h2>What We Offer</h2>
          <ul>
            <li>💰 <strong>Cashback Points:</strong> Earn points on every purchase and use them like real money</li>
            <li>🎟️ <strong>Exclusive Coupons:</strong> Access to thousands of verified coupon codes</li>
            <li>🏪 <strong>Trusted Merchants:</strong> Partner with verified businesses across categories</li>
            <li>📱 <strong>Easy to Use:</strong> Simple interface to find and redeem deals instantly</li>
            <li>🔒 <strong>Secure Payments:</strong> Safe and encrypted payment processing</li>
          </ul>
        </div>
      </section>

      <section class="stats-section">
        <div class="stat-card">
          <h3>10,000+</h3>
          <p>Active Users</p>
        </div>
        <div class="stat-card">
          <h3>500+</h3>
          <p>Partner Merchants</p>
        </div>
        <div class="stat-card">
          <h3>₹50L+</h3>
          <p>Savings Generated</p>
        </div>
        <div class="stat-card">
          <h3>5000+</h3>
          <p>Active Deals</p>
        </div>
      </section>

      <section class="team-section">
        <h2>Meet Our Team</h2>
        <p class="team-intro">Passionate individuals working to bring you the best deals</p>
        
        <div class="team-grid">
          <div class="team-member" *ngFor="let member of teamMembers">
            <div class="member-avatar">{{ member.initials }}</div>
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
            <p class="bio">{{ member.bio }}</p>
            <div class="member-contact">
              <span>📧 {{ member.email }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="values-section">
        <h2>Our Core Values</h2>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🎯</div>
            <h3>Customer First</h3>
            <p>Your satisfaction and savings are our top priority</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>Trust & Transparency</h3>
            <p>Honest deals with verified merchants only</p>
          </div>
          <div class="value-card">
            <div class="value-icon">⚡</div>
            <h3>Innovation</h3>
            <p>Constantly improving to serve you better</p>
          </div>
          <div class="value-card">
            <div class="value-icon">🌟</div>
            <h3>Excellence</h3>
            <p>Delivering the best deals and user experience</p>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <h2>Start Saving Today!</h2>
        <p>Join thousands of smart shoppers who save money every day</p>
        <button class="cta-button" (click)="navigateToDeals()">Browse Deals</button>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .hero-section {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 40px;
    }

    .hero-section h1 {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .tagline {
      font-size: 20px;
      opacity: 0.9;
    }

    .mission-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }

    .content-box {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .content-box h2 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .content-box ul {
      list-style: none;
      padding: 0;
    }

    .content-box ul li {
      padding: 10px 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .content-box ul li:last-child {
      border-bottom: none;
    }

    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 50px;
    }

    .stat-card {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-card h3 {
      font-size: 36px;
      margin: 0 0 10px 0;
    }

    .stat-card p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }

    .team-section {
      margin-bottom: 50px;
    }

    .team-section h2 {
      text-align: center;
      color: #2c3e50;
      font-size: 36px;
      margin-bottom: 10px;
    }

    .team-intro {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 40px;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }

    .team-member {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s;
    }

    .team-member:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .member-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      margin: 0 auto 20px;
    }

    .team-member h3 {
      color: #2c3e50;
      margin-bottom: 5px;
    }

    .role {
      color: #3498db;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .bio {
      color: #7f8c8d;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .member-contact {
      font-size: 14px;
      color: #95a5a6;
    }

    .values-section {
      margin-bottom: 50px;
    }

    .values-section h2 {
      text-align: center;
      color: #2c3e50;
      font-size: 36px;
      margin-bottom: 40px;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 25px;
    }

    .value-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .value-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .value-card h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .value-card p {
      color: #7f8c8d;
      line-height: 1.6;
    }

    .cta-section {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 40px;
    }

    .cta-section h2 {
      font-size: 36px;
      margin-bottom: 15px;
    }

    .cta-section p {
      font-size: 18px;
      margin-bottom: 30px;
    }

    .cta-button {
      background: white;
      color: #f5576c;
      border: none;
      padding: 15px 40px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.3s;
    }

    .cta-button:hover {
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 32px;
      }

      .team-grid, .values-grid, .stats-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {
  constructor(private router: Router) {}

  teamMembers = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      initials: 'RK',
      bio: 'Visionary leader with 10+ years in e-commerce and fintech. Passionate about helping people save money.',
      email: 'rajesh&#64;dealscoupons.com'
    },
    {
      name: 'Priya Sharma',
      role: 'Chief Technology Officer',
      initials: 'PS',
      bio: 'Tech expert specializing in scalable platforms. Built the entire microservices architecture.',
      email: 'priya&#64;dealscoupons.com'
    },
    {
      name: 'Amit Patel',
      role: 'Head of Merchant Relations',
      initials: 'AP',
      bio: 'Manages partnerships with 500+ merchants. Ensures quality deals for our users.',
      email: 'amit&#64;dealscoupons.com'
    },
    {
      name: 'Sneha Reddy',
      role: 'Customer Success Manager',
      initials: 'SR',
      bio: 'Dedicated to user satisfaction. Handles support and ensures smooth user experience.',
      email: 'sneha&#64;dealscoupons.com'
    },
    {
      name: 'Vikram Singh',
      role: 'Marketing Director',
      initials: 'VS',
      bio: 'Creative marketer bringing the best deals to your attention. Growth hacker at heart.',
      email: 'vikram&#64;dealscoupons.com'
    },
    {
      name: 'Ananya Iyer',
      role: 'Product Manager',
      initials: 'AI',
      bio: 'Designs user-centric features. Always listening to feedback to improve the platform.',
      email: 'ananya&#64;dealscoupons.com'
    }
  ];

  navigateToDeals() {
    this.router.navigate(['/deals']);
  }
}
