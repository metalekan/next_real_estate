# Real Estate Full Stack App

A modern real estate application built with Next.js 14, TypeScript, and MongoDB. This application allows users to browse properties, agents to manage listings, and administrators to oversee the platform.

## 🚀 Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Property Management**: Create, read, update, and delete property listings
- **Advanced Search**: Filter properties by type, price, location, bedrooms, bathrooms, and more
- **Role-Based Access Control**: Different permissions for users, agents, and admins
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Image Upload**: Support for multiple property images
- **Property Inquiries**: Users can inquire about properties
- **Featured Properties**: Highlight special listings

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd real-estate-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/real-estate-app
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate-app

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # App URL
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
real-estate-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── properties/    # Property endpoints
│   │   │   └── users/         # User endpoints
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   └── properties/        # Public property pages
│   ├── components/            # React components
│   │   ├── common/           # Reusable UI components
│   │   ├── properties/       # Property-specific components
│   │   ├── auth/             # Authentication components
│   │   └── dashboard/        # Dashboard components
│   ├── lib/                   # Core utilities
│   │   ├── mongodb/          # Database models and connection
│   │   ├── auth/             # Authentication utilities
│   │   └── utils/            # Helper functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `POST /api/properties` - Create property (requires auth)
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property (requires auth)
- `DELETE /api/properties/[id]` - Delete property (requires auth)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user (requires auth)

## 🧪 Testing the API

You can test the API using tools like Postman or curl:

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "agent"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Property (requires authentication)
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Beautiful Family Home",
    "description": "A stunning property in a great location",
    "type": "house",
    "status": "for-sale",
    "condition": "excellent",
    "price": 500000,
    "location": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "features": {
      "bedrooms": 4,
      "bathrooms": 3,
      "squareFeet": 2500,
      "parking": 2,
      "garage": true
    },
    "images": ["https://example.com/image1.jpg"],
    "amenities": ["Pool", "Garden", "Gym"]
  }'
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Icons**: Lucide React

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/real-estate-app` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | `your-nextauth-secret` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000/api` |

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your environment variables

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 User Roles

- **User**: Can browse properties and make inquiries
- **Agent**: Can create, edit, and manage their own property listings
- **Admin**: Full access to all features and user management

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation with Zod
- Protected API routes

## 📱 Features Coming Soon

- [ ] Image upload to cloud storage (Cloudinary)
- [ ] Email notifications
- [ ] Property comparison
- [ ] Saved properties/favorites
- [ ] Advanced analytics dashboard
- [ ] Payment integration
- [ ] Property tours scheduling
- [ ] Live chat support

## 💡 Tips

- Use MongoDB Atlas for production
- Keep your JWT_SECRET secure
- Regularly backup your database
- Use environment variables for all sensitive data
- Enable MongoDB indexes for better performance

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and MongoDB


