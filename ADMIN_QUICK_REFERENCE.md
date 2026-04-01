# Admin Dashboard - Quick Reference Guide

## File Structure
```
src/app/
├── components/
│   └── admin/
│       ├── admin.component.ts       (Main component logic)
│       ├── admin.component.html     (Template)
│       └── admin.component.css      (Styles)
├── services/
│   ├── admin.service.ts             (Backend API integration)
│   ├── modal.service.ts             (Modal management)
│   ├── auth.service.ts              (Authentication)
│   └── toast.service.ts             (Notifications)
└── models/
    └── (Add admin models here)
```

## Component Structure

### Tabs Available
1. **dashboard** - Overview with stats and analytics
2. **users** - User management
3. **deals** - Deal management
4. **orders** - Order management
5. **merchants** - Merchant approval
6. **tickets** - Support tickets
7. **logs** - Audit logs
8. **backup** - Backup & restore
9. **monitoring** - System monitoring

### Key Properties
```typescript
activeTab: string                    // Current active tab
isLoading: boolean                   // Loading state
currentPage: number                  // Current page (0-indexed)
pageSize: number                     // Items per page
totalElements: number                // Total items count

// Data arrays
users: AdminUser[]
deals: AdminDeal[]
orders: AdminOrder[]
merchants: AdminMerchant[]
tickets: SupportTicket[]
auditLogs: AuditLog[]
backups: Backup[]
apiStatus: ApiStatus[]

// Filter properties
userSearch: string
userRoleFilter: string
dealSearch: string
dealCategoryFilter: string
// ... more filters

// Selection
selectedUsers: number[]
selectedDeals: number[]

// Forms
userForm: FormGroup
dealForm: FormGroup
settingsForm: FormGroup

// Modals
showUserModal: boolean
showDealModal: boolean
showTicketModal: boolean
```

## Common Methods

### Loading Data
```typescript
loadUsers()              // Load users with filters
loadDeals()              // Load deals with filters
loadOrders()             // Load orders with filters
loadMerchants()          // Load merchants
loadTickets()            // Load support tickets
loadAuditLogs()          // Load audit logs
loadBackups()            // Load backups
loadServerStats()        // Load server stats
loadApiStatus()          // Load API status
```

### CRUD Operations
```typescript
// Users
openUserModal(user?)     // Open user form modal
saveUser()               // Save user (create/update)
deleteUser(id)           // Delete single user
bulkDeleteUsers()        // Delete multiple users
toggleUserStatus(user)   // Toggle user active/inactive

// Deals
openDealModal(deal?)     // Open deal form modal
saveDeal()               // Save deal (create/update)
deleteDeal(id)           // Delete single deal
bulkDeleteDeals()        // Delete multiple deals
toggleDealStatus(deal)   // Toggle deal active/inactive

// Orders
updateOrderStatus(order, status)  // Update order status
processRefund(order)              // Process refund

// Merchants
approveMerchant(merchant)         // Approve merchant
rejectMerchant(merchant)          // Reject merchant

// Tickets
openTicketModal(ticket)           // Open ticket details
replyToTicket(ticket)             // Reply to ticket
resolveTicket(ticket)             // Mark ticket resolved
```

### Pagination
```typescript
nextPage()               // Go to next page
previousPage()           // Go to previous page
```

### Search & Filter
```typescript
onUserSearch(value)      // Search users (debounced)
onDealSearch(value)      // Search deals (debounced)
onOrderSearch(value)     // Search orders (debounced)
clearUserFilters()       // Clear all user filters
clearDealFilters()       // Clear all deal filters
clearOrderFilters()      // Clear all order filters
```

### Selection
```typescript
toggleAllUsers(event)    // Select/deselect all users
toggleAllDeals(event)    // Select/deselect all deals
toggleUserSelection(id)  // Toggle single user selection
toggleDealSelection(id)  // Toggle single deal selection
isUserSelected(id)       // Check if user is selected
isDealSelected(id)       // Check if deal is selected
```

### Export
```typescript
exportUsers()            // Export users to CSV
exportDeals()            // Export deals to CSV
exportOrders()           // Export orders to CSV
```

### Backup
```typescript
createBackup()           // Create new backup
restoreBackup(backup)    // Restore from backup
deleteBackup(backup)     // Delete backup
```

## Service Methods

### AdminService

#### User Management
```typescript
getUsers(page, size, search?, role?)
getUserById(id)
updateUser(id, user)
deleteUser(id)
bulkDeleteUsers(ids)
toggleUserStatus(id)
resetUserPassword(id, newPassword)
```

#### Deal Management
```typescript
getDeals(page, size, search?, category?)
createDeal(deal)
updateDeal(id, deal)
deleteDeal(id)
bulkDeleteDeals(ids)
toggleDealStatus(id)
```

#### Order Management
```typescript
getOrders(page, size, search?, status?)
getOrderDetails(id)
updateOrderStatus(id, status)
processRefund(id, amount, reason)
```

#### Merchant Management
```typescript
getMerchants(page, size, status?)
approveMerchant(id)
rejectMerchant(id, reason)
updateMerchantCommission(id, commission)
```

#### Support Tickets
```typescript
getTickets(page, size, priority?, status?)
getTicketDetails(id)
replyToTicket(id, reply)
resolveTicket(id)
```

#### Analytics & Monitoring
```typescript
getAnalytics()
getSystemStats()
getAuditLogs(page, size, user?, action?)
getBackups()
createBackup()
restoreBackup(id)
deleteBackup(id)
getApiStatus()
getServerStats()
```

#### Settings & Export
```typescript
getSettings()
updateSettings(settings)
exportUsers()
exportDeals()
exportOrders()
downloadFile(blob, filename)
```

## Form Validation

### User Form
```typescript
userForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  role: ['USER', Validators.required],
  status: ['Active', Validators.required]
});
```

### Deal Form
```typescript
dealForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(3)]],
  discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
  price: ['', [Validators.required, Validators.min(0)]],
  category: ['', Validators.required],
  expiryDate: ['', Validators.required]
});
```

## CSS Classes

### Layout
- `.admin-dashboard` - Main container
- `.admin-header` - Header section
- `.tab-content` - Tab content area
- `.stats-grid` - Statistics grid
- `.actions-grid` - Quick actions grid

### Tables & Lists
- `.table-container` - Table wrapper
- `.deals-grid` - Deal cards grid
- `.orders-list` - Orders list
- `.merchants-list` - Merchants list
- `.tickets-list` - Tickets list

### Forms & Modals
- `.modal-overlay` - Modal background
- `.modal-content` - Modal container
- `.modal-form` - Form inside modal
- `.form-group` - Form field group
- `.form-input` - Input field

### Buttons
- `.btn-sm` - Small button
- `.btn-cancel` - Cancel button
- `.btn-submit` - Submit button
- `.approve-btn` - Approve button
- `.reject-btn` - Reject button
- `.resolve-btn` - Resolve button
- `.reply-btn` - Reply button

### Status Badges
- `.status-badge.active` - Active status
- `.status-badge.inactive` - Inactive status
- `.status-badge.pending` - Pending status
- `.status-badge.approved` - Approved status
- `.status-badge.rejected` - Rejected status

## Adding New Features

### Add New Tab
1. Add tab name to `activeTab` switch in `loadTabData()`
2. Create load method (e.g., `loadNewTab()`)
3. Add tab content in HTML
4. Add CSS styles

### Add New Filter
1. Add filter property to component
2. Add filter input in HTML
3. Update load method to include filter
4. Add clear filter method

### Add New Modal
1. Add modal properties (`showNewModal`, `editingItem`)
2. Create open method (`openNewModal()`)
3. Create save method (`saveNew()`)
4. Add modal HTML
5. Add modal CSS

### Add New Service Method
1. Add method to `AdminService`
2. Add API endpoint call
3. Add error handling
4. Add audit logging if needed
5. Use in component

## Best Practices

### Error Handling
```typescript
this.adminService.getUsers()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (data) => { /* handle success */ },
    error: () => { this.toastService.error('Error message'); }
  });
```

### Memory Management
```typescript
private destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Debounced Search
```typescript
private searchSubject = new Subject<string>();

this.searchSubject.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  takeUntil(this.destroy$)
).subscribe(() => {
  this.loadTabData();
});
```

### Form Validation
```typescript
if (!this.userForm.valid) {
  this.toastService.error('Please fill all required fields');
  return;
}
```

## Debugging Tips

1. **Check Console** - Look for API errors
2. **Network Tab** - Verify API calls
3. **Component State** - Use Angular DevTools
4. **Form State** - Log form.value and form.valid
5. **Service Calls** - Add console.log in service methods

## Performance Optimization

1. **Pagination** - Limits data loaded
2. **Debounced Search** - Reduces API calls
3. **OnDestroy** - Prevents memory leaks
4. **ChangeDetectionStrategy** - Can be added
5. **Virtual Scrolling** - For large lists (future)

## Security Considerations

1. **Role Check** - Admin role verification
2. **Audit Logging** - All actions logged
3. **Input Validation** - Form validation
4. **CSRF Protection** - Backend responsibility
5. **XSS Prevention** - Angular sanitization

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Data not loading | Check API endpoint, verify token |
| Form not submitting | Check form validation, console errors |
| Modal not appearing | Check z-index, verify modal-overlay in DOM |
| Search not working | Check debounce timing, verify API |
| Pagination not working | Check totalElements calculation |
| Export not working | Check blob handling, verify backend |

## Resources

- [Angular Documentation](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Forms](https://angular.io/guide/forms)
- [HTTP Client](https://angular.io/guide/http)
