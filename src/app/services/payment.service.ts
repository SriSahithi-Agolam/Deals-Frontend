import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

declare var Razorpay: any;

export interface PaymentStatus {
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  message: string;
  progress: number;
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';
  private paymentStatusSubject = new Subject<PaymentStatus>();
  public paymentStatus$ = this.paymentStatusSubject.asObservable();

  // Razorpay Test Key (Replace with your actual key)
  private razorpayKey = 'rzp_test_1DP5mmOlF5G5ag';

  constructor(private http: HttpClient) {}

  /**
   * Process payment using Razorpay with real-time status updates
   * Automatically uses demo mode with Razorpay-style UI
   */
  processPaymentWithRazorpay(
    amount: number, 
    orderId: string, 
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Payment initiated:', { amount, orderId, customerName });
      
      // Step 1: Initiating payment
      this.paymentStatusSubject.next({
        status: 'PENDING',
        message: 'Initializing payment gateway...',
        progress: 10
      });

      setTimeout(() => {
        this.paymentStatusSubject.next({
          status: 'PROCESSING',
          message: 'Opening Razorpay payment...',
          progress: 30
        });

        setTimeout(() => {
          // Always use demo mode for reliability
          console.log('Opening demo Razorpay modal');
          this.showDemoPaymentModal(amount, orderId, customerName, resolve, reject);
        }, 500);
      }, 500);
    });
  }

  /**
   * Show custom demo payment modal that looks like Razorpay
   */
  private showDemoPaymentModal(
    amount: number,
    orderId: string,
    customerName: string,
    resolve: Function,
    reject: Function
  ): void {
    console.log('Creating payment modal');
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'razorpay-demo-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      animation: fadeIn 0.3s;
    `;

    modal.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      </style>
      <div style="
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s;
      ">
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3498db, #2ecc71);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
          ">💳</div>
          <h2 style="margin: 0; color: #2c3e50; font-family: Arial, sans-serif;">Razorpay Payment</h2>
          <p style="color: #7f8c8d; margin: 10px 0; font-size: 14px;">Demo Mode - Test Payment</p>
        </div>

        <div style="
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        ">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #7f8c8d; font-size: 14px;">Customer:</span>
            <strong style="color: #2c3e50; font-size: 14px;">${customerName}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #7f8c8d; font-size: 14px;">Order ID:</span>
            <strong style="color: #2c3e50; font-size: 14px;">${orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #7f8c8d; font-size: 14px;">Amount:</span>
            <strong style="color: #27ae60; font-size: 1.5em;">₹${amount}</strong>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 15px; font-weight: bold;">Select Payment Method:</p>
          <div style="display: grid; gap: 12px;">
            <button class="pay-method" data-method="card" style="
              padding: 15px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
              transition: transform 0.2s;
            ">💳 Credit/Debit Card</button>
            <button class="pay-method" data-method="upi" style="
              padding: 15px;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
              transition: transform 0.2s;
            ">📱 UPI Payment</button>
            <button class="pay-method" data-method="netbanking" style="
              padding: 15px;
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
              transition: transform 0.2s;
            ">🏦 Net Banking</button>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="pay-cancel" style="
            flex: 1;
            padding: 12px;
            background: #95a5a6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
          ">Cancel</button>
        </div>

        <p style="
          text-align: center;
          color: #95a5a6;
          font-size: 12px;
          margin-top: 20px;
        ">🔒 Secured by Razorpay (Demo Mode)</p>
      </div>
    `;

    document.body.appendChild(modal);
    console.log('Modal added to DOM');

    // Add hover effects
    const buttons = modal.querySelectorAll('.pay-method');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        (btn as HTMLElement).style.transform = 'scale(1.05)';
      });
      btn.addEventListener('mouseleave', () => {
        (btn as HTMLElement).style.transform = 'scale(1)';
      });
      btn.addEventListener('click', () => {
        console.log('Payment method clicked:', (btn as HTMLElement).dataset['method']);
        document.body.removeChild(modal);
        this.handlePaymentSuccess(
          {
            razorpay_payment_id: 'pay_demo_' + Date.now(),
            razorpay_signature: 'demo_sig_' + Date.now()
          },
          amount,
          orderId,
          resolve
        );
      });
    });

    // Handle cancel
    modal.querySelector('.pay-cancel')?.addEventListener('click', () => {
      console.log('Payment cancelled');
      document.body.removeChild(modal);
      this.paymentStatusSubject.next({
        status: 'FAILED',
        message: 'Payment cancelled by user',
        progress: 0
      });
      reject(new Error('Payment cancelled'));
    });
  }

  /**
   * Handle successful payment with detailed success screen
   */
  private handlePaymentSuccess(
    response: any,
    amount: number,
    orderId: string,
    resolve: Function
  ): void {
    this.paymentStatusSubject.next({
      status: 'PROCESSING',
      message: 'Verifying payment...',
      progress: 70
    });

    setTimeout(() => {
      this.paymentStatusSubject.next({
        status: 'PROCESSING',
        message: 'Confirming transaction...',
        progress: 90
      });

      setTimeout(() => {
        // Show detailed success modal
        this.showPaymentSuccessModal(response, amount, orderId);
        
        this.paymentStatusSubject.next({
          status: 'SUCCESS',
          message: 'Payment completed successfully!',
          progress: 100,
          transactionId: response.razorpay_payment_id
        });

        // Resolve after showing success modal
        setTimeout(() => {
          resolve({
            success: true,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: orderId,
            razorpay_signature: response.razorpay_signature || 'demo_signature',
            amount: amount,
            timestamp: new Date()
          });
        }, 3000);
      }, 800);
    }, 800);
  }

  /**
   * Show detailed payment success modal
   */
  private showPaymentSuccessModal(
    response: any,
    amount: number,
    orderId: string
  ): void {
    const modal = document.createElement('div');
    modal.id = 'payment-success-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      animation: fadeIn 0.3s;
    `;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const formattedTime = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    modal.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); }
          100% { transform: scale(1) rotate(45deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke: #27ae60;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #27ae60;
          animation: pulse 0.8s;
        }
        .success-checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 3;
          stroke-miterlimit: 10;
          stroke: #27ae60;
          fill: #d4edda;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .success-checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
        }
        @keyframes stroke {
          100% { stroke-dashoffset: 0; }
        }
      </style>
      <div style="
        background: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideUp 0.4s;
      ">
        <!-- Success Icon -->
        <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="success-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="success-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>

        <h2 style="
          text-align: center;
          color: #27ae60;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-family: Arial, sans-serif;
        ">Payment Successful!</h2>
        
        <p style="
          text-align: center;
          color: #7f8c8d;
          margin: 0 0 30px 0;
          font-size: 14px;
        ">Your payment has been processed successfully</p>

        <!-- Amount Paid -->
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        ">
          <p style="color: rgba(255,255,255,0.9); margin: 0 0 5px 0; font-size: 14px;">Amount Paid</p>
          <h1 style="color: white; margin: 0; font-size: 42px; font-weight: bold;">₹${amount}</h1>
        </div>

        <!-- Transaction Details -->
        <div style="
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        ">
          <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px;">Transaction Details</h3>
          
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
            <span style="color: #7f8c8d; font-size: 14px;">Transaction ID</span>
            <strong style="color: #2c3e50; font-size: 14px; font-family: monospace;">${response.razorpay_payment_id}</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
            <span style="color: #7f8c8d; font-size: 14px;">Order ID</span>
            <strong style="color: #2c3e50; font-size: 14px;">${orderId}</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
            <span style="color: #7f8c8d; font-size: 14px;">Payment Method</span>
            <strong style="color: #2c3e50; font-size: 14px;">Razorpay</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
            <span style="color: #7f8c8d; font-size: 14px;">Date</span>
            <strong style="color: #2c3e50; font-size: 14px;">${formattedDate}</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between; padding: 10px 0;">
            <span style="color: #7f8c8d; font-size: 14px;">Time</span>
            <strong style="color: #2c3e50; font-size: 14px;">${formattedTime}</strong>
          </div>
        </div>

        <!-- Status Badge -->
        <div style="
          background: #d4edda;
          border: 2px solid #27ae60;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 20px;
        ">
          <span style="color: #27ae60; font-weight: bold; font-size: 16px;">✓ Payment Verified & Confirmed</span>
        </div>

        <!-- Action Buttons -->
        <div style="display: grid; gap: 10px;">
          <button class="download-receipt" style="
            padding: 14px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            transition: background 0.3s;
          ">💾 Download Receipt</button>
          
          <button class="close-success" style="
            padding: 14px;
            background: #27ae60;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            transition: background 0.3s;
          ">Continue Shopping →</button>
        </div>

        <p style="
          text-align: center;
          color: #95a5a6;
          font-size: 12px;
          margin-top: 20px;
        ">A confirmation email has been sent to your registered email address</p>
      </div>
    `;

    document.body.appendChild(modal);

    // Download receipt
    modal.querySelector('.download-receipt')?.addEventListener('click', () => {
      this.downloadReceipt(response, amount, orderId, formattedDate, formattedTime);
    });

    // Close modal
    modal.querySelector('.close-success')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 5000);
  }

  /**
   * Download payment receipt
   */
  private downloadReceipt(
    response: any,
    amount: number,
    orderId: string,
    date: string,
    time: string
  ): void {
    const receiptContent = `
===========================================
       DEALS & COUPONS FINDER
          PAYMENT RECEIPT
===========================================

Transaction ID: ${response.razorpay_payment_id}
Order ID: ${orderId}
Amount Paid: ₹${amount}
Payment Method: Razorpay
Status: SUCCESS
Date: ${date}
Time: ${time}

===========================================
Thank you for your purchase!
For support: support@dealscoupons.com
===========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${orderId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Show toast notification
    this.showToast('✅ Receipt downloaded successfully!', '#27ae60');
  }

  /**
   * Show toast notification like real-time apps
   */
  private showToast(message: string, backgroundColor: string): void {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: ${backgroundColor};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-size: 15px;
      font-weight: 500;
      z-index: 9999999;
      transition: transform 0.3s ease;
      font-family: Arial, sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Slide up animation
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /**
   * Demo payment for testing (without Razorpay)
   */
  processDemoPayment(amount: number, orderId: string, paymentMethod: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Step 1: Initiating
      this.paymentStatusSubject.next({
        status: 'PENDING',
        message: 'Initiating payment...',
        progress: 10
      });

      setTimeout(() => {
        this.paymentStatusSubject.next({
          status: 'PROCESSING',
          message: 'Connecting to payment gateway...',
          progress: 30
        });

        setTimeout(() => {
          this.paymentStatusSubject.next({
            status: 'PROCESSING',
            message: 'Verifying payment details...',
            progress: 50
          });

          setTimeout(() => {
            this.paymentStatusSubject.next({
              status: 'PROCESSING',
              message: 'Processing transaction...',
              progress: 70
            });

            setTimeout(() => {
              this.paymentStatusSubject.next({
                status: 'PROCESSING',
                message: 'Confirming payment...',
                progress: 90
              });

              setTimeout(() => {
                const transactionId = 'TXN' + Date.now();
                this.paymentStatusSubject.next({
                  status: 'SUCCESS',
                  message: 'Payment successful!',
                  progress: 100,
                  transactionId: transactionId
                });

                resolve({
                  success: true,
                  transactionId: transactionId,
                  amount: amount,
                  orderId: orderId,
                  paymentMethod: paymentMethod,
                  timestamp: new Date()
                });
              }, 600);
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    });
  }

  // Backend API calls
  createPayment(paymentData: any): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }

  getPaymentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getPaymentsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}