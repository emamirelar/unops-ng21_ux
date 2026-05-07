# UNOPS Partnership and Opportunities (PAO) System

[![.NET](https://img.shields.io/badge/.NET-9.0-blue)](https://dotnet.microsoft.com/download/dotnet/9.0)
[![Angular](https://img.shields.io/badge/Angular-21-red)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue)](https://www.postgresql.org/)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-IAP-yellow)](https://cloud.google.com/iap)

A comprehensive web application for managing partnerships and business opportunities within UNOPS, featuring advanced role-based access control, Google Cloud integration, and AI-powered capabilities.

## 🚀 Quick Start

### Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+ and npm](https://nodejs.org/) (CI uses Node 20; match it for consistent builds)
- [PostgreSQL 13+](https://www.postgresql.org/download/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repo-directory>
```

#### 2. Setup Angular Client Application
```bash
# Navigate to client app directory
cd UNOPS.PAO.ClientApp

# Install dependencies
npm install

# Optional: Update dependencies
npm update

# Return to root directory
cd ..
```

#### 3. Database Setup
```bash
# Update connection string in appsettings.json
# Then run database migrations
dotnet ef database update --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess/UNOPS.PAO.UNOPSDataAccess.csproj --startup-project UNOPS.PAO.Server
```

#### 4. Build and Run

**Option A: Visual Studio**
- Open `UNOPS.PAO.sln` in Visual Studio
- Set `UNOPS.PAO.Server` as startup project
- Press F5 to run

**Option B: Command Line**
```bash
# Build the entire solution
dotnet build UNOPS.PAO.sln

# Run the application
dotnet run --project UNOPS.PAO.Server

# For development with hot reload
dotnet watch run --project UNOPS.PAO.Server
```

**Option C: Concurrent Development (Recommended)**
```bash
# Terminal 1: Run .NET backend
dotnet watch run --project UNOPS.PAO.Server

# Terminal 2: Run Angular frontend (in UNOPS.PAO.ClientApp directory)
cd UNOPS.PAO.ClientApp
npm start
```

### Development URLs

When you run the server with the default **https** profile in `UNOPS.PAO.Server/Properties/launchSettings.json` and the Angular app via the solution’s SpaProxy (see `UNOPS.PAO.Server` `SpaProxyServerUrl` and `UNOPS.PAO.ClientApp` `angular.json` **port**):

- **Backend (Kestrel):** `https://localhost:7123` (optional HTTP: `http://localhost:5159`)
- **Frontend (ng serve, SpaProxy):** `https://localhost:44426`
- **Development login (Development environment only):** `https://localhost:7123/dev-login` (path is registered in `UNOPS.PAO.Server`; adjust host/port if you change launch settings)
- **OpenAPI (when enabled in Development):** `/swagger` on the same base URL as the API

## 📁 Project Structure

```
.
├── UNOPS.PAO.Server/              # Main web server (ASP.NET Core)
├── UNOPS.PAO.ClientApp/           # Angular frontend application
├── UNOPS.PAO.UNOPSBusiness/       # Business logic layer
├── UNOPS.PAO.UNOPSDataAccess/     # Data access layer (Entity Framework)
├── UNOPS.PAO.UNOPSDomain/         # Domain models and entities
├── UNOPS.PAO.UNOPSIdentity/       # Authentication and authorization
├── UNOPS.PAO.UNOPSPresentation/   # API controllers and presentation layer
├── UNOPS.PAO.Models/              # Data transfer objects (DTOs)
├── UNOPS.PAO.GoogleServices/      # Google Cloud integrations
├── UNOPS.PAO.AiService/           # AI and machine learning services
├── UNOPS.PAO.Scripts/             # Database scripts and migrations
├── docs/                          # Security, development, and feature documentation
├── QA Tests/                      # Automated test suites and QA assets
├── tasks/                         # PRDs, task lists, and implementation notes
└── .github/workflows/           # GitHub Actions (CI, bot integrations)
```

## 📖 Documentation

Long-form technical docs live under [`docs/`](./docs/):

### 🔐 Authentication & Security
- **[IAP Authentication Guide](./docs/Security/IAP-Authentication-Guide.md)** — Identity-Aware Proxy, production vs development
- **[Role-Based Access Control (RBAC)](./docs/Security/Role-Based-Access-Control-Implementation.md)** — permissions and row-level patterns
- **[Security Measures](./docs/Security/SecurityMeasures.md)** — security architecture overview

### 🏗️ Architecture & Development
- **[CI and bot integrations](./docs/Development/CI-AND-BOT-INTEGRATIONS.md)** — `qa-tests` pipeline and Gemini dispatch workflow
- **[Backend quick start](./docs/Development/BACKEND_QUICK_START_GUIDE.md)** — backend orientation
- See also [`docs/Development/`](./docs/Development/) (testing guides, cloud SQL, changelogs)

## 🎯 Key Features

### 🔒 Advanced Security
- **Google Cloud IAP Integration** - Enterprise-grade authentication
- **Development Simulation** - Full IAP simulation for local development
- **Role-Based Access Control** - Fine-grained permissions with row-level filtering
- **Multi-Layer Security** - SQL injection prevention, expression validation, parameter security

### 🤖 AI-Powered Features
- **Intelligent Partner Matching** - AI-driven partner recommendations
- **Smart Content Analysis** - Automated content processing and insights
- **Document Intelligence** - AI-powered document analysis and extraction

### 📊 Business Capabilities
- **Partner Management** - Comprehensive partner lifecycle management
- **Opportunity Tracking** - Business opportunity pipeline management
- **Contact Management** - Advanced contact relationship management
- **Interaction Logging** - Detailed interaction history and analytics

### 🔄 Import/Export Features
- **Google Sheets Integration** - Direct import from Google Sheets
- **Bulk Data Operations** - Efficient bulk import/export capabilities
- **Data Validation** - Comprehensive validation and error handling

## 🛠️ Development Commands

### Backend (.NET)
```bash
# Build solution
dotnet build UNOPS.PAO.sln

# Run with hot reload
dotnet watch run --project UNOPS.PAO.Server

# Run tests
dotnet test

# Clean solution
dotnet clean UNOPS.PAO.sln
```

### Frontend (Angular)
```bash
cd UNOPS.PAO.ClientApp

# Install dependencies
npm install

# Development server
npm start

# Build for development
npm run build

# Build for testing
npm run build:test

# Build for production
npm run build:prod

# Run tests
npm test

# Format code
npm run format
```

### Database Operations
```bash
# List migrations
dotnet ef migrations list --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess/UNOPS.PAO.UNOPSDataAccess.csproj --startup-project UNOPS.PAO.Server

# Add new migration
dotnet ef migrations add [MigrationName] --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess/UNOPS.PAO.UNOPSDataAccess.csproj --startup-project UNOPS.PAO.Server

# Update database
dotnet ef database update --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess/UNOPS.PAO.UNOPSDataAccess.csproj --startup-project UNOPS.PAO.Server

# Remove last migration
dotnet ef migrations remove --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess/UNOPS.PAO.UNOPSDataAccess.csproj --startup-project UNOPS.PAO.Server
```

## 🏃‍♂️ Development Workflow

### For New Developers

1. **Setup Environment**: Follow the [Quick Start](#-quick-start) section
2. **Read Security Documentation**: Understand the [RBAC system](./docs/Security/Role-Based-Access-Control-Implementation.md)
3. **Learn IAP Authentication**: Review the [IAP guide](./docs/Security/IAP-Authentication-Guide.md)
4. **Use Development Login**: Access `https://localhost:7123/dev-login` (or your Kestrel HTTPS URL) to simulate different users

### For Authentication Testing

```bash
# Start development server
dotnet run --project UNOPS.PAO.Server

# Access development login page
open https://localhost:7123/dev-login

# Test different user roles:
# - admin@unops.org (Full access)
# - partner@company.com (Partner access)  
# - external@public.org (Limited access)
```

### For Database Changes

```bash
# 1. Modify entities in UNOPS.PAO.UNOPSDomain
# 2. Add migration
dotnet ef migrations add YourMigrationName --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess --startup-project UNOPS.PAO.Server

# 3. Update database
dotnet ef database update --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess --startup-project UNOPS.PAO.Server
```

## 📋 Import Functionality

The system supports importing contact and partner data from Google Sheets:

### How to Import

1. **Initiate Import**: From Contact/Partner list, click "Import" button
2. **Select Spreadsheet**: Choose a Google Sheets file
3. **Review Data**: System displays imported data with validation
4. **Edit Records**: Modify individual records as needed
5. **Select & Import**: Choose records to import and complete the process

### Required Fields

**Contacts:**
- Last Name
- Partner ID  
- Email

**Partners:**
- Name
- Short Name
- New Engagement
- Pooled Fund
- DD Required
- DDEAC Done
- Levy Potentially Applies

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore UNOPS.PAO.sln
```

**Angular Issues:**
```bash
cd UNOPS.PAO.ClientApp

# Clear node modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Database Issues:**
```bash
# Reset database (WARNING: This will delete all data)
dotnet ef database drop --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess --startup-project UNOPS.PAO.Server --force

# Recreate database
dotnet ef database update --context UNOPS.PAO.UNOPSDataAccess.Context.UNOPSAppDbContext --project UNOPS.PAO.UNOPSDataAccess --startup-project UNOPS.PAO.Server
```

**Authentication Issues (Development):**
- Clear browser cookies and local storage
- Restart the development server
- Use `/dev-login` for local authentication simulation
- Check the [IAP Authentication Guide](./docs/Security/IAP-Authentication-Guide.md) for detailed troubleshooting

## 🔗 Additional Resources

- **[Google Cloud IAP Documentation](https://cloud.google.com/iap/docs)**
- **[ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)**
- **[Angular Documentation](https://angular.io/docs)**
- **[Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)**

## 🤝 Contributing

1. Read the documentation in the [`docs/`](./docs/) folder
2. Follow the [Role-Based Access Control guidelines](./docs/Security/Role-Based-Access-Control-Implementation.md)
3. Test authentication flows using the [IAP simulation system](./docs/Security/IAP-Authentication-Guide.md)
4. Ensure all security measures are followed as outlined in [SecurityMeasures.md](./docs/Security/SecurityMeasures.md)

## 📞 Support

For technical support or questions about the system architecture, security implementation, or development setup, refer to the documentation in the [`docs/`](./docs/) folder and feature notes under [`tasks/`](./tasks/) where applicable.

---

**Built with ❤️ by the UNOPS Development Team**