import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  createdAt: Date;
  name?: string;
  role?: string;
  status?: string;
}

export interface AdminDeal {
  id: number;
  title: string;
  discount: number;
  price: number;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  merchantId: number;
  expiryDate: Date;
}

export interface AdminOrder {
  id: number;
  userId?: number;
  customerId?: number;
  customerName?: string;
  totalAmount?: number;
  finalAmount?: number;
  amount?: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'PENDING' | 'CONFIRMED';
  orderDate?: Date;
  date?: Date;
  deliveryDate?: Date;
  orderItems?: any[];
  items?: number;
  deliveryAddress?: string;
}

export interface AdminMerchant {
  id: number;
  businessName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  category?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'Pending' | 'Approved' | 'Rejected' | 'Suspended';
  appliedDate?: Date;
  approvedDate?: Date;
  rejectedDate?: Date;
  suspendedDate?: Date;
  isActive?: boolean;
  rating?: number;
  totalDeals?: number;
  activeDeals?: number;
  totalOrders?: number;
  totalRevenue?: number;
  completionRate?: number;
  documents?: {
    businessLicense?: string;
    gstCertificate?: string;
    bankDetails?: string;
    identityProof?: string;
  };
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    accountHolderName?: string;
  };
  rejectionReason?: string;
  suspensionReason?: string;
  lastLoginDate?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SupportTicket {
  id: number;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdDate: Date;
  responses?: string[];
}

export interface AuditLog {
  id: number;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
}

export interface SystemStats {
  totalUsers: number;
  newUsersToday: number;
  totalMerchants: number;
  activeMerchants: number;
  activeDeals: number;
  expiringSoon: number;
  totalRevenue: number;
  todayRevenue: number;
}

export interface AnalyticsData {
  revenueData: { label: string; percentage: number }[];
  topMerchants: { name: string; revenue: number }[];
  topDeals: { title: string; views: number; conversions: number; conversionRate: number }[];
  liveViews: number;
  liveOrders: number;
  liveRevenue: number;
}

export interface Backup {
  id: number;
  name: string;
  date: Date;
  size: string;
}

export interface ApiStatus {
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  responseTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api';
  private userUrl = 'http://localhost:8082/api/users';
  private dealUrl = 'http://localhost:8084/api/deals';
  private orderUrl = 'http://localhost:8085/api/orders';
  private merchantUrl = 'http://localhost:8083/api/merchants';
  
  private statsSubject = new BehaviorSubject<SystemStats | null>(null);
  public stats$ = this.statsSubject.asObservable();
  
  private analyticsSubject = new BehaviorSubject<AnalyticsData | null>(null);
  public analytics$ = this.analyticsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeRealTimeUpdates();
  }

  // User Management
  getUsers(page: number = 0, size: number = 10, search?: string, role?: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/admin/all`).pipe(
      map(users => ({
        content: Array.isArray(users) ? users : (users?.content || []),
        totalElements: Array.isArray(users) ? users.length : (users?.totalElements || 0)
      })),
      catchError(err => {
        console.error('Error loading users:', err);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  createDeal(deal: Partial<AdminDeal>): Observable<AdminDeal> {
    return this.http.post<AdminDeal>(`${this.dealUrl}`, deal);
  }

  updateUser(id: number, user: Partial<AdminUser>): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.userUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}/${id}`);
  }

  bulkDeleteUsers(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.userUrl}/bulk-delete`, { ids });
  }

  toggleUserStatus(id: number): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.userUrl}/${id}/toggle-status`, {});
  }

  // Deal Management
  getDeals(page: number = 0, size: number = 10, search?: string, category?: string): Observable<any> {
    return this.http.get<any>(`${this.dealUrl}`).pipe(
      map(deals => ({
        content: Array.isArray(deals) ? deals : (deals?.content || []),
        totalElements: Array.isArray(deals) ? deals.length : (deals?.totalElements || 0)
      })),
      catchError(err => {
        console.error('Error loading deals:', err);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  updateDeal(id: number, deal: Partial<AdminDeal>): Observable<AdminDeal> {
    return this.http.put<AdminDeal>(`${this.dealUrl}/${id}`, deal);
  }

  deleteDeal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.dealUrl}/${id}`);
  }

  bulkDeleteDeals(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.dealUrl}/bulk-delete`, { ids });
  }

  toggleDealStatus(id: number): Observable<AdminDeal> {
    return this.http.patch<AdminDeal>(`${this.dealUrl}/${id}/toggle-status`, {});
  }

  // Order Management
  getOrders(page: number = 0, size: number = 10, search?: string, status?: string): Observable<any> {
    return this.http.get<any>(`${this.orderUrl}/admin/all`).pipe(
      map(orders => ({
        content: Array.isArray(orders) ? orders : (orders?.content || []),
        totalElements: Array.isArray(orders) ? orders.length : (orders?.totalElements || 0)
      })),
      catchError(err => {
        console.error('Error loading orders:', err);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  updateOrderStatus(id: number, status: string): Observable<AdminOrder> {
    return this.http.patch<AdminOrder>(`${this.orderUrl}/${id}/status`, { status });
  }

  processRefund(id: number, amount: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.orderUrl}/${id}/refund`, { amount, reason });
  }

  // Merchant Management
  getMerchants(page: number = 0, size: number = 10, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<any>(`${this.merchantUrl}/admin/all`, { params }).pipe(
      map(merchants => ({
        content: Array.isArray(merchants) ? merchants : (merchants?.content || []),
        totalElements: Array.isArray(merchants) ? merchants.length : (merchants?.totalElements || 0)
      })),
      catchError(err => {
        console.error('Error loading merchants:', err);
        // Return mock data for demo
        return of({
          content: [
            {
              id: 1,
              businessName: 'Tech Store',
              ownerName: 'John Doe',
              email: 'john@techstore.com',
              phone: '+1234567890',
              address: '123 Tech Street',
              gstNumber: 'GST123456789',
              category: 'Electronics',
              status: 'APPROVED',
              isActive: true,
              appliedDate: new Date('2024-01-15')
            },
            {
              id: 2,
              businessName: 'Fashion Hub',
              ownerName: 'Jane Smith',
              email: 'jane@fashionhub.com',
              phone: '+1234567891',
              address: '456 Fashion Ave',
              gstNumber: 'GST987654321',
              category: 'Fashion',
              status: 'PENDING',
              isActive: false,
              appliedDate: new Date('2024-01-20')
            },
            {
              id: 3,
              businessName: 'Food Court',
              ownerName: 'Mike Johnson',
              email: 'mike@foodcourt.com',
              phone: '+1234567892',
              address: '789 Food Street',
              gstNumber: 'GST456789123',
              category: 'Food',
              status: 'APPROVED',
              isActive: true,
              appliedDate: new Date('2024-01-10')
            }
          ],
          totalElements: 3
        });
      })
    );
  }

  getMerchantById(id: number): Observable<AdminMerchant> {
    return this.http.get<AdminMerchant>(`${this.merchantUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error loading merchant:', err);
        return of({} as AdminMerchant);
      })
    );
  }

  createMerchant(merchant: Partial<AdminMerchant>): Observable<AdminMerchant> {
    return this.http.post<AdminMerchant>(`${this.merchantUrl}/admin/create`, merchant).pipe(
      catchError(err => {
        console.error('Error creating merchant:', err);
        return of({} as AdminMerchant);
      })
    );
  }

  updateMerchant(id: number, merchant: Partial<AdminMerchant>): Observable<AdminMerchant> {
    return this.http.put<AdminMerchant>(`${this.merchantUrl}/admin/${id}`, merchant).pipe(
      catchError(err => {
        console.error('Error updating merchant:', err);
        return of({} as AdminMerchant);
      })
    );
  }

  deleteMerchant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.merchantUrl}/admin/${id}`).pipe(
      catchError(err => {
        console.error('Error deleting merchant:', err);
        return of(void 0);
      })
    );
  }

  approveMerchant(id: number): Observable<AdminMerchant> {
    return this.http.patch<AdminMerchant>(`${this.merchantUrl}/admin/${id}/approve`, {}).pipe(
      catchError(err => {
        console.error('Error approving merchant:', err);
        return of({} as AdminMerchant);
      })
    );
  }

  rejectMerchant(id: number, reason: string): Observable<void> {
    return this.http.patch<void>(`${this.merchantUrl}/admin/${id}/reject`, { reason }).pipe(
      catchError(err => {
        console.error('Error rejecting merchant:', err);
        return of(void 0);
      })
    );
  }

  suspendMerchant(id: number, reason: string): Observable<AdminMerchant> {
    return this.http.patch<AdminMerchant>(`${this.merchantUrl}/admin/${id}/suspend`, { reason }).pipe(
      catchError(err => {
        console.error('Error suspending merchant:', err);
        return of({} as AdminMerchant);
      })
    );
  }

  reactivateMerchant(id: number): Observable<AdminMerchant> {
    return this.http.patch<AdminMerchant>(`${this.merchantUrl}/admin/${id}/reactivate`, {}).pipe(
      catchError(err => {
        console.error('Error reactivating merchant:', err);
        return of({} as AdminMerchant);
      })
    );
  }

  getMerchantStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.merchantUrl}/admin/${id}/stats`).pipe(
      catchError(err => {
        console.error('Error loading merchant stats:', err);
        return of({
          totalDeals: 0,
          activeDeals: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageRating: 0,
          completionRate: 0
        });
      })
    );
  }

  getMerchantDeals(id: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.merchantUrl}/admin/${id}/deals`, { params }).pipe(
      catchError(err => {
        console.error('Error loading merchant deals:', err);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  getMerchantOrders(id: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.merchantUrl}/admin/${id}/orders`, { params }).pipe(
      catchError(err => {
        console.error('Error loading merchant orders:', err);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  bulkApproveMerchants(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.merchantUrl}/admin/bulk-approve`, { ids }).pipe(
      catchError(err => {
        console.error('Error bulk approving merchants:', err);
        return of(void 0);
      })
    );
  }

  bulkRejectMerchants(ids: number[], reason: string): Observable<void> {
    return this.http.post<void>(`${this.merchantUrl}/admin/bulk-reject`, { ids, reason }).pipe(
      catchError(err => {
        console.error('Error bulk rejecting merchants:', err);
        return of(void 0);
      })
    );
  }

  exportMerchants(): Observable<Blob> {
    return this.http.get(`${this.merchantUrl}/admin/export`, { responseType: 'blob' }).pipe(
      catchError(err => {
        console.error('Error exporting merchants:', err);
        return of(new Blob());
      })
    );
  }

  searchMerchants(query: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.merchantUrl}/admin/search`, { params }).pipe(
      catchError(err => {
        console.error('Error searching merchants:', err);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  // Support Tickets
  getTickets(page: number = 0, size: number = 10, priority?: string, status?: string): Observable<any> {
    return of({ content: [], totalElements: 0 });
  }

  replyToTicket(id: number, reply: string): Observable<SupportTicket> {
    return of({} as SupportTicket);
  }

  resolveTicket(id: number): Observable<void> {
    return of(void 0);
  }

  // Analytics
  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/analytics/dashboard`).pipe(
      catchError(err => {
        console.error('Error loading analytics:', err);
        return of({
          revenueData: [
            { label: 'Mon', percentage: 65 },
            { label: 'Tue', percentage: 75 },
            { label: 'Wed', percentage: 85 },
            { label: 'Thu', percentage: 70 },
            { label: 'Fri', percentage: 90 },
            { label: 'Sat', percentage: 95 },
            { label: 'Sun', percentage: 80 }
          ],
          topMerchants: [
            { name: 'Tech Store', revenue: 500000 },
            { name: 'Fashion Hub', revenue: 350000 },
            { name: 'Food Court', revenue: 250000 }
          ],
          topDeals: [
            { title: '50% Off Electronics', views: 5000, conversions: 450, conversionRate: 9 },
            { title: 'Fashion Sale', views: 3500, conversions: 280, conversionRate: 8 },
            { title: 'Food Discount', views: 2000, conversions: 160, conversionRate: 8 }
          ],
          liveViews: 342,
          liveOrders: 28,
          liveRevenue: 125000
        });
      })
    );
  }

  // System Stats
  getSystemStats(): Observable<SystemStats> {
    return this.http.get<SystemStats>(`${this.apiUrl}/analytics/system/stats`).pipe(
      catchError(err => {
        console.error('Error loading system stats:', err);
        return of({
          totalUsers: 156,
          newUsersToday: 12,
          totalMerchants: 23,
          activeMerchants: 18,
          activeDeals: 89,
          expiringSoon: 5,
          totalRevenue: 125000,
          todayRevenue: 8500
        });
      })
    );
  }

  // Audit Logs
  getAuditLogs(page: number = 0, size: number = 10, user?: string, action?: string): Observable<any> {
    return of({ content: [], totalElements: 0 });
  }

  // Backup & Restore
  getBackups(): Observable<Backup[]> {
    return of([]);
  }

  createBackup(): Observable<Backup> {
    return of({} as Backup);
  }

  restoreBackup(id: number): Observable<void> {
    return of(void 0);
  }

  deleteBackup(id: number): Observable<void> {
    return of(void 0);
  }

  // System Monitoring
  getApiStatus(): Observable<ApiStatus[]> {
    return of([
      { name: 'User Service', status: 'ONLINE', responseTime: 45 },
      { name: 'Deal Service', status: 'ONLINE', responseTime: 52 },
      { name: 'Order Service', status: 'ONLINE', responseTime: 38 },
      { name: 'Merchant Service', status: 'ONLINE', responseTime: 40 }
    ]);
  }

  getServerStats(): Observable<{ cpu: number; memory: number }> {
    return of({ cpu: 65, memory: 72 });
  }

  // Export
  exportUsers(): Observable<Blob> {
    return of(new Blob());
  }

  exportDeals(): Observable<Blob> {
    return of(new Blob());
  }

  exportOrders(): Observable<Blob> {
    return of(new Blob());
  }

  // Real-time Updates
  private initializeRealTimeUpdates(): void {
    interval(30000).subscribe(() => {
      this.getSystemStats().subscribe();
      this.getAnalytics().subscribe();
    });
  }

  // Utility
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
