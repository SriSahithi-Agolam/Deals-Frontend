import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecureLoggerService {

  /**
   * Sanitizes input to prevent log injection attacks
   * Removes newlines, carriage returns, and limits length
   */
  private sanitize(input: any): string {
    if (input === null || input === undefined) {
      return 'null';
    }
    
    return String(input)
      .replace(/[\r\n\t]/g, ' ')  // Replace newlines and tabs with spaces
      .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
      .trim()
      .substring(0, 500);         // Limit length to prevent log flooding
  }

  /**
   * Secure info logging
   */
  info(message: string, data?: any): void {
    const sanitizedMessage = this.sanitize(message);
    if (data !== undefined) {
      const sanitizedData = this.sanitize(data);
      console.log(`[INFO] ${sanitizedMessage}:`, sanitizedData);
    } else {
      console.log(`[INFO] ${sanitizedMessage}`);
    }
  }

  /**
   * Secure error logging
   */
  error(message: string, error?: any): void {
    const sanitizedMessage = this.sanitize(message);
    if (error !== undefined) {
      // Only log safe error information
      const errorInfo = error?.message ? this.sanitize(error.message) : 'Unknown error';
      console.error(`[ERROR] ${sanitizedMessage}:`, errorInfo);
    } else {
      console.error(`[ERROR] ${sanitizedMessage}`);
    }
  }

  /**
   * Secure warning logging
   */
  warn(message: string, data?: any): void {
    const sanitizedMessage = this.sanitize(message);
    if (data !== undefined) {
      const sanitizedData = this.sanitize(data);
      console.warn(`[WARN] ${sanitizedMessage}:`, sanitizedData);
    } else {
      console.warn(`[WARN] ${sanitizedMessage}`);
    }
  }

  /**
   * Secure debug logging (only in development)
   */
  debug(message: string, data?: any): void {
    if (!this.isProduction()) {
      const sanitizedMessage = this.sanitize(message);
      if (data !== undefined) {
        const sanitizedData = this.sanitize(data);
        console.debug(`[DEBUG] ${sanitizedMessage}:`, sanitizedData);
      } else {
        console.debug(`[DEBUG] ${sanitizedMessage}`);
      }
    }
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1';
  }
}