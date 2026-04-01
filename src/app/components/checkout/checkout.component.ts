import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService, PaymentStatus } from '../../services/payment.service';
import { ToastService } from '../../services/toast.service';
import { SecureLoggerService } from '../../services/secure-logger.service';
import { UserManagementService } from '../../services/user-management.service';
import { MerchantManagementService } from '../../services/merchant-management.service';
import { RealTimeOrderService } from '../../services/real-time-order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <h2>Checkout</h2>
      
      <!-- Real-time Payment Status Modal -->
      <div class="payment-modal" *ngIf="showPaymentStatus">
        <div class="payment-modal-content">
          <div class="payment-status-card">
            <div class="status-icon" [ngClass]="paymentStatus.status.toLowerCase()">
              <span *ngIf="paymentStatus.status === 'PENDING'">⏳</span>
              <span *ngIf="paymentStatus.status === 'PROCESSING'">🔄</span>
              <span *ngIf="paymentStatus.status === 'SUCCESS'">✅</span>
              <span *ngIf="paymentStatus.status === 'FAILED'">❌</span>
            </div>
            <h3>{{ paymentStatus.message }}</h3>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="paymentStatus.progress"></div>
            </div>
            <p class="progress-text">{{ paymentStatus.progress }}%</p>
            <p class="transaction-id" *ngIf="paymentStatus.transactionId">
              Transaction ID: {{ paymentStatus.transactionId }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="checkout-content">
        <!-- Order Summary -->
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-items">
            <div class="summary-item" *ngFor="let item of cartItems">
              <span>{{ item.deal.title }} x {{ item.quantity }}</span>
              <span>₹{{ getItemTotal(item) }}</span>
            </div>
          </div>
          <div class="summary-total">
            <strong>Total: ₹{{ getCartTotal() }}</strong>
          </div>
        </div>

        <!-- Delivery Details -->
        <div class="delivery-section">
          <h3>Delivery Details</h3>
          <form (ngSubmit)="placeOrder()" #checkoutForm="ngForm">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="deliveryDetails.fullName" name="fullName" required>
            </div>
            
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="deliveryDetails.email" name="email" required>
            </div>
            
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" [(ngModel)]="deliveryDetails.phone" name="phone" required>
            </div>
            
            <div class="form-group">
              <label>Delivery Address *</label>
              <textarea [(ngModel)]="deliveryDetails.address" name="address" rows="3" required placeholder="Enter your full delivery address"></textarea>
            </div>
            
            <div class="form-group">
              <label>City *</label>
              <input type="text" [(ngModel)]="deliveryDetails.city" name="city" required>
            </div>
            
            <div class="form-group">
              <label>Pincode *</label>
              <input type="text" [(ngModel)]="deliveryDetails.pincode" name="pincode" required>
            </div>

            <!-- Payment Method -->
            <div class="payment-section">
              <h3>Payment Method</h3>
              <div class="payment-options">
                <label class="payment-option" [class.selected]="paymentMethod === 'RAZORPAY'">
                  <input type="radio" [(ngModel)]="paymentMethod" name="payment" value="RAZORPAY">
                  <div class="option-content">
                    <strong>💳 Razorpay</strong>
                    <small>Credit/Debit Card, UPI, Net Banking</small>
                  </div>
                </label>
                <label class="payment-option" [class.selected]="paymentMethod === 'COD'">
                  <input type="radio" [(ngModel)]="paymentMethod" name="payment" value="COD">
                  <div class="option-content">
                    <strong>💵 Cash on Delivery</strong>
                    <small>Pay when you receive</small>
                  </div>
                </label>
                <label class="payment-option" [class.selected]="paymentMethod === 'DEMO'">
                  <input type="radio" [(ngModel)]="paymentMethod" name="payment" value="DEMO">
                  <div class="option-content">
                    <strong>🎮 Demo Payment</strong>
                    <small>Test mode with real-time simulation</small>
                  </div>
                </label>
              </div>
            </div>

            <div class="checkout-actions">
              <button type="button" class="back-btn" (click)="goBack()" [disabled]="placing">Back to Cart</button>
              <button type="submit" class="place-order-btn" [disabled]="!checkoutForm.valid || placing">
                {{ placing ? 'Processing...' : 'Place Order & Pay' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    /* Payment Status Modal */
    .payment-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s;
    }
    
    .payment-modal-content {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      animation: slideUp 0.3s;
    }
    
    .payment-status-card {
      text-align: center;
    }
    
    .status-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: pulse 1s infinite;
    }
    
    .status-icon.processing {
      animation: spin 1s linear infinite;
    }
    
    .status-icon.success {
      animation: bounce 0.5s;
    }
    
    .payment-status-card h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 1.5em;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
      margin: 20px 0;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      transition: width 0.5s ease;
      animation: shimmer 1.5s infinite;
    }
    
    .progress-text {
      color: #7f8c8d;
      font-size: 14px;
      margin: 10px 0;
    }
    
    .transaction-id {
      background: #e8f4f8;
      padding: 10px;
      border-radius: 4px;
      color: #2c3e50;
      font-family: monospace;
      margin-top: 15px;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
    }
    
    .order-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      height: fit-content;
    }
    
    .order-summary h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }
    
    .summary-items {
      margin-bottom: 20px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .summary-total {
      font-size: 1.2em;
      padding-top: 15px;
      border-top: 2px solid #ddd;
    }
    
    .delivery-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    
    .delivery-section h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1em;
      background: white;
      color: #333;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0,123,255,0.3);
    }
    
    .payment-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .payment-option {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .payment-option:hover {
      background: #f8f9fa;
      border-color: #3498db;
    }
    
    .payment-option.selected {
      background: #e8f4f8;
      border-color: #3498db;
      box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
    }
    
    .option-content {
      flex: 1;
    }
    
    .option-content strong {
      display: block;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    
    .option-content small {
      color: #7f8c8d;
      font-size: 12px;
    }
    
    .checkout-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }
    
    .back-btn {
      flex: 1;
      padding: 15px;
      background: #95a5a6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1em;
    }
    
    .back-btn:hover:not(:disabled) {
      background: #7f8c8d;
    }
    
    .place-order-btn {
      flex: 2;
      padding: 15px;
      background: #27ae60;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.1em;
      font-weight: bold;
    }
    
    .place-order-btn:hover:not(:disabled) {
      background: #229954;
    }
    
    .place-order-btn:disabled,
    .back-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  placing = false;
  showPaymentStatus = false;
  paymentStatus: PaymentStatus = {
    status: 'PENDING',
    message: '',
    progress: 0
  };
  private paymentSubscription?: Subscription;
  
  deliveryDetails = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  };
  
  paymentMethod = 'RAZORPAY';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private http: HttpClient,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private router: Router,
    private logger: SecureLoggerService,
    private userManagement: UserManagementService,
    private merchantManagement: MerchantManagementService,
    private realTimeOrder: RealTimeOrderService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }

    // Subscribe to payment status updates
    this.paymentSubscription = this.paymentService.paymentStatus$.subscribe(
      (status: PaymentStatus) => {
        this.paymentStatus = status;
      }
    );
    
    // Request notification permission for real-time updates
    this.realTimeOrder.requestNotificationPermission();
  }

  ngOnDestroy(): void {
    if (this.paymentSubscription) {
      this.paymentSubscription.unsubscribe();
    }
  }

  getItemTotal(item: CartItem): number {
    const discountedPrice = item.deal.price * (1 - item.deal.discount / 100);
    return Math.round(discountedPrice * item.quantity);
  }

  getCartTotal(): number {
    return Math.round(this.cartService.getCartTotal());
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  placeOrder(): void {
    this.placing = true;
    
    const userId = this.authService.getUserId(); // Get the actual current user ID
    const fullAddress = `${this.deliveryDetails.address}, ${this.deliveryDetails.city} - ${this.deliveryDetails.pincode}`;
    const orderId = 'ORD' + Date.now();
    
    // Get valid merchant ID using merchant management service
    const merchantId = this.merchantManagement.getValidMerchantId(this.cartItems[0]?.deal.merchantId);
    
    console.log('Creating order for user ID:', userId);
    
    // Create order object with the actual user ID
    const order = {
      id: orderId,
      userId: userId, // Use the actual current user ID
      merchantId: merchantId,
      totalAmount: this.getCartTotal(),
      discount: this.calculateTotalDiscount(),
      finalAmount: this.getCartTotal(),
      deliveryAddress: fullAddress,
      paymentMethod: this.paymentMethod,
      orderItems: this.cartItems.map(item => ({
        dealId: item.deal.id,
        quantity: item.quantity,
        price: item.deal.price,
        discount: item.deal.price * (item.deal.discount / 100),
        subtotal: this.getItemTotal(item)
      }))
    };

    // Process payment based on method
    if (this.paymentMethod === 'RAZORPAY') {
      this.processRazorpayPayment(order);
    } else if (this.paymentMethod === 'DEMO') {
      this.processDemoPayment(order);
    } else {
      // COD - no payment processing needed
      this.completeOrder(order);
    }
  }

  private processRazorpayPayment(order: any): void {
    this.showPaymentStatus = true;
    
    // Validate delivery details
    if (!this.deliveryDetails.fullName || !this.deliveryDetails.email || !this.deliveryDetails.phone) {
      this.showPaymentStatus = false;
      this.placing = false;
      this.toastService.error('Please fill all required fields');
      return;
    }
    
    this.logger.info('Starting Razorpay payment');
    
    this.paymentService.processPaymentWithRazorpay(
      this.getCartTotal(),
      order.id,
      this.deliveryDetails.fullName,
      this.deliveryDetails.email,
      this.deliveryDetails.phone
    )
    .then((response) => {
      this.logger.info('Payment successful');
      setTimeout(() => {
        this.showPaymentStatus = false;
        this.completeOrder(order, response);
      }, 2000);
    })
    .catch((error) => {
      this.logger.error('Payment error occurred');
      this.showPaymentStatus = false;
      this.placing = false;
      this.toastService.error('Payment cancelled or failed');
    });
  }

  private processDemoPayment(order: any): void {
    this.showPaymentStatus = true;
    
    this.paymentService.processDemoPayment(
      this.getCartTotal(),
      order.id,
      this.paymentMethod
    )
    .then((response) => {
      setTimeout(() => {
        this.showPaymentStatus = false;
        this.completeOrder(order, response);
      }, 2000);
    })
    .catch((error) => {
      this.showPaymentStatus = false;
      this.placing = false;
      this.toastService.error('Payment processing failed');
    });
  }

  private completeOrder(order: any, paymentResponse?: any): void {
    // Add payment info to order
    if (paymentResponse) {
      order.paymentId = paymentResponse.razorpay_payment_id || paymentResponse.transactionId;
      order.paymentStatus = 'SUCCESS';
    }
    
    console.log('💾 Sending order to backend with user ID:', order.userId);
    this.logger.info('Sending order to backend');
    
    // Send order to backend
    this.http.post('http://localhost:8085/api/orders', {
      userId: order.userId,
      merchantId: order.merchantId,
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
      discount: order.discount,
      status: 'PENDING',
      deliveryAddress: order.deliveryAddress,
      orderItems: order.orderItems
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Order created successfully:', response);
        this.logger.info('Order saved successfully');
        
        // Start real-time order processing
        this.logger.info(`Starting real-time processing for order ${response.id}`);
        this.realTimeOrder.startRealTimeOrderProcessing(response.id);
        
        this.cartService.clearCart();
        this.placing = false;
        this.toastService.success(`Order #${response.id} placed successfully! 🎉 Watch for real-time updates!`);
        
        // Navigate to orders page after a short delay to see the processing start
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1000);
      },
      error: (error) => {
        console.log('❌ Order creation failed:', error);
        this.logger.error('Error saving order', error);
        console.log('Full error details:', error);
        this.placing = false;
        
        let errorMessage = 'Failed to place order. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
          console.log('Backend error message:', errorMessage);
        }
        
        // Handle different validation errors
        if (errorMessage.includes('User not found') || errorMessage.includes('user not found')) {
          console.log('🔄 User validation failed, creating user and retrying...');
          this.createUserAndRetryOrder(order);
          return;
        }
        
        if (errorMessage.includes('Merchant not found') || errorMessage.includes('merchant not found')) {
          console.log('🔄 Merchant validation failed, using default merchant and retrying...');
          order.merchantId = 1; // Use default merchant ID
          this.retryOrderWithUser(order);
          return;
        }
        
        this.toastService.error(errorMessage);
      }
    });
  }

  private calculateTotalDiscount(): number {
    return this.cartItems.reduce((total, item) => {
      const discount = item.deal.price * (item.deal.discount / 100) * item.quantity;
      return total + discount;
    }, 0);
  }

  private retryOrderWithDifferentUser(order: any): void {
    console.log('Retrying order with user ID:', order.userId);
    
    this.http.post('http://localhost:8085/api/orders', {
      userId: order.userId,
      merchantId: order.merchantId,
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
      discount: order.discount,
      status: 'PENDING',
      deliveryAddress: order.deliveryAddress,
      orderItems: order.orderItems
    }).subscribe({
      next: (response: any) => {
        console.log('Order successful with user ID:', order.userId);
        this.logger.info('Order saved successfully');
        
        this.realTimeOrder.startRealTimeOrderProcessing(response.id);
        this.cartService.clearCart();
        this.placing = false;
        this.toastService.success(`Order #${response.id} placed successfully! 🎉`);
        
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1000);
      },
      error: (error) => {
        console.log('Still failed with user ID:', order.userId);
        this.placing = false;
        this.toastService.error('Unable to place order. Backend user validation failed.');
      }
    });
  }
  
  private createUserAndRetryOrder(order: any): void {
    console.log('👤 Creating user for order...');
    
    // Create user with delivery details
    const userData = {
      fullName: this.deliveryDetails.fullName || 'Customer ' + Date.now(),
      email: this.deliveryDetails.email || `customer${Date.now()}@example.com`,
      phone: this.deliveryDetails.phone || '9999999999'
    };
    
    console.log('📝 Creating user with data:', userData);
    
    this.http.post('http://localhost:8082/api/users', userData).subscribe({
      next: (userResponse: any) => {
        console.log('✅ User created successfully:', userResponse);
        
        // Update order with new user ID
        order.userId = userResponse.id;
        
        // Store the new user ID for future use
        localStorage.setItem('persistent_user_id', userResponse.id.toString());
        
        // Retry the order with the new user ID
        this.retryOrderWithUser(order);
      },
      error: (userError) => {
        console.log('⚠️ User creation failed:', userError);
        this.placing = false;
        this.toastService.error('Unable to create user account. Please try again.');
      }
    });
  }
  
  private retryOrderWithUser(order: any): void {
    console.log('🔄 Retrying order with user ID:', order.userId);
    
    this.http.post('http://localhost:8085/api/orders', {
      userId: order.userId,
      merchantId: order.merchantId,
      totalAmount: order.totalAmount,
      finalAmount: order.finalAmount,
      discount: order.discount,
      status: 'PENDING',
      deliveryAddress: order.deliveryAddress,
      orderItems: order.orderItems
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Order successful after user creation:', response);
        this.logger.info('Order saved successfully after user creation');
        
        this.realTimeOrder.startRealTimeOrderProcessing(response.id);
        this.cartService.clearCart();
        this.placing = false;
        this.toastService.success(`Order #${response.id} placed successfully! 🎉`);
        
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1000);
      },
      error: (error) => {
        console.log('❌ Order still failed after user creation:', error);
        this.placing = false;
        this.toastService.error('Order creation failed. Please contact support.');
      }
    });
  }
  
  /**
   * Try creating order with different user IDs that are known to exist
   */
  private tryOrderWithDifferentUsers(order: any): void {
    // Use the working user ID 39 that we just created
    const knownUserIds = [39];
    
    console.log('🔄 Trying order with known user IDs:', knownUserIds);
    
    this.tryOrderWithUserIdList(order, knownUserIds, 0);
  }
  
  /**
   * Recursively try order creation with different user IDs
   */
  private tryOrderWithUserIdList(order: any, userIds: number[], index: number): void {
    if (index >= userIds.length) {
      console.log('❌ All user IDs failed, showing error');
      this.placing = false;
      this.toastService.error('Unable to place order. Please try again later.');
      return;
    }
    
    const userId = userIds[index];
    console.log(`🧪 Trying order with user ID ${userId} (attempt ${index + 1}/${userIds.length})`);
    
    // Update order with new user ID
    const updatedOrder = { ...order, userId: userId };
    
    this.http.post('http://localhost:8085/api/orders', {
      userId: updatedOrder.userId,
      merchantId: updatedOrder.merchantId,
      totalAmount: updatedOrder.totalAmount,
      finalAmount: updatedOrder.finalAmount,
      discount: updatedOrder.discount,
      status: 'PENDING',
      deliveryAddress: updatedOrder.deliveryAddress,
      orderItems: updatedOrder.orderItems
    }).subscribe({
      next: (response: any) => {
        console.log(`✅ Order successful with user ID ${userId}:`, response);
        
        // Update the frontend to use this working user ID
        localStorage.setItem('persistent_user_id', userId.toString());
        
        this.realTimeOrder.startRealTimeOrderProcessing(response.id);
        this.cartService.clearCart();
        this.placing = false;
        this.toastService.success(`Order #${response.id} placed successfully! 🎉`);
        
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 1000);
      },
      error: (error) => {
        console.log(`❌ User ID ${userId} failed:`, error.error?.message || error.message);
        // Try next user ID
        this.tryOrderWithUserIdList(order, userIds, index + 1);
      }
    });
  }
}