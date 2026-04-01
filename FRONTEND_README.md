# Deals & Coupons Finder - Angular Frontend

Angular frontend for the Deals & Coupons Finder microservices backend.

## Features

- **Authentication**: Login/Register with JWT token
- **Deals**: Browse and search deals by category/merchant
- **Merchants**: View all merchants
- **Orders**: Create and track orders
- **Cashback**: View cashback balance

## Backend Services

The frontend connects to these backend services:
- Auth Service: `http://localhost:8080/api/auth`
- Deal Service: `http://localhost:8080/api/deals`
- Merchant Service: `http://localhost:8080/api/merchants`
- Order Service: `http://localhost:8080/api/orders`
- Cashback Service: `http://localhost:8080/api/cashback`

## Project Structure

```
src/app/
├── components/
│   ├── login/
│   ├── register/
│   ├── deals/
│   ├── merchants/
│   └── orders/
├── models/
│   ├── auth.model.ts
│   ├── deal.model.ts
│   ├── merchant.model.ts
│   ├── order.model.ts
│   └── user.model.ts
├── services/
│   ├── auth.service.ts
│   ├── deal.service.ts
│   ├── merchant.service.ts
│   ├── order.service.ts
│   └── cashback.service.ts
└── interceptors/
    └── auth.interceptor.ts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Navigate to `http://localhost:4200/`

## API Gateway Configuration

Make sure your API Gateway is running on port 8080 and routing requests to the appropriate microservices.

## Notes

- JWT tokens are stored in localStorage
- Auth interceptor automatically adds Bearer token to requests
- All API calls go through the API Gateway at `http://localhost:8080`
