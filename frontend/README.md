# Frontend

## Next.js Frontend Application

**Project Timeline**: 2 hours  
**Focus**: Core MVP UI components and workflows  

## 🏗️ Architecture

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui component library
- **State Management**: React hooks + Supabase real-time

## 📁 Directory Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
```

## 🚀 Key Features

### 1. Authentication System

- User registration and login
- Role-based access control
- Protected routes and middleware

### 2. Dashboard Interfaces

- **Buyer Dashboard**: RFP creation and management
- **Supplier Dashboard**: RFP browsing and response submission

### 3. Responsive Design

- Mobile-first approach
- Touch-friendly interface
- Cross-browser compatibility

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm package manager

### Setup

```bash
cd frontend
pnpm install
pnpm run dev
```

### Build

```bash
pnpm run build
pnpm run start
```

## 📱 Mobile Optimization

- Progressive Web App (PWA) ready
- Responsive breakpoints
- Touch gesture support
- Offline capability (basic)

## 🎨 Design System

- Consistent color palette
- Typography scale
- Component variants
- Dark/light mode support

---

**Status**: 🚧 In Development | **Timeline**: 2 Hours MVP
