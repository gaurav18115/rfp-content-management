# RFP Contract Management System

A comprehensive, full-stack RFP (Request for Proposal) contract management system built with modern technologies and AI-powered productivity tools.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.54.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue)
![pnpm](https://img.shields.io/badge/pnpm-8.0.0-orange)

## 🎯 Project Overview

This system demonstrates the ability to create production-ready applications using modern technologies and AI tools for productivity. It provides a complete solution for managing the entire RFP lifecycle from creation to approval.

**Development Timeline**: 2 hours  
**Focus**: Core MVP features only  

## 📁 Repository Structure

```
Repository Structure
├── readme.md
├── frontend/
├── backend/
├── docs/
│   ├── api-docs.md
│   ├── database-schema.md
│   ├── test-users-readme.md
│   ├── implementation-status.md
│   ├── database-setup.md
│   └── setup.md
└── deployment/
    └── readme.md
```

## ✨ Core Features (MVP)

### 1. User Management & Authentication ✅

- [x] User registration with role selection (Buyer/Supplier)
- [x] JWT-based authentication via Supabase
- [x] Role-based access control (RBAC)
- [x] Secure session management

### 2. RFP Lifecycle Management 🚧

- [ ] Buyers can create and publish RFPs
- [ ] Suppliers can browse available RFPs and submit responses
- [ ] Buyers can review responses and approve/reject them
- [ ] Document status tracking: Draft → Published → Response Submitted → Under Review → Approved/Rejected

### 3. Document Management 🚧

- [ ] File upload capabilities for RFP documents and responses
- [ ] Document indexing and full-text search
- [ ] Version control for document updates
- [ ] Secure document storage and access control

### 4. Email Notifications 📋

- [ ] Automated emails when RFP status changes
- [ ] Notifications to suppliers when new RFPs are published
- [ ] Alerts to buyers when responses are submitted
- [ ] Email templates and delivery tracking

### 5. Dashboard & UI ✅

- [x] Role-specific dashboards
- [x] Responsive, modern design with Tailwind CSS
- [x] Real-time status updates
- [x] Mobile-first responsive design

## 🚀 Tech Stack

- **Frontend**: Next.js 15.4.6 with App Router
- **Backend**: Supabase (Database, Auth, Storage, Real-time)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm
- **Authentication**: Supabase Auth with JWT
- **Database**: PostgreSQL (via Supabase)
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

## 📋 Development Phases (2-Hour Timeline)

### Phase 1: Foundation & Authentication ✅ (30 min)

- [x] Project setup with Next.js and Supabase
- [x] Database schema design
- [x] User authentication system
- [x] Role-based access control
- [x] Basic UI components and layout
- [x] Environment configuration

### Phase 2: Core RFP Management 🚧 (60 min)

- [ ] Database tables for RFPs, responses, and documents
- [ ] RFP creation and editing forms
- [ ] RFP listing and search functionality
- [ ] Document upload and storage
- [ ] Basic CRUD operations for RFPs

### Phase 3: User Workflows & Polish 🚧 (30 min)

- [ ] Buyer dashboard for RFP management
- [ ] Supplier dashboard for RFP browsing
- [ ] Response submission system
- [ ] Status tracking and updates
- [ ] Basic testing and bug fixes

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd rfp-content-management
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Seed Demo Accounts (Optional)**

   To create test accounts for development and review:

   ```bash
   pnpm run seed-demo
   ```

   This creates the following demo accounts:
   - **Buyer**: <buyer@test.com> / password123
   - **Supplier**: <supplier@test.com> / password123

   > **Note**: Requires `SUPABASE_SERVICE_ROLE_KEY` in your environment variables.

5. **Run the development server**

   ```bash
   pnpm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema (Simplified)

### Core Tables

- `users` - User accounts and profiles
- `rfps` - RFP documents and metadata
- `rfp_responses` - Supplier responses to RFPs
- `documents` - File storage and metadata

### Relationships

- Users have roles (Buyer/Supplier)
- Buyers create RFPs
- Suppliers submit responses to RFPs
- Documents are linked to RFPs and responses

## 🔧 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run seed-demo` - Create demo accounts for testing
- `pnpm run setup-db` - Setup database tables
- `pnpm run test:auth` - Test authentication system

## 📚 Documentation

- **[API Documentation](docs/api-docs.md)** - Complete API reference
- **[Database Schema](docs/database-schema.md)** - Database design and relationships
- **[Setup Guide](docs/setup.md)** - Setup instructions
- **[Database Setup](docs/database-setup.md)** - Database setup guide
- **[Implementation Status](docs/implementation-status.md)** - Current development status
- **[Test Users](docs/test-users-readme.md)** - Testing information
- **[Demo Account Seeding](docs/seeding-readme.md)** - How to create test accounts
- **[Deployment Guide](deployment/readme.md)** - Quick deployment instructions

## 📦 Deployment

### Quick Deploy (5 minutes)

1. **Vercel (Recommended)**
   - Connect GitHub repository
   - Set environment variables
   - Deploy automatically

2. **Netlify**
   - Link repository
   - Configure build settings
   - Deploy with one click

### Manual Deployment

1. Build the application: `pnpm run build`
2. Start the production server: `pnpm run start`
3. Configure your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)

---

**Status**: 🚧 In Development | **Timeline**: 2 Hours | **Focus**: Core MVP Features | **Last Updated**: December 2024 | **Version**: 1.0.0-alpha
