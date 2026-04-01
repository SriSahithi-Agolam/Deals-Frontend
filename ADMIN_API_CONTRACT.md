# Admin Dashboard - Backend API Contract

## Base URL
```
http://localhost:8080/api/admin
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "status": "error",
  "error": "ERROR_CODE",
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "content": [ /* array of items */ ],
  "totalElements": 100,
  "totalPages": 10,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

## User Management Endpoints

### GET /users
List all users with pagination and filters.

**Query Parameters:**
- `page` (int, default: 0) - Page number
- `size` (int, default: 10) - Items per page
- `search` (string, optional) - Search by name or email
- `role` (string, optional) - Filter by role (USER, ADMIN, MERCHANT)

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "Active",
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T14:22:00Z"
    }
  ],
  "totalElements": 156,
  "totalPages": 16,
  "currentPage": 0,
  "pageSize": 10
}
```

### POST /users
Create a new user.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "USER",
  "status": "Active",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "id": 157,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "USER",
  "status": "Active",
  "createdAt": "2024-01-21T10:00:00Z"
}
```

### PUT /users/{id}
Update user details.

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "role": "ADMIN",
  "status": "Active"
}
```

**Response:**
```json
{
  "id": 157,
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "role": "ADMIN",
  "status": "Active",
  "updatedAt": "2024-01-21T11:00:00Z"
}
```

### DELETE /users/{id}
Delete a user.

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### POST /users/bulk-delete
Delete multiple users.

**Request Body:**
```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response:**
```json
{
  "message": "5 users deleted successfully",
  "deletedCount": 5
}
```

### PATCH /users/{id}/toggle-status
Toggle user active/inactive status.

**Response:**
```json
{
  "id": 1,
  "status": "Inactive",
  "message": "User status updated"
}
```

### POST /users/{id}/reset-password
Reset user password.

**Request Body:**
```json
{
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

## Deal Management Endpoints

### GET /deals
List all deals with pagination and filters.

**Query Parameters:**
- `page` (int, default: 0)
- `size` (int, default: 10)
- `search` (string, optional) - Search by title
- `category` (string, optional) - Filter by category

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Electronics Sale",
      "discount": 50,
      "price": 15000,
      "category": "Electronics",
      "status": "Active",
      "merchantId": 5,
      "expiryDate": "2024-02-15T23:59:59Z",
      "views": 2450,
      "conversions": 67,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalElements": 89,
  "totalPages": 9,
  "currentPage": 0,
  "pageSize": 10
}
```

### POST /deals
Create a new deal.

**Request Body:**
```json
{
  "title": "New Deal",
  "discount": 30,
  "price": 5000,
  "category": "Fashion",
  "merchantId": 5,
  "expiryDate": "2024-02-28T23:59:59Z",
  "description": "Amazing fashion deal"
}
```

**Response:**
```json
{
  "id": 90,
  "title": "New Deal",
  "discount": 30,
  "price": 5000,
  "category": "Fashion",
  "status": "Active",
  "merchantId": 5,
  "expiryDate": "2024-02-28T23:59:59Z",
  "createdAt": "2024-01-21T10:00:00Z"
}
```

### PUT /deals/{id}
Update deal details.

**Request Body:**
```json
{
  "title": "Updated Deal",
  "discount": 35,
  "price": 4500,
  "category": "Fashion",
  "expiryDate": "2024-03-01T23:59:59Z"
}
```

**Response:**
```json
{
  "id": 90,
  "title": "Updated Deal",
  "discount": 35,
  "price": 4500,
  "category": "Fashion",
  "status": "Active",
  "updatedAt": "2024-01-21T11:00:00Z"
}
```

### DELETE /deals/{id}
Delete a deal.

**Response:**
```json
{
  "message": "Deal deleted successfully"
}
```

### POST /deals/bulk-delete
Delete multiple deals.

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "message": "3 deals deleted successfully",
  "deletedCount": 3
}
```

### PATCH /deals/{id}/toggle-status
Toggle deal active/inactive status.

**Response:**
```json
{
  "id": 1,
  "status": "Inactive",
  "message": "Deal status updated"
}
```

## Order Management Endpoints

### GET /orders
List all orders with pagination and filters.

**Query Parameters:**
- `page` (int, default: 0)
- `size` (int, default: 10)
- `search` (string, optional) - Search by order ID or customer name
- `status` (string, optional) - Filter by status

**Response:**
```json
{
  "content": [
    {
      "id": 12345,
      "customerName": "John Doe",
      "customerId": 1,
      "amount": 2499,
      "status": "Processing",
      "date": "2024-01-20T14:22:00Z",
      "items": 3,
      "paymentMethod": "Credit Card"
    }
  ],
  "totalElements": 500,
  "totalPages": 50,
  "currentPage": 0,
  "pageSize": 10
}
```

### GET /orders/{id}
Get order details.

**Response:**
```json
{
  "id": 12345,
  "customerName": "John Doe",
  "customerId": 1,
  "amount": 2499,
  "status": "Processing",
  "date": "2024-01-20T14:22:00Z",
  "items": [
    {
      "dealId": 1,
      "title": "Electronics Sale",
      "quantity": 1,
      "price": 2499
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "paymentMethod": "Credit Card"
}
```

### PATCH /orders/{id}/status
Update order status.

**Request Body:**
```json
{
  "status": "Shipped",
  "trackingNumber": "TRACK123456"
}
```

**Response:**
```json
{
  "id": 12345,
  "status": "Shipped",
  "trackingNumber": "TRACK123456",
  "updatedAt": "2024-01-21T10:00:00Z"
}
```

### POST /orders/{id}/refund
Process refund for an order.

**Request Body:**
```json
{
  "amount": 2499,
  "reason": "Customer requested refund",
  "refundMethod": "Original Payment Method"
}
```

**Response:**
```json
{
  "id": 12345,
  "refundId": "REF123456",
  "amount": 2499,
  "status": "Refunded",
  "processedAt": "2024-01-21T10:00:00Z"
}
```

## Merchant Management Endpoints

### GET /merchants
List all merchants with pagination and filters.

**Query Parameters:**
- `page` (int, default: 0)
- `size` (int, default: 10)
- `status` (string, optional) - Filter by status (Pending, Approved, Rejected)

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "businessName": "TechStore Pro",
      "ownerName": "Mike Johnson",
      "email": "mike@techstore.com",
      "phone": "+1234567890",
      "category": "Electronics",
      "status": "Pending",
      "appliedDate": "2024-01-15T10:30:00Z",
      "revenue": 85000
    }
  ],
  "totalElements": 23,
  "totalPages": 3,
  "currentPage": 0,
  "pageSize": 10
}
```

### PATCH /merchants/{id}/approve
Approve a merchant.

**Response:**
```json
{
  "id": 1,
  "status": "Approved",
  "approvedAt": "2024-01-21T10:00:00Z",
  "message": "Merchant approved successfully"
}
```

### PATCH /merchants/{id}/reject
Reject a merchant.

**Request Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

**Response:**
```json
{
  "id": 1,
  "status": "Rejected",
  "rejectionReason": "Incomplete documentation",
  "rejectedAt": "2024-01-21T10:00:00Z"
}
```

### PATCH /merchants/{id}/commission
Update merchant commission.

**Request Body:**
```json
{
  "commission": 15
}
```

**Response:**
```json
{
  "id": 1,
  "commission": 15,
  "updatedAt": "2024-01-21T10:00:00Z"
}
```

## Support Tickets Endpoints

### GET /tickets
List all support tickets with pagination and filters.

**Query Parameters:**
- `page` (int, default: 0)
- `size` (int, default: 10)
- `priority` (string, optional) - Filter by priority (HIGH, MEDIUM, LOW)
- `status` (string, optional) - Filter by status (Open, In Progress, Resolved)

**Response:**
```json
{
  "content": [
    {
      "id": 1001,
      "customerName": "John Doe",
      "email": "john@example.com",
      "subject": "Order not delivered",
      "message": "My order #12345 was supposed to be delivered yesterday...",
      "priority": "HIGH",
      "status": "Open",
      "createdDate": "2024-01-20T14:22:00Z"
    }
  ],
  "totalElements": 45,
  "totalPages": 5,
  "currentPage": 0,
  "pageSize": 10
}
```

### GET /tickets/{id}
Get ticket details.

**Response:**
```json
{
  "id": 1001,
  "customerName": "John Doe",
  "email": "john@example.com",
  "subject": "Order not delivered",
  "message": "My order #12345 was supposed to be delivered yesterday...",
  "priority": "HIGH",
  "status": "Open",
  "createdDate": "2024-01-20T14:22:00Z",
  "responses": [
    {
      "responder": "Admin",
      "message": "We are investigating this issue...",
      "respondedAt": "2024-01-20T15:00:00Z"
    }
  ]
}
```

### POST /tickets/{id}/reply
Reply to a support ticket.

**Request Body:**
```json
{
  "reply": "We have located your package and it will be delivered today."
}
```

**Response:**
```json
{
  "id": 1001,
  "message": "Reply sent successfully",
  "respondedAt": "2024-01-21T10:00:00Z"
}
```

### PATCH /tickets/{id}/resolve
Mark ticket as resolved.

**Response:**
```json
{
  "id": 1001,
  "status": "Resolved",
  "resolvedAt": "2024-01-21T10:00:00Z"
}
```

## Audit Logs Endpoints

### GET /audit-logs
List all audit logs with pagination and filters.

**Query Parameters:**
- `page` (int, default: 0)
- `size` (int, default: 10)
- `user` (string, optional) - Filter by user
- `action` (string, optional) - Filter by action

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "timestamp": "2024-01-21T10:00:00Z",
      "user": "admin@example.com",
      "action": "deleted user",
      "details": "User ID: 123 (john@example.com)",
      "type": "DELETE",
      "ipAddress": "192.168.1.1"
    }
  ],
  "totalElements": 1000,
  "totalPages": 100,
  "currentPage": 0,
  "pageSize": 10
}
```

### POST /audit-logs
Create audit log entry (internal use).

**Request Body:**
```json
{
  "action": "updated deal",
  "details": "Deal: Electronics Sale - Changed discount to 50%",
  "type": "UPDATE"
}
```

**Response:**
```json
{
  "id": 1001,
  "timestamp": "2024-01-21T10:00:00Z",
  "message": "Audit log created"
}
```

## Backup Endpoints

### GET /backups
List all backups.

**Response:**
```json
[
  {
    "id": 1,
    "name": "backup_2024_01_21.sql",
    "date": "2024-01-21T10:00:00Z",
    "size": "125.5 MB"
  },
  {
    "id": 2,
    "name": "backup_2024_01_20.sql",
    "date": "2024-01-20T10:00:00Z",
    "size": "124.2 MB"
  }
]
```

### POST /backups
Create a new backup.

**Response:**
```json
{
  "id": 3,
  "name": "backup_2024_01_21_11_00.sql",
  "date": "2024-01-21T11:00:00Z",
  "size": "126.1 MB",
  "message": "Backup created successfully"
}
```

### POST /backups/{id}/restore
Restore from backup.

**Response:**
```json
{
  "message": "Backup restored successfully",
  "restoredAt": "2024-01-21T11:30:00Z"
}
```

### DELETE /backups/{id}
Delete a backup.

**Response:**
```json
{
  "message": "Backup deleted successfully"
}
```

## Analytics Endpoints

### GET /analytics
Get analytics data.

**Response:**
```json
{
  "revenueData": [
    { "label": "Mon", "percentage": 60 },
    { "label": "Tue", "percentage": 88 },
    { "label": "Wed", "percentage": 72 },
    { "label": "Thu", "percentage": 100 },
    { "label": "Fri", "percentage": 80 }
  ],
  "topMerchants": [
    { "name": "TechStore", "revenue": 85000 },
    { "name": "StyleHub", "revenue": 72000 },
    { "name": "FoodMart", "revenue": 58000 }
  ],
  "topDeals": [
    {
      "title": "Electronics Flash Sale",
      "views": 2450,
      "conversions": 67,
      "conversionRate": 13.8
    }
  ],
  "liveViews": 234,
  "liveOrders": 18,
  "liveRevenue": 12450
}
```

## System Endpoints

### GET /stats
Get system statistics.

**Response:**
```json
{
  "totalUsers": 156,
  "newUsersToday": 12,
  "totalMerchants": 23,
  "activeMerchants": 18,
  "activeDeals": 89,
  "expiringSoon": 5,
  "totalRevenue": 125000,
  "todayRevenue": 8500
}
```

### GET /system/api-status
Get API status.

**Response:**
```json
[
  { "name": "Auth Service", "status": "ONLINE", "responseTime": 120 },
  { "name": "Deal Service", "status": "ONLINE", "responseTime": 95 },
  { "name": "Order Service", "status": "ONLINE", "responseTime": 110 },
  { "name": "Payment Gateway", "status": "OFFLINE", "responseTime": 0 }
]
```

### GET /system/stats
Get server statistics.

**Response:**
```json
{
  "cpu": 45,
  "memory": 62,
  "disk": 78,
  "uptime": 86400
}
```

## Settings Endpoints

### GET /settings
Get system settings.

**Response:**
```json
{
  "siteName": "Deals & Coupons Finder",
  "maxDealsPerPage": 20,
  "adminEmail": "admin@dealsapp.com",
  "supportEmail": "support@dealsapp.com",
  "maintenanceMode": false
}
```

### PUT /settings
Update system settings.

**Request Body:**
```json
{
  "siteName": "Deals & Coupons Finder",
  "maxDealsPerPage": 25,
  "adminEmail": "admin@dealsapp.com",
  "supportEmail": "support@dealsapp.com"
}
```

**Response:**
```json
{
  "message": "Settings updated successfully",
  "updatedAt": "2024-01-21T10:00:00Z"
}
```

## Export Endpoints

### GET /export/users
Export users to CSV.

**Response:** CSV file download

### GET /export/deals
Export deals to CSV.

**Response:** CSV file download

### GET /export/orders
Export orders to CSV.

**Response:** CSV file download

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 204 | No Content | Request successful, no content |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation error |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Rate Limiting

- **Limit**: 1000 requests per hour per IP
- **Headers**: 
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 999`
  - `X-RateLimit-Reset: 1234567890`

## Pagination

All list endpoints support pagination with:
- `page` - 0-indexed page number
- `size` - Items per page (max 100)
- `sort` - Sort field and direction (e.g., `sort=createdAt,desc`)

## Filtering

Filters are passed as query parameters:
- `search` - Text search
- `status` - Status filter
- `role` - Role filter
- `category` - Category filter
- `priority` - Priority filter
- `startDate` - Date range start
- `endDate` - Date range end

## Implementation Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All monetary values are in the smallest currency unit (e.g., cents)
3. All IDs are positive integers
4. Passwords should be hashed using bcrypt
5. Implement rate limiting to prevent abuse
6. Use HTTPS in production
7. Implement CORS properly
8. Add request/response logging
9. Implement caching where appropriate
10. Use database transactions for multi-step operations
