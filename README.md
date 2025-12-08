# 🎮 Milumon Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9-orange)](https://firebase.google.com/)

> 📚 **[Deployment Guide](./docs/deployment-guide.md)** - Quick setup for Google Cloud deployment

A modern, interactive portfolio website built with Next.js 15, featuring a unique dual-sided design that showcases both gaming content creator and web developer personas. Built with cutting-edge technologies and optimized for performance.

## ✨ Features

- 🎮 **Dual-sided design**: Split-screen layout showcasing gaming content creator and web developer identities
- 🔐 **Admin panel**: Secure content management with Google OAuth authentication
- 🎨 **Glassmorphism UI**: Modern glass-like design effects with backdrop blur
- 📱 **Fully responsive**: Optimized for all device sizes and screen resolutions
- 🔥 **Firebase integration**: Real-time authentication and Firestore database
- 🖼️ **GitHub CDN**: Free image hosting using GitHub Pages as CDN
- ⚡ **Performance optimized**: Next.js 15 with App Router, automatic code splitting
- 🎭 **Framer Motion**: Smooth animations and transitions
- 🎯 **TypeScript**: Full type safety throughout the application
- 🌙 **Dark mode**: Consistent dark theme design

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - Required for Next.js 15
- **Firebase project** with Firestore enabled
- **Google OAuth** configured for authentication
- **GitHub account** for image hosting (optional)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/milumon-portfolio.git
cd milumon-portfolio
```

2. **Install dependencies:**
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Environment Setup:**
Copy the example environment file and configure your values:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:
```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: GitHub Integration
GH_TOKEN=your_github_token_here
GH_USERNAME=your_github_username
GH_REPO=your_repository_name
```

4. **Start development server:**
```bash
npm run dev
# or
pnpm dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 🔧 Admin Panel Setup

### Firebase Configuration
1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one

2. **Enable Services:**
   - **Firestore Database**: Enable and create database in production mode
   - **Authentication**: Enable Google sign-in provider
   - **Storage**: Enable for file uploads (optional)

3. **OAuth Setup:**
   - Go to Authentication → Sign-in method → Google
   - Enable Google provider
   - Add authorized domains: `localhost`, your production domain
   - Configure OAuth consent screen

4. **Security Rules:**
   ```javascript
   // Firestore Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Accessing Admin Panel
1. **Navigate to `/admin`**
2. **Sign in with Google**
3. **Use "Seed Data" button** to populate initial content
4. **Manage content** through the intuitive interface

### 🖼️ Image Management

#### Option 1: GitHub CDN (Free)
1. **Upload images** to `public/images/projects/` in your repository
2. **Commit and push** to GitHub
3. **Use raw URLs** in admin panel:
   ```
   https://raw.githubusercontent.com/username/repo/main/public/images/projects/image.jpg
   ```

#### Option 2: Admin Panel Upload (Recommended)
1. **Go to Admin Panel → Images**
2. **Upload images directly** through the interface
3. **Images are stored** on GitHub and served via CDN
4. **Automatic URL generation** for projects

#### Image Specifications
- **Formats**: PNG, JPG, WebP
- **Max size**: 5MB per image
- **Optimization**: Automatic compression and WebP conversion

## 📁 Project Structure

```
milumon-portfolio/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 admin/
│   │   │   └── page.tsx          # Admin panel interface
│   │   ├── 📁 api/
│   │   │   └── 📁 github/
│   │   │       └── 📁 images/
│   │   │           └── route.ts   # GitHub API integration
│   │   ├── favicon.ico
│   │   ├── globals.css           # Global styles & CSS variables
│   │   ├── layout.tsx            # Root layout with font optimization
│   │   └── page.tsx              # Main portfolio page
│   ├── 📁 components/
│   │   ├── 📁 ui/                # Reusable UI components (25+ components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (21 more)
│   │   ├── 📁 icons/
│   │   │   └── tiktok.tsx        # Custom icon components
│   │   ├── dev-side.tsx          # Developer portfolio section
│   │   ├── gamer-side.tsx        # Gaming content creator section
│   │   ├── image-manager.tsx     # Image upload/management
│   │   ├── motion-div.tsx        # Animation wrapper component
│   │   ├── projects-carousel.tsx # Project showcase carousel
│   │   ├── tech-stack-list.tsx   # Technology badges display
│   │   └── wireframe-overlay.tsx # Background wireframe effect
│   ├── 📁 lib/
│   │   ├── firebase.ts           # Firebase configuration
│   │   ├── firestore.ts          # Database operations
│   │   ├── github.ts             # GitHub API utilities
│   │   ├── placeholder-images.json # Fallback image data
│   │   ├── placeholder-images.ts # Image placeholder utilities
│   │   ├── seed-data.ts          # Initial data seeding
│   │   └── utils.ts              # Utility functions
│   └── 📁 hooks/                 # Custom React hooks
│       └── use-toast.ts          # Toast notification hook
├── 📁 public/                    # Static assets
├── 📄 middleware.ts              # Route protection middleware
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tailwind.config.ts         # Tailwind CSS configuration
├── 📄 package.json               # Dependencies & scripts
├── 📄 .eslintrc.json             # ESLint configuration
└── 📄 README.md                  # This file
```

## 🛠️ Tech Stack

### **Core Framework**
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe JavaScript
- **React 18** - UI library with concurrent features

### **Styling & UI**
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

### **Backend & Database**
- **Firebase** - Backend-as-a-Service
  - Firestore (Database)
  - Authentication (Google OAuth)
  - Hosting (Optional)

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Type checking

### **Performance & Optimization**
- **Next.js Image Optimization**
- **Automatic Code Splitting**
- **CSS-in-JS with Tailwind**
- **Font optimization with next/font**

## 🚀 Deployment

### **Vercel (Recommended)**
1. **Connect Repository:**
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect Next.js settings

2. **Environment Variables:**
   - Add Firebase config in Vercel dashboard
   - Configure build settings if needed

3. **Deploy:**
   - Automatic deployments on every push
   - Preview deployments for pull requests

### **Other Platforms**

#### **Netlify**
```bash
# Build command
npm run build

# Publish directory
./out
```

#### **Railway**
- Connect GitHub repository
- Automatic Next.js detection
- Add environment variables

#### **Self-hosted**
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Development

### **Code Quality**
```bash
# Run linting
npm run lint

# Type checking
npm run typecheck

# Build check
npm run build
```

### **Project Conventions**
- **ESLint**: Strict configuration for code quality
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (via ESLint)
- **Component naming**: PascalCase for components
- **File naming**: kebab-case for files, PascalCase for components

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes** following the code style
4. **Test thoroughly:**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
5. **Commit with conventional format:**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Submit pull request**

### **Commit Convention**
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Maintenance

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **Firebase** for backend services
- **Tailwind CSS** for the utility-first approach
- **Radix UI** for accessible components

## 📞 Support

If you have questions or need help:
- Open an [issue](https://github.com/your-username/milumon-portfolio/issues)
- Check the [discussions](https://github.com/your-username/milumon-portfolio/discussions)

---

**Built with ❤️ by Milumon**
