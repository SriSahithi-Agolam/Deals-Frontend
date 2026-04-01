import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import { AdminService, AdminUser, AdminDeal, AdminOrder, AdminMerchant, SupportTicket, AuditLog, Backup, ApiStatus } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit, OnDestroy {
  Math = Math;
  activeTab = 'dashboard';
  isLoading = false;
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  
  // Stats
  stats: any = {
    totalUsers: 0,
    newUsersToday: 0,
    totalMerchants: 0,
    activeMerchants: 0,
    activeDeals: 0,
    expiringSoon: 0,
    totalRevenue: 0,
    todayRevenue: 0
  };
  
  // Data
  users: AdminUser[] = [];
  deals: AdminDeal[] = [];
  orders: AdminOrder[] = [];
  merchants: AdminMerchant[] = [];
  tickets: SupportTicket[] = [];
  auditLogs: AuditLog[] = [];
  backups: Backup[] = [];
  apiStatus: ApiStatus[] = [];
  
  // Filters
  userSearch = '';
  userRoleFilter = '';
  dealSearch = '';
  dealCategoryFilter = '';
  orderSearch = '';
  orderStatusFilter = '';
  merchantStatusFilter = '';
  ticketPriorityFilter = '';
  ticketStatusFilter = '';
  
  // Selection
  selectedUsers: number[] = [];
  selectedDeals: number[] = [];
  
  // Forms
  userForm!: FormGroup;
  dealForm!: FormGroup;
  settingsForm!: FormGroup;
  
  // Analytics
  analytics: any = {
    revenueData: [],
    topMerchants: [],
    topDeals: [],
    liveViews: 0,
    liveOrders: 0,
    liveRevenue: 0
  };
  
  serverStats = { cpu: 0, memory: 0 };
  
  // Modal
  showUserModal = false;
  showDealModal = false;
  showTicketModal = false;
  editingUser: AdminUser | null = null;
  editingDeal: AdminDeal | null = null;
  editingTicket: SupportTicket | null = null;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private adminService: AdminService,
    private toastService: ToastService,
    private authService: AuthService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadDashboardData();
    this.setupSearchDebounce();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAdminAccess(): void {
    const role = this.authService.getUserRole();
    if (role !== 'ADMIN') {
      this.toastService.error('Access denied. Admin privileges required.');
    }
  }

  private initializeForms(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      status: ['Active', Validators.required]
    });

    this.dealForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });

    this.settingsForm = this.fb.group({
      siteName: ['', Validators.required],
      maxDealsPerPage: ['', [Validators.required, Validators.min(5)]],
      adminEmail: ['', [Validators.required, Validators.email]],
      supportEmail: ['', [Validators.required, Validators.email]]
    });
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadTabData();
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.adminService.getSystemStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load dashboard stats');
          this.isLoading = false;
        }
      });

    this.adminService.getAnalytics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (analytics) => {
          this.analytics = analytics;
        },
        error: () => {
          this.toastService.error('Failed to load analytics');
        }
      });
  }

  private startRealTimeUpdates(): void {
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.activeTab === 'dashboard') {
          this.loadDashboardData();
        } else if (this.activeTab === 'monitoring') {
          this.loadServerStats();
          this.loadApiStatus();
        }
      });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 0;
    this.loadTabData();
  }

  private loadTabData(): void {
    switch (this.activeTab) {
      case 'users':
        this.loadUsers();
        break;
      case 'deals':
        this.loadDeals();
        break;
      case 'orders':
        this.loadOrders();
        break;
      case 'merchants':
        this.loadMerchants();
        break;
      case 'tickets':
        this.loadTickets();
        break;
      case 'logs':
        this.loadAuditLogs();
        break;
      case 'backup':
        this.loadBackups();
        break;
      case 'monitoring':
        this.loadServerStats();
        this.loadApiStatus();
        break;
    }
  }

  // User Management
  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getUsers(this.currentPage, this.pageSize, this.userSearch, this.userRoleFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.users = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load users');
          this.isLoading = false;
        }
      });
  }

  openUserModal(user?: AdminUser): void {
    this.editingUser = user || null;
    if (user) {
      this.userForm.patchValue(user);
    } else {
      this.userForm.reset({ role: 'USER', status: 'Active' });
    }
    this.showUserModal = true;
  }

  saveUser(): void {
    if (!this.userForm.valid) {
      this.toastService.error('Please fill all required fields');
      return;
    }

    const formValue = this.userForm.value;
    if (this.editingUser) {
      this.adminService.updateUser(this.editingUser.id, formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('User updated');
            this.showUserModal = false;
            this.loadUsers();
          },
          error: () => {
            this.toastService.error('Failed to save user');
          }
        });
    } else {
      this.adminService.createDeal(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('User created');
            this.showUserModal = false;
            this.loadUsers();
          },
          error: () => {
            this.toastService.error('Failed to save user');
          }
        });
    }
  }

  deleteUser(id: number): void {
    this.modalService.confirm('Delete User', 'Are you sure you want to delete this user?')
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.adminService.deleteUser(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.toastService.success('User deleted');
                this.loadUsers();
              },
              error: () => {
                this.toastService.error('Failed to delete user');
              }
            });
        }
      });
  }

  toggleUserStatus(user: AdminUser): void {
    this.adminService.toggleUserStatus(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('User status updated');
          this.loadUsers();
        },
        error: () => {
          this.toastService.error('Failed to update user status');
        }
      });
  }

  bulkDeleteUsers(): void {
    if (this.selectedUsers.length === 0) {
      this.toastService.warning('No users selected');
      return;
    }

    this.modalService.confirm('Bulk Delete', `Delete ${this.selectedUsers.length} users?`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.adminService.bulkDeleteUsers(this.selectedUsers)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.toastService.success('Users deleted');
                this.selectedUsers = [];
                this.loadUsers();
              },
              error: () => {
                this.toastService.error('Failed to delete users');
              }
            });
        }
      });
  }

  exportUsers(): void {
    this.adminService.exportUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.adminService.downloadFile(blob, 'users.csv');
          this.toastService.success('Users exported');
        },
        error: () => {
          this.toastService.error('Failed to export users');
        }
      });
  }

  // Deal Management
  loadDeals(): void {
    this.isLoading = true;
    this.adminService.getDeals(this.currentPage, this.pageSize, this.dealSearch, this.dealCategoryFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.deals = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load deals');
          this.isLoading = false;
        }
      });
  }

  openDealModal(deal?: AdminDeal): void {
    this.editingDeal = deal || null;
    if (deal) {
      this.dealForm.patchValue(deal);
    } else {
      this.dealForm.reset();
    }
    this.showDealModal = true;
  }

  saveDeal(): void {
    if (!this.dealForm.valid) {
      this.toastService.error('Please fill all required fields');
      return;
    }

    const formValue = this.dealForm.value;
    if (this.editingDeal) {
      this.adminService.updateDeal(this.editingDeal.id, formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('Deal updated');
            this.showDealModal = false;
            this.loadDeals();
          },
          error: () => {
            this.toastService.error('Failed to save deal');
          }
        });
    } else {
      this.adminService.createDeal(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('Deal created');
            this.showDealModal = false;
            this.loadDeals();
          },
          error: () => {
            this.toastService.error('Failed to save deal');
          }
        });
    }
  }

  deleteDeal(id: number): void {
    this.modalService.confirm('Delete Deal', 'Are you sure you want to delete this deal?')
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.adminService.deleteDeal(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.toastService.success('Deal deleted');
                this.loadDeals();
              },
              error: () => {
                this.toastService.error('Failed to delete deal');
              }
            });
        }
      });
  }

  toggleDealStatus(deal: AdminDeal): void {
    this.adminService.toggleDealStatus(deal.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Deal status updated');
          this.loadDeals();
        },
        error: () => {
          this.toastService.error('Failed to update deal status');
        }
      });
  }

  bulkDeleteDeals(): void {
    if (this.selectedDeals.length === 0) {
      this.toastService.warning('No deals selected');
      return;
    }

    this.modalService.confirm('Bulk Delete', `Delete ${this.selectedDeals.length} deals?`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.adminService.bulkDeleteDeals(this.selectedDeals)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.toastService.success('Deals deleted');
                this.selectedDeals = [];
                this.loadDeals();
              },
              error: () => {
                this.toastService.error('Failed to delete deals');
              }
            });
        }
      });
  }

  exportDeals(): void {
    this.adminService.exportDeals()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.adminService.downloadFile(blob, 'deals.csv');
          this.toastService.success('Deals exported');
        },
        error: () => {
          this.toastService.error('Failed to export deals');
        }
      });
  }

  // Order Management
  loadOrders(): void {
    this.isLoading = true;
    this.adminService.getOrders(this.currentPage, this.pageSize, this.orderSearch, this.orderStatusFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load orders');
          this.isLoading = false;
        }
      });
  }

  updateOrderStatus(order: AdminOrder, newStatus: string): void {
    this.adminService.updateOrderStatus(order.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Order status updated');
          this.loadOrders();
        },
        error: () => {
          this.toastService.error('Failed to update order status');
        }
      });
  }

  processRefund(order: AdminOrder): void {
    const reason = prompt('Enter refund reason:');
    if (reason) {
      const amount = order.finalAmount || order.totalAmount || order.amount || 0;
      this.adminService.processRefund(order.id, amount, reason)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('Refund processed');
            this.loadOrders();
          },
          error: () => {
            this.toastService.error('Failed to process refund');
          }
        });
    }
  }

  exportOrders(): void {
    this.adminService.exportOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.adminService.downloadFile(blob, 'orders.csv');
          this.toastService.success('Orders exported');
        },
        error: () => {
          this.toastService.error('Failed to export orders');
        }
      });
  }

  // Merchant Management
  loadMerchants(): void {
    this.isLoading = true;
    this.adminService.getMerchants(this.currentPage, this.pageSize, this.merchantStatusFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.merchants = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load merchants');
          this.isLoading = false;
        }
      });
  }

  approveMerchant(merchant: AdminMerchant): void {
    this.adminService.approveMerchant(merchant.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Merchant approved');
          this.loadMerchants();
        },
        error: () => {
          this.toastService.error('Failed to approve merchant');
        }
      });
  }

  rejectMerchant(merchant: AdminMerchant): void {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.adminService.rejectMerchant(merchant.id, reason)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('Merchant rejected');
            this.loadMerchants();
          },
          error: () => {
            this.toastService.error('Failed to reject merchant');
          }
        });
    }
  }

  // Support Tickets
  loadTickets(): void {
    this.isLoading = true;
    this.adminService.getTickets(this.currentPage, this.pageSize, this.ticketPriorityFilter, this.ticketStatusFilter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.tickets = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load tickets');
          this.isLoading = false;
        }
      });
  }

  openTicketModal(ticket: SupportTicket): void {
    this.editingTicket = ticket;
    this.showTicketModal = true;
  }

  replyToTicket(ticket: SupportTicket): void {
    const reply = prompt('Enter your reply:');
    if (reply) {
      this.adminService.replyToTicket(ticket.id, reply)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toastService.success('Reply sent');
            this.loadTickets();
          },
          error: () => {
            this.toastService.error('Failed to send reply');
          }
        });
    }
  }

  resolveTicket(ticket: SupportTicket): void {
    this.adminService.resolveTicket(ticket.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Ticket resolved');
          this.loadTickets();
        },
        error: () => {
          this.toastService.error('Failed to resolve ticket');
        }
      });
  }

  // Audit Logs
  loadAuditLogs(): void {
    this.isLoading = true;
    this.adminService.getAuditLogs(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.auditLogs = response.content || [];
          this.totalElements = response.totalElements || 0;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load audit logs');
          this.isLoading = false;
        }
      });
  }

  // Backup & Restore
  loadBackups(): void {
    this.isLoading = true;
    this.adminService.getBackups()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (backups) => {
          this.backups = backups;
          this.isLoading = false;
        },
        error: () => {
          this.toastService.error('Failed to load backups');
          this.isLoading = false;
        }
      });
  }

  createBackup(): void {
    this.adminService.createBackup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Backup created');
          this.loadBackups();
        },
        error: () => {
          this.toastService.error('Failed to create backup');
        }
      });
  }

  restoreBackup(backup: Backup): void {
    this.modalService.confirm('Restore Backup', 'This will restore the database. Continue?')
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.adminService.restoreBackup(backup.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.toastService.success('Backup restored');
              },
              error: () => {
                this.toastService.error('Failed to restore backup');
              }
            });
        }
      });
  }

  deleteBackup(backup: Backup): void {
    this.adminService.deleteBackup(backup.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success('Backup deleted');
          this.loadBackups();
        },
        error: () => {
          this.toastService.error('Failed to delete backup');
        }
      });
  }

  // System Monitoring
  loadServerStats(): void {
    this.adminService.getServerStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.serverStats = stats;
        },
        error: () => {
          this.toastService.error('Failed to load server stats');
        }
      });
  }

  loadApiStatus(): void {
    this.adminService.getApiStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          this.apiStatus = status;
        },
        error: () => {
          this.toastService.error('Failed to load API status');
        }
      });
  }

  // Pagination
  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.totalElements) {
      this.currentPage++;
      this.loadTabData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTabData();
    }
  }

  // Search
  onUserSearch(value: string): void {
    this.userSearch = value;
    this.searchSubject.next(value);
  }

  onDealSearch(value: string): void {
    this.dealSearch = value;
    this.searchSubject.next(value);
  }

  onOrderSearch(value: string): void {
    this.orderSearch = value;
    this.searchSubject.next(value);
  }

  // Filters
  clearUserFilters(): void {
    this.userSearch = '';
    this.userRoleFilter = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  clearDealFilters(): void {
    this.dealSearch = '';
    this.dealCategoryFilter = '';
    this.currentPage = 0;
    this.loadDeals();
  }

  clearOrderFilters(): void {
    this.orderSearch = '';
    this.orderStatusFilter = '';
    this.currentPage = 0;
    this.loadOrders();
  }

  // Selection
  toggleAllUsers(event: any): void {
    if (event.target.checked) {
      this.selectedUsers = this.users.map(u => u.id);
    } else {
      this.selectedUsers = [];
    }
  }

  toggleAllDeals(event: any): void {
    if (event.target.checked) {
      this.selectedDeals = this.deals.map(d => d.id);
    } else {
      this.selectedDeals = [];
    }
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  toggleDealSelection(dealId: number): void {
    const index = this.selectedDeals.indexOf(dealId);
    if (index > -1) {
      this.selectedDeals.splice(index, 1);
    } else {
      this.selectedDeals.push(dealId);
    }
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }

  isDealSelected(dealId: number): boolean {
    return this.selectedDeals.includes(dealId);
  }
}
