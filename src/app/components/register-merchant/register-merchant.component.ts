import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register-merchant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css']
})
export class RegisterMerchantComponent {
  registerData: RegisterRequest = { fullName: '', email: '', password: '', role: 'MERCHANT' };
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validation
    if (!this.registerData.fullName || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill all required fields';
      this.loading = false;
      return;
    }
    
    if (!this.isValidEmail(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.loading = false;
      return;
    }
    
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      this.loading = false;
      return;
    }
    
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.loading = false;
      return;
    }
    
    // Check if email already exists
    const existingMerchants = JSON.parse(localStorage.getItem('registered_merchants') || '[]');
    if (existingMerchants.some((merchant: any) => merchant.email === this.registerData.email)) {
      this.errorMessage = 'Email already registered. Please use a different email.';
      this.loading = false;
      return;
    }

    // Store merchant email in localStorage for login detection
    const merchantEmails = JSON.parse(localStorage.getItem('merchant_emails') || '[]');
    if (!merchantEmails.includes(this.registerData.email)) {
      merchantEmails.push(this.registerData.email);
      localStorage.setItem('merchant_emails', JSON.stringify(merchantEmails));
    }

    // Store merchant locally (backend registration not available)
    console.log('Storing merchant registration locally');
    this.storeMerchantLocally();
    this.loading = false;
    this.successMessage = 'Merchant registration successful! You can now login with your credentials.';
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
  
  private storeMerchantLocally(): void {
    // Store merchant credentials locally for demo purposes
    const existingMerchants = JSON.parse(localStorage.getItem('registered_merchants') || '[]');
    const newMerchant = {
      id: Date.now(),
      fullName: this.registerData.fullName,
      email: this.registerData.email,
      password: this.registerData.password, // In production, this should be hashed
      role: 'MERCHANT',
      registrationDate: new Date().toISOString()
    };
    
    existingMerchants.push(newMerchant);
    localStorage.setItem('registered_merchants', JSON.stringify(existingMerchants));
    console.log('Merchant stored locally:', newMerchant.email);
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}