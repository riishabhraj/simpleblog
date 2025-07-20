# SimpleBlog - Full Stack Blog Application

A modern, feature-rich blog application built with Next.js 13+, integrating NextAuth.js, Prisma, Supabase, and Sanity CMS.

## 🚀 Features

- **Authentication**: Complete auth system with NextAuth.js
  - Email/Password authentication
  - OAuth providers (Google, GitHub)
  - Protected routes and middleware

- **Content Management**:
  - Rich markdown editor for posts
  - Tag system for categorization
  - Draft and publish functionality

- **Database**:
  - Prisma ORM with PostgreSQL
  - Supabase for database hosting
  - Prisma Accelerate for performance optimization

- **User Experience**:
  - Responsive design with Tailwind CSS
  - User dashboard for managing posts
  - Comment system
  - Modern UI components with shadcn/ui

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with multiple providers
- **Database**: Prisma + Supabase PostgreSQL
- **Performance**: Prisma Accelerate (connection pooling & caching)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OAuth provider credentials (optional)

## 🔧 Setup Instructions

### 1. Environment Variables

Your `.env.local` file should contain:

```bash
# Database - Prisma Accelerate URL (for application)
DATABASE_URL=your_prisma_accelerate_url

# Direct database URL (for migrations and Prisma Studio)
DIRECT_URL=your_supabase_postgres_url

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog in action!

## 📚 API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Posts
- `GET /api/posts` - Get all published posts (with pagination)
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (author only)
- `DELETE /api/posts/[id]` - Delete post (author only)

### Comments
- `POST /api/posts/[id]/comments` - Add comment to post

### User
- `GET /api/user/posts` - Get current user's posts

### Tags
- `GET /api/tags` - Get all tags with post counts

## 🎯 Key Features Implemented

### 1. Authentication System
- Complete user registration and login
- OAuth integration (Google, GitHub)
- Protected routes with middleware
- Session management

### 2. Content Creation
- Rich markdown editor in `/write` page
- Real-time preview
- Tag management
- Draft and publish states
- Auto-generated slugs

### 3. User Dashboard
- View all user posts at `/dashboard`
- Edit, delete, and manage posts
- Post statistics (comments, status)

### 4. Blog Functionality
- Public post browsing at `/posts`
- Individual post pages at `/posts/[id]`
- Responsive design
- SEO-friendly structure

### 5. Database Integration
- Prisma ORM with PostgreSQL
- Optimized queries with relations
- Database connection pooling via Prisma Accelerate
- Data validation and type safety

## 🔐 Security Features

- CSRF protection via NextAuth.js
- SQL injection prevention via Prisma
- Environment variable protection
- Route-level authentication
- Input validation and sanitization

## 🎨 UI/UX Features

- Fully responsive design
- Dark/light mode support
- Loading states and error handling
- Modern component library (shadcn/ui)
- Smooth animations and transitions

## 📱 Pages Structure

```
/                 # Homepage with hero and features
/posts            # All published posts (paginated)
/posts/[id]       # Individual post view
/write            # Create/edit posts (protected)
/dashboard        # User's posts management (protected)
/signin           # Login page
/register         # Registration page
/forgot-password  # Password reset
```

## 🚦 Getting Started Checklist

- [ ] Set up Supabase project and get credentials
- [ ] Set up Sanity project and get credentials
- [ ] Configure OAuth providers (optional)
- [ ] Set up Prisma Accelerate (optional, for production)
- [ ] Add all environment variables
- [ ] Run database migrations
- [ ] Start development server
- [ ] Create your first account
- [ ] Write your first post!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, Prisma & Supabase**
