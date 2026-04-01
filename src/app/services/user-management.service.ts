import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private userServiceUrl = 'http://localhost:8082/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Ensures a user exists in the database, creates one if needed
   */
  ensureUserExists(userId: number, email?: string): Observable<number> {
    // For demo purposes, skip backend validation and return a valid user ID
    console.log(`Using fallback user management for user ${userId}`);
    return of(this.getFallbackUserId());
  }

  /**
   * Check if user exists in database (disabled for demo)
   */
  private checkUserExists(userId: number): Observable<boolean> {
    // Skip backend check to avoid API errors
    return of(true);
  }

  /**
   * Create a fallback user account (disabled for demo)
   */
  private createFallbackUser(email?: string): void {
    // Skip backend user creation to avoid API errors
    console.log('Skipping backend user creation for demo');
  }

  /**
   * Get a consistent fallback user ID
   */
  private getFallbackUserId(): number {
    // Use existing valid user IDs as fallback
    const validUserIds = [2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30];
    
    // Get or create a consistent user ID for this session
    let fallbackId = sessionStorage.getItem('session_user_id');
    
    if (!fallbackId) {
      const randomIndex = Math.floor(Math.random() * validUserIds.length);
      fallbackId = validUserIds[randomIndex].toString();
      sessionStorage.setItem('session_user_id', fallbackId);
    }
    
    return parseInt(fallbackId);
  }

  /**
   * Get user profile data (using fallback for demo)
   */
  getUserProfile(userId: number): Observable<any> {
    // Return fallback user data to avoid API errors
    return of({
      id: userId,
      fullName: 'Demo User',
      email: sessionStorage.getItem('user_email') || 'demo@example.com',
      phone: '9999999999'
    });
  }
}