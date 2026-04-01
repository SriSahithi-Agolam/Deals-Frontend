import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terms-container">
      <h1>Terms & Conditions</h1>
      <p class="last-updated">Last Updated: {{ lastUpdated }}</p>

      <div class="terms-content">
        <section *ngFor="let section of sections">
          <h2>{{ section.title }}</h2>
          <p *ngFor="let paragraph of section.content">{{ paragraph }}</p>
        </section>
      </div>

      <div class="acceptance">
        <p><strong>By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .terms-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      color: #2c3e50;
      font-size: 42px;
      margin-bottom: 10px;
    }
    .last-updated {
      color: #7f8c8d;
      font-style: italic;
      margin-bottom: 40px;
    }
    .terms-content {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    section {
      margin-bottom: 30px;
    }
    h2 {
      color: #2c3e50;
      font-size: 24px;
      margin-bottom: 15px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    p {
      color: #555;
      line-height: 1.8;
      margin-bottom: 15px;
    }
    .acceptance {
      background: #e8f4f8;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      border-left: 4px solid #3498db;
    }
    .acceptance p {
      margin: 0;
      color: #2c3e50;
    }
  `]
})
export class TermsComponent {
  lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using Deals & Coupons Finder platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
        'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.'
      ]
    },
    {
      title: '2. User Accounts',
      content: [
        'You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration and to update such information as necessary.',
        'You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.'
      ]
    },
    {
      title: '3. User Roles and Responsibilities',
      content: [
        'USERS can browse deals, make purchases, earn cashback, and manage their orders.',
        'MERCHANTS can create and manage deals, view their orders, and update their business profiles.',
        'ADMIN has full access to manage users, merchants, deals, and platform operations.',
        'Each user must act in accordance with their designated role and not attempt to access unauthorized features.'
      ]
    },
    {
      title: '4. Deals and Coupons',
      content: [
        'All deals and coupons are subject to availability and merchant terms. We do not guarantee the availability of any specific deal.',
        'Merchants are responsible for the accuracy of deal information, including prices, discounts, and expiry dates.',
        'We reserve the right to remove any deal that violates our policies or is reported as fraudulent.',
        'Coupon codes are single-use unless otherwise specified and cannot be combined with other offers.'
      ]
    },
    {
      title: '5. Cashback Program',
      content: [
        'Cashback points are earned on eligible purchases and credited within 24 hours of order confirmation.',
        'Cashback points can be redeemed for future purchases on our platform.',
        'We reserve the right to modify or discontinue the cashback program at any time with prior notice.',
        'Fraudulent activities related to cashback will result in account suspension and forfeiture of points.'
      ]
    },
    {
      title: '6. Orders and Payments',
      content: [
        'All orders are subject to acceptance by the merchant. We act as a platform connecting users and merchants.',
        'Payment processing is handled securely through our payment partners. We do not store your payment information.',
        'Prices are subject to change without notice. The price at the time of order placement will be honored.',
        'Refunds are processed according to our refund policy and merchant terms.'
      ]
    },
    {
      title: '7. Prohibited Activities',
      content: [
        'You may not use the platform for any illegal or unauthorized purpose.',
        'You may not attempt to gain unauthorized access to any part of the platform or other user accounts.',
        'You may not transmit viruses, malware, or any harmful code.',
        'You may not engage in fraudulent activities, including fake reviews or coupon abuse.',
        'Violation of these terms may result in immediate account termination.'
      ]
    },
    {
      title: '8. Intellectual Property',
      content: [
        'All content on the platform, including logos, text, graphics, and software, is owned by Deals & Coupons Finder or its licensors.',
        'You may not reproduce, distribute, or create derivative works without our express written permission.',
        'Merchant logos and brand names are property of their respective owners.'
      ]
    },
    {
      title: '9. Limitation of Liability',
      content: [
        'We provide the platform "as is" without warranties of any kind, express or implied.',
        'We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
        'Our total liability shall not exceed the amount paid by you in the past 12 months.',
        'We are not responsible for merchant actions, product quality, or delivery issues.'
      ]
    },
    {
      title: '10. Privacy',
      content: [
        'Your use of the platform is also governed by our Privacy Policy.',
        'We collect and use your information as described in our Privacy Policy.',
        'By using the platform, you consent to our data practices.'
      ]
    },
    {
      title: '11. Termination',
      content: [
        'We reserve the right to suspend or terminate your account at any time for violation of these terms.',
        'You may terminate your account at any time by contacting support.',
        'Upon termination, your right to use the platform will immediately cease.'
      ]
    },
    {
      title: '12. Governing Law',
      content: [
        'These terms are governed by the laws of India.',
        'Any disputes shall be resolved in the courts of Mumbai, Maharashtra.',
        'If any provision is found invalid, the remaining provisions shall remain in effect.'
      ]
    },
    {
      title: '13. Contact Information',
      content: [
        'For questions about these Terms & Conditions, please contact us at:',
        'Email: legal@dealscoupons.com',
        'Phone: 1800-123-4567',
        'Address: 123 Business Park, Mumbai, Maharashtra 400001, India'
      ]
    }
  ];
}
