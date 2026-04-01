import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from './notification-email.service';

export interface User {
  id: number;
  email: string;
  password: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthSecurityService {
  private users = new BehaviorSubject<User[]>([]);
  private currentUser = new BehaviorSubject<User | null>(null);
  private twoFactorVerified = new BehaviorSubject<boolean>(false);

  constructor(private notificationService: NotificationService) {
    this.loadUsers();
  }

  // Enable 2FA for user
  enable2FA(userId: number): string {
    const secret = this.generateSecret();
    const users = this.users.value;
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.twoFactorEnabled = true;
      user.twoFactorSecret = secret;
      this.users.next(users);
      this.saveUsers();
    }
    
    return secret;
  }

  // Disable 2FA for user
  disable2FA(userId: number): void {
    const users = this.users.value;
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.twoFactorEnabled = false;
      user.twoFactorSecret = undefined;
      this.users.next(users);
      this.saveUsers();
    }
  }

  // Verify 2FA code
  verify2FACode(userId: number, code: string): boolean {
    const users = this.users.value;
    const user = users.find(u => u.id === userId);
    
    if (user && user.twoFactorSecret) {
      const isValid = this.validateTOTP(user.twoFactorSecret, code);
      if (isValid) {
        this.twoFactorVerified.next(true);
      }
      return isValid;
    }
    
    return false;
  }

  // Request password reset
  requestPasswordReset(email: string): boolean {
    const users = this.users.value;
    const user = users.find(u => u.email === email);
    
    if (user) {
      const resetToken = this.generateResetToken();
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      this.users.next(users);
      this.saveUsers();
      
      // Send reset email
      const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
      this.notificationService.sendPasswordReset(email, resetLink);
      
      return true;
    }
    
    return false;
  }

  // Reset password with token
  resetPassword(token: string, newPassword: string): boolean {
    const users = this.users.value;
    const user = users.find(u => u.resetToken === token);
    
    if (user && user.resetTokenExpiry && new Date() < user.resetTokenExpiry) {
      user.password = this.hashPassword(newPassword);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      
      this.users.next(users);
      this.saveUsers();
      
      return true;
    }
    
    return false;
  }

  // Change password
  changePassword(userId: number, oldPassword: string, newPassword: string): boolean {
    const users = this.users.value;
    const user = users.find(u => u.id === userId);
    
    if (user && this.verifyPassword(oldPassword, user.password)) {
      user.password = this.hashPassword(newPassword);
      this.users.next(users);
      this.saveUsers();
      return true;
    }
    
    return false;
  }

  // Get 2FA status
  is2FAEnabled(userId: number): boolean {
    const user = this.users.value.find(u => u.id === userId);
    return user?.twoFactorEnabled || false;
  }

  // Get 2FA verification status
  is2FAVerified(): Observable<boolean> {
    return this.twoFactorVerified.asObservable();
  }

  // Helper methods
  private generateSecret(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  private validateTOTP(secret: string, code: string): boolean {
    // Simplified TOTP validation - in production use proper library
    const expectedCode = this.generateTOTP(secret);
    return code === expectedCode;
  }

  private generateTOTP(secret: string): string {
    // Simplified TOTP generation - in production use proper library
    const time = Math.floor(Date.now() / 30000);
    const hash = this.simpleHash(secret + time);
    return (parseInt(hash, 16) % 1000000).toString().padStart(6, '0');
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private hashPassword(password: string): string {
    // Simplified hashing - in production use bcrypt
    return btoa(password);
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users.value));
  }

  private loadUsers(): void {
    const saved = localStorage.getItem('users');
    if (saved) {
      this.users.next(JSON.parse(saved));
    }
  }
}
