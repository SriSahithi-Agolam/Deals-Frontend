import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_id');
    // Keep persistent_user_id in localStorage so orders persist
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserRole(): string | null {
    // First check sessionStorage for role
    const storedRole = sessionStorage.getItem('user_role');
    if (storedRole) {
      return storedRole;
    }
    
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'USER';
    } catch (error) {
      return 'USER';
    }
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) {
      // No token - create a user and return their ID
      return this.createAndGetUserId();
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const tokenUserId = payload.uid;
      
      // If token has invalid user ID, create a user
      if (!tokenUserId || tokenUserId < 1) {
        return this.createAndGetUserId();
      }
      
      return tokenUserId;
    } catch (error) {
      return this.createAndGetUserId();
    }
  }

  private createAndGetUserId(): number {
    // Check if we already have a persistent user ID
    const persistentUserId = localStorage.getItem('persistent_user_id');
    if (persistentUserId) {
      return parseInt(persistentUserId, 10);
    }
    
    // Create a new user and return their ID
    const userData = {
      fullName: `User ${Date.now()}`,
      email: `user${Date.now()}@example.com`,
      phone: '9999999999'
    };

    // Create user synchronously using fetch
    fetch('http://localhost:8082/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(user => {
      console.log('✅ Created new user:', user);
      localStorage.setItem('persistent_user_id', user.id.toString());
    })
    .catch(error => {
      console.log('⚠️ User creation failed, using default ID');
      localStorage.setItem('persistent_user_id', '1');
    });
    
    // Return default user ID 1 immediately (will be updated when user creation completes)
    return 1;
  }

  /**
   * Create a new user account for any login attempt
   */
  createUserIfNeeded(email?: string): void {
    const userData = {
      fullName: `User ${Date.now()}`,
      email: email || `user${Date.now()}@example.com`,
      phone: '9999999999'
    };

    // Try to create user in background
    fetch('http://localhost:8082/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).catch(() => {});
  }

  private setToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  /**
   * Update token subject when token changes externally
   */
  updateTokenSubject(): void {
    const token = this.getToken();
    this.tokenSubject.next(token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
