# 🚀 Order Management System - Fullstack Senior

**Professional fullstack solution for order management with JWT authentication, clean architecture, and enterprise security**

## 📋 Overview

Modern fullstack application providing complete order management capabilities:

- ✅ Secure user registration and authentication with JWT Bearer tokens
- ✅ Complete order CRUD operations (Create, Read, Update, Delete)
- ✅ Order items management within each order
- ✅ Order status management (Pending → Delivered)
- ✅ Role-based access control (Admin, User)
- ✅ Clean architecture with separation of concerns
- ✅ Resilience patterns and automatic retry mechanisms
- ✅ Robust validation and structured logging
- ✅ Professional UI with React + TypeScript
- ✅ Responsive design and modern styling

---

## 🏗️ Technology Stack

### Backend
- **Framework:** ASP.NET Core 8.0
- **ORM:** Entity Framework Core 8.0
- **Database:** SQL Server Express (localhost\SQLEXPRESS)
- **Authentication:** JWT Bearer Tokens (60-minute expiration)
- **Validation:** FluentValidation
- **Mapping:** AutoMapper
- **Logging:** Serilog
- **Architecture:** Clean Architecture with SOLID principles
- **API Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** React 18+
- **Language:** TypeScript 5+
- **Bundler:** Vite 5.4+
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Styling:** CSS3 with modern components
- **Testing:** Vitest + React Testing Library

### Database
- **Server:** SQL Server Express (localhost\SQLEXPRESS)
- **Database Name:** OrderManagementDB
- **Tables:** Users, Orders, OrderItems
- **Automatic:** Migrations applied on first run

---

## ⚡ Quick Start (5 minutes)

### Prerequisites
- .NET 8.0 SDK installed
- Node.js 18+ and npm installed
- SQL Server Express installed locally
- Git installed

### 🚀 Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the application
dotnet run --project OrderManagementAPI.Api

# ✅ Backend running on: http://localhost:5000
# 📚 Swagger UI: http://localhost:5000/swagger
```

### 🚀 Frontend Setup

```powershell
# Navigate to frontend folder (in a new terminal)
cd frontend

# Install npm packages
npm install

# Start development server
npm run dev

# ✅ Frontend running on: http://localhost:3000
```

### 🔐 Default Admin Credentials

```
Username: admin
Password: Admin@123
Role:     Administrator
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "username": "john.doe",
    "email": "john@example.com",
    "role": "User"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john.doe",
  "password": "SecurePass123!"
}

Response: Same as register
```

### Order Management Endpoints

#### Get User's Orders
```http
GET /api/orders
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numeroPedido": "PED001",
      "cliente": "John Doe",
      "fecha": "2026-02-23",
      "total": 150.50,
      "estado": "Pending",
      "description": "Order description",
      "items": [...]
    }
  ]
}
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroPedido": "PED001",
  "description": "Order description",
  "items": [
    {
      "productName": "Product 1",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ]
}

Response: Created order with ID
```

#### Update Order
```http
PUT /api/orders/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "numeroPedido": "PED001",
  "estado": "Delivered",
  "description": "Updated description",
  "items": [...]
}
```

#### Delete Order
```http
DELETE /api/orders/{id}
Authorization: Bearer {token}
```

---

## 🗂️ Project Structure

```
OrderManagement/
├── backend/
│   ├── OrderManagementAPI.Api/
│   │   ├── Controllers/          # API endpoints
│   │   ├── Middleware/           # Custom middleware
│   │   ├── Authorization/        # Auth attributes
│   │   ├── Extensions/           # Dependency injection
│   │   └── Program.cs            # Application setup
│   ├── OrderManagementAPI.Application/
│   │   ├── Services/             # Business logic
│   │   ├── DTOs/                 # Data transfer objects
│   │   ├── Validators/           # Validation rules
│   │   └── Interfaces/           # Service contracts
│   ├── OrderManagementAPI.Domain/
│   │   ├── Entities/             # Domain models
│   │   └── Interfaces/           # Repository contracts
│   ├── OrderManagementAPI.Infrastructure/
│   │   ├── Data/                 # Database context
│   │   ├── Services/             # Infrastructure services
│   │   ├── Security/             # Password hashing
│   │   └── Migrations/           # Database migrations
│   └── OrderManagementAPI.Tests/
│       ├── Services/             # Service tests
│       └── Security/             # Security tests
│
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── contexts/             # React contexts
│   │   ├── types/                # TypeScript types
│   │   ├── styles/               # CSS files
│   │   └── App.tsx               # Main app component
│   ├── public/                   # Static assets
│   ├── index.html                # HTML entry point
│   └── vite.config.ts            # Vite configuration
│
└── README.md                      # This file
```

---

## 🔑 Key Features

### Authentication & Authorization
- JWT Bearer token-based authentication
- Automatic token expiration (60 minutes)
- Secure password hashing with bcrypt
- Role-based access control

### Order Management
- Create, read, update, and delete orders
- Track order status (Pending, Delivered)
- Manage order items with pricing
- Order number generation
- User-specific order isolation

### Data Validation
- FluentValidation rules on backend
- Real-time validation on frontend
- Comprehensive error messages
- Request/response validation

### Error Handling
- Global exception middleware
- Structured error responses
- Detailed logging with Serilog
- User-friendly error messages

### Security
- CORS configuration for localhost:3000
- HTTPS ready (development: HTTP)
- SQL injection prevention (parameterized queries)
- XSS protection (content sanitization)
- CSRF token support ready

---

## 📝 Testing

### Backend Tests
```powershell
cd backend

# Run all tests
dotnet test

# Run with coverage
dotnet test /p:CollectCoverageFlag=true
```

### Frontend Tests
```powershell
cd frontend

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 🚀 Deployment

### Backend Deployment
1. Publish the application: `dotnet publish -c Release`
2. Configure SQL Server on target environment
3. Update connection string in `appsettings.json`
4. Set environment variables for JWT secret
5. Deploy to IIS, Azure App Service, or docker container

### Frontend Deployment
1. Build the application: `npm run build`
2. Upload `dist` folder to static hosting (Netlify, Vercel, GitHub Pages)
3. Or serve with any HTTP server configured for SPA routing

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'User',
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

### Orders Table
```sql
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY,
    NumeroPedido NVARCHAR(50) NOT NULL,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Fecha DATETIME DEFAULT GETDATE(),
    Total DECIMAL(10, 2) NOT NULL,
    Estado NVARCHAR(50) DEFAULT 'Pending',
    Description NVARCHAR(MAX)
);
```

### OrderItems Table
```sql
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY,
    OrderId INT FOREIGN KEY REFERENCES Orders(Id),
    ProductName NVARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    TotalPrice DECIMAL(10, 2) NOT NULL
);
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Port 5000 already in use
```powershell
# Kill process on port 5000
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 5000).OwningProcess} | Stop-Process
```

**Problem:** Database connection failed
```powershell
# Verify SQL Server is running
sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION"
```

**Problem:** JWT token invalid
- Ensure token is fresh (not expired)
- Check Authorization header format: `Bearer {token}`
- Verify JWT secret is configured correctly

### Frontend Issues

**Problem:** Cannot connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in Program.cs
- Ensure API_BASE_URL is correct in .env

**Problem:** Vite build errors
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules
npm install
npm run dev
```

---

## 📞 Support & Contact

For issues, questions, or contributions:
1. Check existing documentation in `/backend/README.md` and `/frontend/README.md`
2. Review error messages and logs
3. Check database migrations status
4. Verify environment configuration

---

## 📄 License

This project is provided as-is for educational and professional purposes.

---

## ✨ Features Highlights

- 🔐 **Enterprise Security:** JWT + Role-based access control
- 📊 **Clean Architecture:** Domain-driven design principles
- 🧪 **Comprehensive Testing:** Unit and integration tests
- 📚 **Well Documented:** Extensive inline comments and README files
- 🎨 **Modern UI:** Responsive design with professional styling
- ⚡ **Performance:** Optimized queries and efficient state management
- 🔄 **Resiliance:** Retry mechanisms and error handling
- 📱 **Responsive:** Works on desktop, tablet, and mobile devices

---

**Last Updated:** February 23, 2026

