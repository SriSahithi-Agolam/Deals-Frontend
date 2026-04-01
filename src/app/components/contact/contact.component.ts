import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container">
      <section class="hero-section">
        <h1>Contact Us</h1>
        <p class="tagline">We're here to help! Get in touch with us</p>
      </section>

      <div class="content-wrapper">
        <section class="contact-info">
          <h2>Get In Touch</h2>
          
          <div class="info-card">
            <div class="icon">📧</div>
            <h3>Email</h3>
            <p>support&#64;dealscoupons.com</p>
            <p class="sub">We'll respond within 24 hours</p>
          </div>

          <div class="info-card">
            <div class="icon">📞</div>
            <h3>Phone</h3>
            <p>1800-123-4567</p>
            <p class="sub">Mon-Fri, 9 AM - 6 PM IST</p>
          </div>

          <div class="info-card">
            <div class="icon">📍</div>
            <h3>Address</h3>
            <p>123 Business Park</p>
            <p>Mumbai, Maharashtra 400001</p>
            <p class="sub">India</p>
          </div>

          <div class="info-card">
            <div class="icon">💬</div>
            <h3>Live Chat</h3>
            <p>Available 24/7</p>
            <button class="chat-btn" (click)="startChat()">Start Chat</button>
          </div>
        </section>

        <section class="contact-form-section">
          <h2>Send Us a Message</h2>
          <form class="contact-form" (ngSubmit)="submitForm()" #contactForm="ngForm">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                [(ngModel)]="formData.name" 
                required
                placeholder="Enter your name"
              >
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                [(ngModel)]="formData.email" 
                required
                placeholder="your&#64;email.com"
              >
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                [(ngModel)]="formData.phone"
                placeholder="+91 1234567890"
              >
            </div>

            <div class="form-group">
              <label for="subject">Subject *</label>
              <select 
                id="subject" 
                name="subject"
                [(ngModel)]="formData.subject" 
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="merchant">Merchant Partnership</option>
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="message">Message *</label>
              <textarea 
                id="message" 
                name="message"
                [(ngModel)]="formData.message" 
                required
                rows="6"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              [disabled]="!contactForm.valid || isSubmitting"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>

            <p class="success-message" *ngIf="showSuccess">
              ✅ Message sent successfully! We'll get back to you soon.
            </p>
          </form>
        </section>
      </div>

      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-card" *ngFor="let faq of faqs">
            <h3>{{ faq.question }}</h3>
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-container {
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

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 40px;
      margin-bottom: 50px;
    }

    .contact-info h2 {
      color: #2c3e50;
      margin-bottom: 25px;
    }

    .info-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      text-align: center;
    }

    .icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .info-card h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .info-card p {
      color: #7f8c8d;
      margin: 5px 0;
    }

    .sub {
      font-size: 14px;
      color: #95a5a6;
    }

    .chat-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 10px;
      font-size: 14px;
    }

    .chat-btn:hover {
      background: #229954;
    }

    .contact-form-section h2 {
      color: #2c3e50;
      margin-bottom: 25px;
    }

    .contact-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #2c3e50;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #3498db;
    }

    .submit-btn {
      width: 100%;
      background: #3498db;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2980b9;
    }

    .submit-btn:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }

    .success-message {
      text-align: center;
      color: #27ae60;
      font-weight: bold;
      margin-top: 15px;
    }

    .faq-section {
      margin-bottom: 50px;
    }

    .faq-section h2 {
      text-align: center;
      color: #2c3e50;
      font-size: 36px;
      margin-bottom: 40px;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 25px;
    }

    .faq-card {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-left: 4px solid #3498db;
    }

    .faq-card h3 {
      color: #2c3e50;
      margin-bottom: 10px;
      font-size: 18px;
    }

    .faq-card p {
      color: #7f8c8d;
      line-height: 1.6;
    }

    @media (max-width: 968px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }

      .hero-section h1 {
        font-size: 32px;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccess = false;

  faqs = [
    {
      question: 'How do I earn cashback points?',
      answer: 'You earn cashback points automatically on every purchase made through our platform. Points are credited to your account within 24 hours.'
    },
    {
      question: 'How can I redeem my points?',
      answer: 'Go to your profile, view your cashback balance, and use the redeem option. Points can be used like real money on your next purchase.'
    },
    {
      question: 'Are the coupons verified?',
      answer: 'Yes! All coupons on our platform are verified and tested. We work directly with merchants to ensure authenticity.'
    },
    {
      question: 'How do I become a merchant partner?',
      answer: 'Contact us through this form selecting "Merchant Partnership" as the subject, or email us at partners@dealscoupons.com'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Credit Cards, Debit Cards, UPI, Net Banking, and Razorpay. All transactions are secure and encrypted.'
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. Urgent matters are prioritized.'
    }
  ];

  constructor(private router: Router) {}

  submitForm() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.formData);
      this.showSuccess = true;
      this.isSubmitting = false;

      // Reset form
      this.formData = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccess = false;
      }, 5000);
    }, 1500);
  }

  startChat() {
    alert('Live chat feature coming soon! For now, please use the contact form or call us.');
  }
}
