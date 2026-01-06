# 🥗 NutriGuide - AI-Powered Nutrition & Meal Planning Platform

<div align="center">

[![Angular](https://img.shields.io/badge/Angular-17+-red?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://github.com/Mohamed-Abdulmajeed/NutriGuide)

**A comprehensive AI-driven platform for personalized meal planning, nutritional analysis, and meal tracking with intelligent shopping list generation.**

[Live Demo](#-live-demo) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 📋 Overview

NutriGuide is a full-stack web application that leverages artificial intelligence to provide users with:
- **Personalized meal plans** based on dietary preferences and nutritional goals
- **AI-powered meal generation** using advanced algorithms
- **Nutritional analysis** and tracking
- **Intelligent shopping list generation** from meal plans
- **User management** with authentication and profile customization
- **Admin dashboard** for system management and analytics
- **Real-time notifications** using SignalR

The platform combines modern frontend technologies with a robust backend to deliver a seamless user experience.

---

## ✨ Key Features

### 👤 User Management
- **User Authentication** - Secure login and registration
- **Email Verification** - Confirm user email addresses
- **Password Reset** - Secure password recovery flow
- **Profile Management** - Customize user preferences and dietary restrictions
- **Account Settings** - Manage notifications and preferences

### 🍽️ Meal Planning
- **AI-Powered Meal Generation** - Generate meals based on user preferences
- **Custom Meal Plans** - Create personalized weekly/monthly plans
- **Favorite Meals** - Save and manage favorite meals
- **Meal Details & Nutrition** - View complete nutritional information
- **Meal Filtering** - Search by cuisine, calories, ingredients

### 🛒 Shopping Features
- **Intelligent Shopping List** - Auto-generated from meal plans
- **Smart Organization** - Grouped by categories and supermarkets
- **List Management** - Add, edit, delete items
- **Price Integration** - Track costs and budget
- **Export Options** - Share lists with family or friends

### 📊 Analytics & Tracking
- **Nutritional Dashboard** - Track calories, macros, and nutrients
- **Progress Tracking** - Monitor dietary goals and achievements
- **Consumption History** - View meal consumption records
- **Statistics** - Visual analytics and insights

### 🔔 Real-Time Features
- **Push Notifications** - Real-time meal and plan updates
- **SignalR Integration** - Live communication with server
- **Instant Updates** - Get notifications for meal suggestions

### 🛡️ Admin Management
- **Admin Dashboard** - System overview and statistics
- **User Management** - Monitor and manage user accounts
- **Content Management** - Manage meals and plans
- **System Settings** - Configure platform settings
- **Analytics** - Detailed system analytics

---

## 🛠️ Tech Stack

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 21 | Modern web framework |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **RxJS** | Latest | Reactive programming |
| **Angular Material** | Latest | UI Components |
| **Tailwind CSS** | Latest | Utility-first CSS |
| **SignalR** | Latest | Real-time communication |

### Backend
- **.NET 8** - Robust API framework
- **Entity Framework Core** - ORM for database access
- **SQL Server** - Relational database
- **OpenAI API** - AI meal generation
- **JWT Authentication** - Secure token-based auth

### Development Tools
- **npm** - Package management
- **Angular CLI** - Development tools
- **Jasmine & Karma** - Unit testing
- **Git** - Version control
- **VS Code** - IDE

---

## 📸 Screenshots

### Platform Overview
![NutriGuide Swagger API Documentation](../../NutriGuide-Back-End/nutriguide.runasp.net_swagger_index.html.png)
*API Documentation - Backend Swagger Interface*

---

## 🖼️ Platform Screenshots

![Screenshot 1](./screen1.png)

![Screenshot 2](./screen2.png)

![Screenshot 3](./screen3.png)

![Screenshot 4](./screen4.png)

![Screenshot 5](./screen5.png)

![Screenshot 6](./screen6.png)

![Screenshot 7](./screen7.png)

![Screenshot 8](./screen8.png)

![Screenshot 9](./screen9.png)

![Screenshot 10](./screen10.png)

---

## 🎥 Video Demo

A comprehensive demo video showcasing all platform features is available:

**[Download Full Demo Video](https://nutri-guide-olive.vercel.app/assets/demo.mp4)**

The video covers:
- ✅ User registration and authentication
- ✅ Profile setup and preferences
- ✅ AI-powered meal generation
- ✅ Meal plan creation
- ✅ Shopping list generation
- ✅ Nutritional tracking
- ✅ Admin features
- ✅ Mobile responsiveness

---

## 🚀 Live Demo

Experience NutriGuide yourself:

**[🔗 Live Application - https://nutri-guide-olive.vercel.app/login](https://nutri-guide-olive.vercel.app/login)**


## 💼 Portfolio & Video

The complete video demonstration showcasing all platform features is hosted on:

**[📱 Mohamed Abdelmajeed - Full Stack Developer Portfolio](https://mohamed-abdelmajeed-portfolio.vercel.app/)**

The video demonstrates:
- Complete user workflow from registration to meal planning
- Admin dashboard capabilities
- AI meal generation in action
- Shopping list generation and management
- Mobile responsiveness across devices
- Real-time notifications system

---

## 🔗 Backend Repository

The robust backend infrastructure powering NutriGuide:

**[💻 NutriGuide Backend - ASP.NET Web API](https://github.com/Mohamed-Abdulmajeed/NutriGuide-Back-End)**

Backend features include:
- RESTful API endpoints with Swagger documentation
- Real-time communication using SignalR
- Advanced database operations with Entity Framework Core
- JWT Authentication and authorization
- AI integration with OpenAI for meal generation
- Complete SQL Server database design

---

## 📁 Project Structure

```
NutriGuide/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Account/          # Authentication & user account
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forget-password/
│   │   │   │   ├── verify-email/
│   │   │   │   └── complete-registration/
│   │   │   │
│   │   │   ├── Admin/            # Admin management features
│   │   │   │   ├── admin-dashboard/
│   │   │   │   ├── admin-settings/
│   │   │   │   └── meal-details-admin/
│   │   │   │
│   │   │   ├── Home/             # Home page & user dashboard
│   │   │   │   ├── home-page/
│   │   │   │   ├── profile/
│   │   │   │   └── notification/
│   │   │   │
│   │   │   ├── Meal/             # Meal management
│   │   │   │   ├── details-meal/
│   │   │   │   ├── favorite-meal/
│   │   │   │   └── generate-meal/
│   │   │   │
│   │   │   ├── Plan/             # Meal plan management
│   │   │   │   ├── all-plan/
│   │   │   │   ├── details-plan/
│   │   │   │   ├── generate-plan/
│   │   │   │   └── shopping-list/
│   │   │   │
│   │   │   ├── header/           # Navigation header
│   │   │   ├── aside-bar/        # Sidebar navigation
│   │   │   └── footer/           # Footer component
│   │   │
│   │   ├── models/               # TypeScript interfaces & models
│   │   │   ├── iall-customer.ts
│   │   │   ├── Notification/
│   │   │   │   └── notificationList.ts
│   │   │   ├── Plan/
│   │   │   │   ├── iplan-prompt.ts
│   │   │   │   ├── iplan.ts
│   │   │   │   └── shopping-list.ts
│   │   │   └── Profile/
│   │   │       └── icustomer.ts
│   │   │
│   │   ├── shared/               # Shared services & utilities
│   │   │   ├── prompt.ts         # Prompt management
│   │   │   ├── Account/
│   │   │   │   ├── login-service.ts
│   │   │   │   └── register-service.ts
│   │   │   ├── Admin/
│   │   │   │   ├── admin-service.ts
│   │   │   │   └── setting-service.ts
│   │   │   ├── Meal/
│   │   │   │   ├── favorite-service.ts
│   │   │   │   └── notification-service.ts
│   │   │   ├── Plan/
│   │   │   │   └── plan-service.ts
│   │   │   ├── Profile/
│   │   │   │   └── profile-service.ts
│   │   │   ├── alerts/
│   │   │   │   └── alertnotification.ts
│   │   │   └── SignalR/
│   │   │       └── signalr-service.ts
│   │   │
│   │   ├── app.routes.ts         # Route definitions
│   │   ├── app.config.ts         # App configuration
│   │   ├── app.ts                # Root component
│   │   └── app.css               # Global styles
│   │
│   ├── environments/             # Environment configuration
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── styles.css                # Global CSS
│
├── angular.json                  # Angular configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                      # This file

```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│         Angular Frontend (NutriGuide)            │
├─────────────────────────────────────────────────┤
│                                                  │
│  Components (UI Layer)                          │
│  ↓                                              │
│  Services (Business Logic)                      │
│  ↓                                              │
│  HTTP Client / SignalR                          │
└─────────────────────────────────────────────────┘
           ↕ RESTful API + WebSocket
┌─────────────────────────────────────────────────┐
│      .NET Backend (NutriGuide-Back-End)         │
├─────────────────────────────────────────────────┤
│                                                  │
│  Controllers (API Endpoints)                    │
│  ↓                                              │
│  Services (Business Logic)                      │
│  ↓                                              │
│  Entity Framework Core                          │
│  ↓                                              │
│  SQL Server Database                            │
│                                                  │
│  External: OpenAI API (AI Meal Generation)      │
└─────────────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **.NET 8 SDK** (for backend)
- **SQL Server** 2022+ (or SQL Server Express)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohamed-Abdulmajeed/NutriGuide.git
   cd NutriGuide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api',
     signalRUrl: 'http://localhost:5000/signalR',
     openAIKey: 'your-openai-key'
   };
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`

5. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

Refer to [NutriGuide-Back-End](https://github.com/Mohamed-Abdulmajeed/NutriGuide-Back-End) repository for detailed backend installation instructions.

---

## 💻 Usage Guide

### For End Users

1. **Create Account**
   - Register with email and password
   - Verify email address
   - Complete profile setup

2. **Set Preferences**
   - Select dietary restrictions
   - Set nutritional goals
   - Choose cuisine preferences

3. **Generate Meal Plan**
   - Use AI to generate personalized meal plan
   - Customize meals as needed
   - Review nutritional information

4. **Create Shopping List**
   - Generate smart shopping list from meal plan
   - Organize by categories
   - Track costs and budget

5. **Track Progress**
   - Log consumed meals
   - View nutrition statistics
   - Monitor goal achievement

### For Administrators

1. **Admin Dashboard**
   - Monitor system statistics
   - Manage user accounts
   - View platform analytics

2. **Content Management**
   - Add/edit/delete meals
   - Manage food categories
   - Configure system settings

3. **User Management**
   - View all users
   - Monitor user activity
   - Handle user support requests

---

## 🔌 API Documentation

Complete API documentation is available through the backend Swagger interface:

**[Backend API Swagger](https://nutri-guide-api.vercel.app/swagger/index.html)**

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forget-password` - Request password reset
- `POST /api/auth/verify-code` - Verify reset code

#### Meals
- `GET /api/meals` - Get all meals
- `GET /api/meals/{id}` - Get meal details
- `POST /api/meals` - Create new meal (Admin)
- `PUT /api/meals/{id}` - Update meal (Admin)
- `DELETE /api/meals/{id}` - Delete meal (Admin)

#### Plans
- `GET /api/plans` - Get user plans
- `POST /api/plans/generate` - Generate AI meal plan
- `GET /api/plans/{id}` - Get plan details
- `PUT /api/plans/{id}` - Update plan
- `DELETE /api/plans/{id}` - Delete plan

#### Shopping Lists
- `GET /api/shopping-lists` - Get user lists
- `POST /api/shopping-lists/generate` - Generate from plan
- `PUT /api/shopping-lists/{id}` - Update list
- `DELETE /api/shopping-lists/{id}` - Delete list

#### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

#### Favorites
- `GET /api/favorites` - Get favorite meals
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/{id}` - Remove from favorites

#### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/preferences` - Get preferences
- `PUT /api/profile/preferences` - Update preferences

#### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - System analytics
- `GET /api/admin/settings` - System settings
- `PUT /api/admin/settings` - Update settings

---

## 🎯 Core Features Explained

### 1. AI-Powered Meal Generation

The platform uses OpenAI's API to generate personalized meal plans based on:
- User preferences (cuisine type, dietary restrictions)
- Nutritional goals (calories, macros, nutrients)
- Available ingredients
- Cooking time and difficulty level

**Process:**
```
User Input → Prompt Generation → OpenAI API → Meal Suggestions → Nutritional Analysis → Display
```

### 2. Intelligent Shopping List

Automatically generated from meal plans with features:
- Ingredient consolidation (combine duplicates)
- Category grouping (produce, dairy, proteins, etc.)
- Cost estimation
- Store localization
- Quantity optimization

### 3. Real-Time Notifications

Using SignalR for instant communication:
- New meal suggestions
- Plan updates
- Friend shares
- System announcements
- Admin notifications

### 4. User Authentication Flow

Secure multi-step process:
```
1. Email Registration
   ↓
2. Email Verification
   ↓
3. Account Creation
   ↓
4. Login & JWT Token Generation
   ↓
5. Authenticated API Access
```

### 5. Admin Dashboard Analytics

- Total users and growth metrics
- Active plans and meals
- Nutritional trends
- System health monitoring
- User engagement statistics

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run E2E Tests
```bash
npm run e2e
```

### Test Coverage
```bash
npm run test:coverage
```

---

## 📱 Responsive Design

NutriGuide is fully responsive across all devices:

- **Desktop** (1920px and above) - Full experience
- **Tablet** (768px - 1024px) - Optimized layout
- **Mobile** (320px - 767px) - Touch-friendly interface

View the [Responsive Design Guide](RESPONSIVE_DESIGN_GUIDE.md) for detailed information.

---

## 📚 Additional Documentation

- [Shopping List Features](SHOPPING_LIST_FEATURES.md) - Complete shopping list functionality
- [Shopping List Technical Details](SHOPPING_LIST_TECHNICAL.md) - Technical implementation
- [Shopping List Updates (English)](SHOPPING_LIST_UPDATES.md)
- [Shopping List Updates (Arabic)](SHOPPING_LIST_UPDATES_AR.md)
- [Responsive Design Guide](RESPONSIVE_DESIGN_GUIDE.md)

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
npm run build
# Deploy the dist/nutriguide folder to Vercel
```

### Backend Deployment
Refer to backend repository for deployment instructions.

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Email Verification** - Confirm user identity
- **HTTPS** - Encrypted data transmission
- **CORS Protection** - Cross-origin request validation
- **Input Validation** - Prevent injection attacks
- **Rate Limiting** - API rate limiting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 👨‍💻 Author

**Mohamed Abdelmajeed**
- 🔗 [Portfolio](https://mohamed-abdelmajeed-portfolio.vercel.app/)
- 🐙 [GitHub](https://github.com/Mohamed-Abdulmajeed)
- 💼 [LinkedIn](https://www.linkedin.com/in/mohamed-abdelmajeed0)

---

## 🙏 Acknowledgments

- **OpenAI** - For GPT API for meal generation
- **Angular Team** - For the incredible framework
- **Community** - For feedback and support
- **Advisors** - For guidance and mentorship


<div align="center">

### ⭐ If you find NutriGuide helpful, please consider giving it a star!

---

**Last Updated:** January 2026

© 2026 NutriGuide. All rights reserved.

</div>


