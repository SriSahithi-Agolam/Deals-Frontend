import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = { fullName: '', email: '', password: '', role: 'USER' };
  errorMessage = '';
  successMessage = '';
  confirmPassword = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validation
    if (!this.registerData.fullName || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }
    
    if (!this.isValidEmail(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }
    
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }
    
    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    if (existingUsers.some((user: any) => user.email === this.registerData.email)) {
      this.errorMessage = 'Email already registered. Please use a different email.';
      return;
    }
    
    // Try backend registration first
    this.http.post<any>('http://localhost:8080/api/auth/register', this.registerData)
      .subscribe({
        next: (response) => {
          console.log('Backend registration successful:', response);
          this.successMessage = 'Registration successful! You can now login with your credentials.';
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.log('Backend registration failed, storing locally:', error);
          // Fallback to local storage
          this.storeUserLocally();
          this.successMessage = 'Registration successful! You can now login with your credentials.';
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
  }
  
  private storeUserLocally(): void {
    // Store user credentials locally for demo purposes
    const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const newUser = {
      id: Date.now(),
      fullName: this.registerData.fullName,
      email: this.registerData.email,
      password: this.registerData.password, // In production, this should be hashed
      role: 'USER',
      registrationDate: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    console.log('User stored locally:', newUser.email);
    console.log('All users now:', JSON.parse(localStorage.getItem('registered_users') || '[]'));
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
