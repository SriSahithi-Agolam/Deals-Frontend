import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="privacy-container">
      <h1>Privacy Policy</h1>
      <p class="last-updated">Last Updated: {{ lastUpdated }}</p>

      <div class="privacy-content">
        <section *ngFor="let section of sections">
          <h2>{{ section.title }}</h2>
          <p *ngFor="let paragraph of section.content">{{ paragraph }}</p>
          <ul *ngIf="section.list">
            <li *ngFor="let item of section.list">{{ item }}</li>
          </ul>
        </section>
      </div>

      <div class="commitment">
        <p><strong>We are committed to protecting your privacy and ensuring the security of your personal information.</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .privacy-container {
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
    .privacy-content {
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
      border-bottom: 2px solid #27ae60;
      padding-bottom: 10px;
    }
    p {
      color: #555;
      line-height: 1.8;
      margin-bottom: 15px;
    }
    ul {
      color: #555;
      line-height: 1.8;
      margin-left: 20px;
      margin-bottom: 15px;
    }
    li {
      margin-bottom: 8px;
    }
    .commitment {
      background: #e8f8f5;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      border-left: 4px solid #27ae60;
    }
    .commitment p {
      margin: 0;
      color: #2c3e50;
    }
  `]
})
export class PrivacyComponent {
  lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  sections = [
    {
      title: '1. Information We Collect',
      content: [
        'We collect information that you provide directly to us when you create an account, make a purchase, or contact us. This includes:'
      ],
      list: [
        'Personal Information: Name, email address, phone number, delivery address',
        'Account Information: Username, password (encrypted), user role',
        'Transaction Information: Order history, payment details, cashback points',
        'Profile Information: Preferences, wishlist, saved addresses',
        'Communication: Messages sent through our contact forms or support channels'
      ]
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'We use the information we collect for the following purposes:'
      ],
      list: [
        'To provide and maintain our services',
        'To process your transactions and send order confirmations',
        'To manage your cashback points and rewards',
        'To send you important updates about your account and orders',
        'To respond to your inquiries and provide customer support',
        'To improve our platform and develop new features',
        'To detect and prevent fraud and unauthorized activities',
        'To comply with legal obligations'
      ]
    },
    {
      title: '3. Information Sharing',
      content: [
        'We do not sell your personal information to third parties. We may share your information in the following circumstances:'
      ],
      list: [
        'With Merchants: To fulfill your orders and process transactions',
        'With Payment Processors: To securely process your payments (Razorpay)',
        'With Service Providers: Who help us operate our platform',
        'For Legal Reasons: When required by law or to protect our rights',
        'With Your Consent: When you explicitly authorize us to share information'
      ]
    },
    {
      title: '4. Data Security',
      content: [
        'We implement industry-standard security measures to protect your information:',
        'All data transmission is encrypted using SSL/TLS protocols. Passwords are hashed using secure algorithms. Payment information is processed through PCI-DSS compliant payment gateways. We regularly update our security practices and conduct security audits.',
        'However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.'
      ]
    },
    {
      title: '5. Cookies and Tracking',
      content: [
        'We use cookies and similar tracking technologies to enhance your experience:',
        'Session cookies to maintain your login state and shopping cart. Analytics cookies to understand how you use our platform. Preference cookies to remember your settings and preferences.',
        'You can control cookies through your browser settings. Disabling cookies may affect some functionality of the platform.'
      ]
    },
    {
      title: '6. Your Rights',
      content: [
        'You have the following rights regarding your personal information:'
      ],
      list: [
        'Access: Request a copy of your personal data',
        'Correction: Update or correct inaccurate information',
        'Deletion: Request deletion of your account and data',
        'Portability: Receive your data in a structured format',
        'Opt-out: Unsubscribe from marketing communications',
        'Objection: Object to certain data processing activities'
      ]
    },
    {
      title: '7. Data Retention',
      content: [
        'We retain your information for as long as necessary to provide our services and comply with legal obligations:',
        'Account information is retained while your account is active. Transaction records are kept for 7 years for accounting and legal purposes. Deleted accounts are permanently removed within 30 days, except where retention is required by law.'
      ]
    },
    {
      title: '8. Third-Party Links',
      content: [
        'Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites.',
        'We encourage you to review the privacy policies of any third-party sites you visit.'
      ]
    },
    {
      title: '9. Children\'s Privacy',
      content: [
        'Our services are not intended for users under the age of 18. We do not knowingly collect personal information from children.',
        'If we become aware that we have collected information from a child, we will take steps to delete such information promptly.'
      ]
    },
    {
      title: '10. International Users',
      content: [
        'Our services are primarily intended for users in India. If you access our platform from outside India, your information may be transferred to and processed in India.',
        'By using our services, you consent to the transfer of your information to India.'
      ]
    },
    {
      title: '11. Changes to Privacy Policy',
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of significant changes by:',
        'Posting the updated policy on our platform with a new "Last Updated" date. Sending an email notification to registered users. Displaying a prominent notice on our homepage.',
        'Your continued use of the platform after changes constitutes acceptance of the updated policy.'
      ]
    },
    {
      title: '12. Contact Us',
      content: [
        'If you have questions or concerns about this Privacy Policy or our data practices, please contact us:',
        'Email: privacy@dealscoupons.com',
        'Phone: 1800-123-4567',
        'Address: 123 Business Park, Mumbai, Maharashtra 400001, India',
        'Data Protection Officer: dpo@dealscoupons.com'
      ]
    }
  ];
}
