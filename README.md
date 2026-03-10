# 🛠️ Håndtverkeren - Norwegian Craftsman Matching Platform

A modern web application that connects customers with verified Norwegian craftsmen and professionals.

## 🌟 Features

### Customer Features
- **Browse Categories** - Find professionals across multiple service categories
- **Post Job Requests** - Create detailed job requests with images and specifications
- **Location-based Search** - Find local craftsmen in your area
- **Budget Settings** - Set your budget and get matching offers
- **Track Requests** - View and manage all your job requests

### Professional Features
- **Professional Registration** - Verify credentials and get listed
- **Receive Job Offers** - Get matched with relevant customer requests
- **Portfolio Showcase** - Display your work and expertise

## 🎨 Design System

- **Colors:** Dark Blue (#17384E), Warm Brown (#E07B3E)
- **Typography:** Inter font family
- **Spacing:** 8px grid system
- **Fully Responsive** - Mobile-first design
- **Norwegian Language** - Complete Norwegian localization

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

**The app is ready to deploy!** Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy Options:**

1. **Netlify** (Easiest) - Drag & drop the `dist` folder
2. **Vercel** - One-click deploy from Git
3. **GitHub Pages** - Free hosting for public repos

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts
│   │   ├── pages/          # Main pages (Landing, Registration, etc.)
│   │   ├── routes.ts       # React Router configuration
│   │   └── App.tsx         # Root component
│   ├── styles/
│   │   ├── index.css       # Global styles
│   │   ├── theme.css       # Design tokens
│   │   └── tailwind.css    # Tailwind configuration
│   └── main.tsx            # Application entry point
├── public/
│   └── _redirects          # Netlify routing config
├── index.html              # HTML entry point
└── vite.config.ts          # Vite configuration
```

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4
- **Build Tool:** Vite 6
- **UI Components:** Radix UI + shadcn/ui
- **Forms:** React Hook Form
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)

## 🌐 Pages

- `/` - Landing page with hero, categories, and featured professionals
- `/registration` - Multi-step registration for customers and suppliers
- `/create-request` - Job request creation form
- `/my-requests` - Dashboard for managing requests

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific configuration:

```bash
VITE_API_URL=your_api_url_here
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📝 Current State

**Status:** Frontend-complete, production-ready

The application is currently frontend-only with mock data. All UI components, navigation, and interactions are fully functional.

**Next Steps:**
1. Deploy to hosting platform (Netlify/Vercel recommended)
2. Add backend functionality (Supabase for database + auth)
3. Connect to real APIs (payments, SMS, maps)

## 🤝 Contributing

This is a private project. For questions or issues, contact the project maintainer.

## 📄 License

Private - All rights reserved

---

**Built with ❤️ for Norwegian craftsmen and customers**
