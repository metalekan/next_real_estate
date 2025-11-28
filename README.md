# 🏡 Horizon Homes - Real Estate Platform

A modern, full-stack real estate application built with Next.js 14, TypeScript, and MongoDB. Horizon Homes provides a comprehensive platform for property listings, user management, and real estate inquiries with role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.3-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication with HTTP-only cookies
- Role-based access control (User, Agent, Admin)
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Session management and token verification

### 🏠 Property Management
- **Browse Properties**: Advanced search and filtering system
- **Property Listings**: Create, read, update, and delete properties
- **Image Support**: Multiple property images with Cloudinary integration
- **Property Details**: Comprehensive property information including:
  - Type (House, Apartment, Condo, Townhouse, Land, Commercial)
  - Status (For Sale, For Rent, Sold, Rented)
  - Features (Bedrooms, Bathrooms, Square Feet, Parking, Garage)
  - Amenities (Pool, Garden, Gym, Security, etc.)
  - Location details with full address

### 🔍 Advanced Search & Filtering
- Search by title, city, or description
- Filter by property type and status
- Price range filtering (min/max)
- Bedroom and bathroom count filters
- City-based location search
- Sort options (newest, oldest, price high/low)
- Pagination for large result sets

### 💬 Property Inquiries
- Users can submit inquiries about properties
- Inquiry management system for agents
- Status tracking (Pending, Contacted, Closed)
- Inquiry statistics dashboard
- Email notifications for new inquiries

### 📊 Dashboard Features
- **User Dashboard**: View favorite properties and inquiry history
- **Agent Dashboard**: 
  - Manage property listings
  - View and respond to inquiries
  - Property statistics and analytics
  - Quick actions for property management
- **Admin Dashboard**: 
  - Full platform oversight
  - User management
  - System-wide statistics

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Modern glassmorphism effects
- Smooth animations and transitions
- Interactive property cards
- Image carousels
- Loading skeletons
- Toast notifications

### ⭐ Additional Features
- Favorites/Saved properties system
- Property comparison
- Featured properties highlighting
- Recent activity tracking
- User profile management
- Email integration with Nodemailer

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **Image Upload**: Cloudinary
- **Validation**: Zod

### Development Tools
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Code Formatting**: Prettier (via ESLint config)
- **CSS Processing**: PostCSS, Autoprefixer

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (for image uploads)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd horizon-homes
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/horizon-homes
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/horizon-homes?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### 4. Start MongoDB
If using local MongoDB:
```bash
mongod
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 6. Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
horizon-homes/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/             # Protected dashboard routes
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   ├── my-properties/       # Agent property management
│   │   │   └── favorites/           # User favorites
│   │   ├── api/                     # API Routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── logout/
│   │   │   │   └── check-user/
│   │   │   ├── properties/         # Property CRUD operations
│   │   │   │   ├── [id]/
│   │   │   │   ├── my/
│   │   │   │   └── route.ts
│   │   │   ├── inquiries/          # Inquiry management
│   │   │   │   ├── [id]/
│   │   │   │   ├── stats/
│   │   │   │   └── route.ts
│   │   │   ├── favorites/          # Favorites management
│   │   │   └── users/              # User management
│   │   ├── properties/             # Public property pages
│   │   │   ├── [propertyId]/
│   │   │   └── page.tsx
│   │   ├── page.tsx                # Homepage
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/                  # React Components
│   │   ├── auth/                   # Auth-related components
│   │   ├── dashboard/              # Dashboard components
│   │   ├── layout/                 # Layout components (Header, Footer)
│   │   ├── properties/             # Property components
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   └── InquiryForm.tsx
│   │   └── common/                 # Reusable UI components
│   ├── lib/                         # Core Utilities
│   │   ├── mongodb/                # Database layer
│   │   │   ├── db.ts              # MongoDB connection
│   │   │   ├── mongoose.ts        # Mongoose setup
│   │   │   └── models/            # Mongoose models
│   │   │       ├── User.ts
│   │   │       ├── Property.ts
│   │   │       ├── Inquiry.ts
│   │   │       └── Favorite.ts
│   │   ├── auth/                   # Authentication utilities
│   │   │   ├── session.ts         # JWT handling
│   │   │   └── middleware.ts      # Auth middleware
│   │   ├── cloudinary/            # Cloudinary integration
│   │   └── utils/                 # Helper functions
│   │       └── constants.ts       # App constants
│   └── types/                      # TypeScript Definitions
│       ├── property.ts
│       ├── user.ts
│       ├── inquiry.ts
│       └── index.ts
├── public/                         # Static Assets
│   └── images/
├── .env.local                      # Environment variables (create this)
├── .env.example                    # Environment template
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/check-user` | Verify authentication | Yes |

### Properties
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/properties` | Get all properties (with filters) | No | - |
| POST | `/api/properties` | Create property | Yes | Agent/Admin |
| GET | `/api/properties/[id]` | Get single property | No | - |
| PUT | `/api/properties/[id]` | Update property | Yes | Agent/Admin |
| DELETE | `/api/properties/[id]` | Delete property | Yes | Agent/Admin |
| GET | `/api/properties/my` | Get agent's properties | Yes | Agent/Admin |

### Inquiries
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/inquiries` | Get inquiries | Yes | Agent/Admin |
| POST | `/api/inquiries` | Create inquiry | Optional | - |
| GET | `/api/inquiries/[id]` | Get single inquiry | Yes | Agent/Admin |
| PUT | `/api/inquiries/[id]` | Update inquiry status | Yes | Agent/Admin |
| DELETE | `/api/inquiries/[id]` | Delete inquiry | Yes | Agent/Admin |
| GET | `/api/inquiries/stats` | Get inquiry statistics | Yes | Agent/Admin |

### Favorites
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/favorites` | Get user's favorites | Yes |
| POST | `/api/favorites` | Add to favorites | Yes |
| DELETE | `/api/favorites/[id]` | Remove from favorites | Yes |

### Users
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | Get all users | Yes | Admin |
| GET | `/api/users/[id]` | Get user by ID | Yes | Admin |
| PUT | `/api/users/[id]` | Update user | Yes | Owner/Admin |

## 🧪 API Testing Examples

### Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "agent"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Property (Authenticated)
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=YOUR_JWT_TOKEN" \
  -d '{
    "title": "Luxury Downtown Apartment",
    "description": "Modern 2-bedroom apartment in the heart of downtown",
    "type": "apartment",
    "status": "for-sale",
    "condition": "excellent",
    "price": 450000,
    "location": {
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "features": {
      "bedrooms": 2,
      "bathrooms": 2,
      "squareFeet": 1200,
      "parking": 1,
      "garage": true
    },
    "images": ["https://res.cloudinary.com/..."],
    "amenities": ["Pool", "Gym", "Concierge", "Rooftop Terrace"]
  }'
```

### Search Properties
```bash
# Search with filters
curl "http://localhost:3000/api/properties?type=apartment&status=for-sale&minPrice=300000&maxPrice=500000&bedrooms=2&city=New York&sort=-createdAt&page=1&limit=12"
```

## 🎯 User Roles & Permissions

### 👤 User (Default)
- Browse and search properties
- View property details
- Submit inquiries
- Save favorite properties
- Manage own profile

### 🏢 Agent
- All User permissions
- Create and manage property listings
- View and respond to inquiries
- Access agent dashboard
- View property statistics

### 👑 Admin
- All Agent permissions
- Manage all users
- Manage all properties
- Access system-wide statistics
- Full platform control

## 🔒 Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **JWT Authentication**: Secure token-based auth with HTTP-only cookies
- **Role-Based Access Control**: Granular permissions system
- **Input Validation**: Zod schema validation on all inputs
- **Protected Routes**: Middleware-based route protection
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token validation
- **Environment Variables**: Sensitive data protection

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   Add all variables from `.env.local` to Vercel:
   - Go to Project Settings → Environment Variables
   - Add each variable individually

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### MongoDB Atlas Setup

1. **Create Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Choose free tier for development
3. **Configure Access**:
   - Add database user
   - Whitelist IP addresses (0.0.0.0/0 for development)
4. **Get Connection String**: 
   ```
   mongodb+srv://username:password@cluster.mongodb.net/horizon-homes
   ```
5. **Update Environment**: Add to Vercel environment variables

### Cloudinary Setup

1. **Create Account**: Sign up at [Cloudinary](https://cloudinary.com)
2. **Get Credentials**: From dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. **Add to Environment**: Update `.env.local` and Vercel

## 🛠️ Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📊 Database Models

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'agent' | 'admin'
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
```

### Property Model
```typescript
{
  title: string
  description: string
  type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'land' | 'commercial'
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented'
  condition: 'excellent' | 'good' | 'fair' | 'needs-work'
  price: number
  location: {
    address: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  features: {
    bedrooms: number
    bathrooms: number
    squareFeet: number
    parking?: number
    garage?: boolean
  }
  images: string[]
  amenities: string[]
  agentId: ObjectId (ref: User)
  featured: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Inquiry Model
```typescript
{
  property: ObjectId (ref: Property)
  name: string
  email: string
  phone?: string
  message: string
  status: 'pending' | 'contacted' | 'closed'
  userId?: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 Customization

### Tailwind Configuration
Modify `tailwind.config.ts` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints
- Animations

### Constants
Update `src/lib/utils/constants.ts` for:
- Property types
- Property statuses
- Amenities list
- Sort options
- Bedroom/bathroom options

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Test connection
mongosh "mongodb://localhost:27017"
```

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Environment Variables Not Loading
- Ensure `.env.local` is in root directory
- Restart development server after changes
- Check for typos in variable names

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- Vercel for hosting platform
- Cloudinary for image management

---

**Horizon Homes** - Find Your Dream Property 🏡
