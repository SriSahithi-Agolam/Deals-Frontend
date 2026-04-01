import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { SecureLoggerService } from '../../services/secure-logger.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private logger: SecureLoggerService
  ) {}

  onSubmit(): void {
    console.log('🔐 Login form submitted');
    console.log('📧 Email:', this.loginData.email);
    console.log('🔑 Password length:', this.loginData.password.length);
    
    this.errorMessage = '';
    
    // Basic validation
    if (!this.loginData.email || !this.loginData.password) {
      console.log('❌ Validation failed: Missing email or password');
      this.errorMessage = 'Please enter both email and password';
      return;
    }
    
    if (!this.isValidEmail(this.loginData.email)) {
      console.log('❌ Validation failed: Invalid email format');
      this.errorMessage = 'Please enter a valid email address';
      return;
    }
    
    if (this.loginData.password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }
    
    console.log('✅ Validation passed, attempting authentication');
    // Try to authenticate with backend first
    this.authenticateWithBackend();
  }
  
  private authenticateWithBackend(): void {
    const loginPayload = {
      email: this.loginData.email,
      password: this.loginData.password
    };
    
    // Try backend authentication first
    this.http.post<any>('http://localhost:8080/api/auth/login', loginPayload)
      .subscribe({
        next: (response) => {
          console.log('Backend authentication successful:', response);
          if (response && response.token) {
            this.createUserSessionFromBackend(response);
          } else {
            console.log('Invalid response from backend, using fallback');
            this.authenticateWithFallback();
          }
        },
        error: (error) => {
          console.log('Backend authentication failed, using fallback:', error);
          this.authenticateWithFallback();
        }
      });
  }
  
  private authenticateWithFallback(): void {
    // Demo credentials for testing (remove in production)
    const demoCredentials = [
      { email: 'user@demo.com', password: 'password', role: 'USER' },
      { email: 'merchant@demo.com', password: 'password', role: 'MERCHANT' },
      { email: 'admin@demo.com', password: 'admin123', role: 'ADMIN' },
      { email: 'john@example.com', password: 'password', role: 'USER' },
      { email: 'merchant1@store.com', password: 'merchant123', role: 'MERCHANT' },
      { email: 'merchant2@shop.com', password: 'merchant123', role: 'MERCHANT' },
      { email: 'saiprasanna@gmail.com', password: 'bunny@123', role: 'USER' }
    ];
    
    console.log('Attempting login with:', this.loginData.email, '/', this.loginData.password);
    
    // Check demo credentials
    const validCredential = demoCredentials.find(cred => 
      cred.email.trim().toLowerCase() === this.loginData.email.trim().toLowerCase() && 
      cred.password === this.loginData.password
    );
    
    if (validCredential) {
      console.log('Demo authentication successful');
      this.createUserSession(validCredential.email, validCredential.role);
      return;
    }
    
    // Check if this email was used for merchant registration with password validation
    let merchantEmails = JSON.parse(localStorage.getItem('merchant_emails') || '[]');
    const registeredMerchants = JSON.parse(localStorage.getItem('registered_merchants') || '[]');
    
    // Check registered merchants with password
    const registeredMerchant = registeredMerchants.find((merchant: any) => 
      merchant.email.trim().toLowerCase() === this.loginData.email.trim().toLowerCase() && 
      merchant.password === this.loginData.password
    );
    
    if (registeredMerchant) {
      console.log('Registered merchant authentication successful');
      this.createUserSession(registeredMerchant.email, 'MERCHANT');
      return;
    }
    
    // Check registered users with password
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    console.log('All registered users:', registeredUsers);
    console.log('Looking for email:', this.loginData.email.trim().toLowerCase());
    console.log('Looking for password:', this.loginData.password);
    
    const registeredUser = registeredUsers.find((user: any) => {
      console.log('Checking user:', user.email, 'vs', this.loginData.email.trim().toLowerCase());
      console.log('Password match:', user.password === this.loginData.password);
      return user.email.trim().toLowerCase() === this.loginData.email.trim().toLowerCase() && 
             user.password === this.loginData.password;
    });
    
    if (registeredUser) {
      console.log('Registered user authentication successful');
      this.createUserSession(registeredUser.email, 'USER');
      return;
    }
    
    // If no valid credentials found, provide helpful error message
    console.log('Authentication failed for:', this.loginData.email);
    console.log('Available demo accounts:');
    demoCredentials.forEach(cred => console.log(`- ${cred.email} / ${cred.password}`));
    
    this.errorMessage = 'Invalid email or password. Try demo account: user@demo.com / password';
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private createUserSession(email: string, role: string = 'USER', userId?: number): void {
    console.log('👤 Creating session for:', email, 'with role:', role);
    
    // Create a simple session token
    const sessionData = {
      email: email,
      uid: userId || this.generateUserId(),
      role: role.toUpperCase(),
      loginTime: Date.now()
    };

    console.log('📝 Session data:', sessionData);

    // Create a simple token (in real app, this would come from backend)
    const token = btoa(JSON.stringify(sessionData));
    sessionStorage.setItem('token', token);
    
    // Also store user info for easy access
    sessionStorage.setItem('user_email', email);
    sessionStorage.setItem('user_id', sessionData.uid.toString());
    sessionStorage.setItem('user_role', role.toUpperCase());

    console.log('💾 Stored in sessionStorage - token, email, user_id, role');

    // Update the auth service token subject
    this.authService.updateTokenSubject();

    // Redirect based on role
    console.log('🚀 Redirecting based on role:', role.toUpperCase());
    if (role.toUpperCase() === 'MERCHANT') {
      console.log('🏦 Redirecting to merchant dashboard');
      this.router.navigate(['/merchant']);
    } else {
      console.log('🛍 Redirecting to deals page');
      this.router.navigate(['/deals']);
    }
  }

  private generateUserId(): number {
    // Use a consistent user ID based on email or create a persistent one
    let userId = localStorage.getItem('persistent_user_id');
    
    if (!userId) {
      // Generate a user ID that will work with our fallback system
      const validUserIds = [2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30, 31];
      const randomIndex = Math.floor(Math.random() * validUserIds.length);
      userId = validUserIds[randomIndex].toString();
      // Store in localStorage (persists across sessions)
      localStorage.setItem('persistent_user_id', userId);
    }
    
    return parseInt(userId);
  }
  
  /**
   * Debug method to check login form state
   */
  debugLogin(): void {
    console.log('🔍 LOGIN DEBUG INFO:');
    console.log('Email:', this.loginData.email);
    console.log('Password:', this.loginData.password);
    console.log('Email valid:', this.isValidEmail(this.loginData.email));
    console.log('Password length:', this.loginData.password.length);
    console.log('Form valid:', this.loginData.email && this.loginData.password && this.isValidEmail(this.loginData.email) && this.loginData.password.length >= 6);
    console.log('Error message:', this.errorMessage);
    
    // Test the authentication flow
    if (this.loginData.email && this.loginData.password) {
      console.log('🧪 Testing authentication...');
      this.onSubmit();
    } else {
      console.log('⚠️ Please fill in email and password first');
    }
  }
  
  /**
   * Quick login with predefined credentials
   */
  quickLogin(email: string, password: string): void {
    console.log('⚡ Quick login with:', email);
    this.loginData.email = email;
    this.loginData.password = password;
    this.onSubmit();
  }
  
  private createUserSessionFromBackend(response: any): void {
    console.log('Creating session from backend response:', response);
    
    // Store the actual JWT token from backend
    sessionStorage.setItem('token', response.token);
    
    // Parse token to get user info
    try {
      const payload = JSON.parse(atob(response.token.split('.')[1]));
      const email = payload.sub || response.email || this.loginData.email;
      const role = payload.role || response.role || 'USER';
      const userId = payload.uid || response.userId || this.generateUserId();
      
      // Store user info for easy access
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('user_id', userId.toString());
      sessionStorage.setItem('user_role', role.toUpperCase());

      // Update the auth service token subject
      this.authService.updateTokenSubject();

      // Redirect based on role
      console.log('Redirecting based on role:', role.toUpperCase());
      if (role.toUpperCase() === 'MERCHANT') {
        console.log('Redirecting to merchant dashboard');
        this.router.navigate(['/merchant']);
      } else {
        console.log('Redirecting to deals page');
        this.router.navigate(['/deals']);
      }
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      this.authenticateWithFallback();
    }
  }
}