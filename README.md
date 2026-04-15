# 🛍️ Huggle Mart - Complete E-Commerce Application

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring AI-powered bargaining system.

## 🚀 Features

### 🛒 E-Commerce Core Features
- **Product Management**: Full CRUD operations for products with categories, variants, and inventory
- **Shopping Cart**: Add, update, remove items with real-time cart management
- **User Authentication**: Secure JWT-based login/signup with email verification
- **Order Management**: Complete order lifecycle from placement to delivery tracking
- **Payment Integration**: Stripe integration (test mode) for secure payments
- **Address Management**: Multiple shipping addresses with default selection

### 🤖 AI Bargaining System (Unique Feature)
- **Smart Negotiation**: AI-powered price negotiation for better deals
- **Real-time Chat**: Interactive bargaining interface with AI responses
- **Bargaining History**: Track all past negotiations and outcomes
- **Dynamic Pricing**: AI calculates optimal discounts based on product and user behavior

### 📱 Responsive Design
- **Mobile-First**: Fully responsive design for all devices
- **Modern UI**: Material-UI components with clean, professional interface
- **Intuitive Navigation**: Easy-to-use navigation with search and filtering

### 👨‍💼 Admin Dashboard
- **Product Management**: Add, edit, delete products with bulk operations
- **Order Management**: View, update, and manage all customer orders
- **User Management**: Manage customer accounts and permissions
- **Analytics Dashboard**: Sales statistics, revenue tracking, and insights
- **Bargaining Analytics**: Monitor AI bargaining sessions and success rates

### 🔔 Additional Features
- **Email Notifications**: Order confirmations, status updates, and marketing emails
- **Wishlist**: Save favorite products for later purchase
- **Product Reviews**: Customer ratings and feedback system
- **Search & Filtering**: Advanced product search with multiple filter options
- **Order Tracking**: Real-time order status updates with tracking numbers

## 🛠️ Tech Stack

### Backend (Node.js + Express.js)
- **Node.js**: Server runtime environment
- **Express.js**: Web framework for RESTful APIs
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing for security
- **Nodemailer**: Email service integration
- **Stripe**: Payment processing (test mode)
- **OpenAI API**: AI integration for bargaining system

### Frontend (React.js + TypeScript)
- **React.js**: Modern UI library with hooks
- **TypeScript**: Type-safe development
- **Material-UI**: Professional UI component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Context API**: State management for auth and cart

### Database (MongoDB)
- **Collections**: Users, Products, Categories, Orders, Cart, AIBargaining
- **Relationships**: Proper schema design with references
- **Indexes**: Optimized queries for performance

## 📁 Project Structure

```
hugglemart/
├── backend/                    # Node.js + Express.js backend
│   ├── controllers/            # API route handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   └── aiBargainingController.js
│   ├── models/                # MongoDB/Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── AIBargaining.js
│   ├── routes/                # API route definitions
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   ├── aiBargaining.js
│   │   └── payment.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/                 # Utility functions
│   │   ├── emailService.js
│   │   └── aiBargainingService.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example           # Environment variables template
├── frontend/                   # React.js + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── Layout/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── pages/             # Page components
│   │   │   └── Home.tsx
│   │   ├── context/           # React context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── services/          # API service functions
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── orderService.ts
│   │   │   └── aiBargainingService.ts
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/            # Helper functions
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   └── App.tsx           # Main App component
│   ├── package.json
│   └── .env.example           # Environment variables template
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd hugglemart
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

### Environment Setup

1. **Backend Environment**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hugglemart
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   AI_API_KEY=your_ai_api_key
   ```

2. **Frontend Environment**:
   ```bash
   cd frontend
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

### Running the Application

1. **Start MongoDB**:
   ```bash
   mongod
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**:
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password

### Product Endpoints
- `GET /api/products` - Get all products with filters
- `GET /api/products/:slug` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-sellers` - Get best sellers
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### AI Bargaining Endpoints
- `POST /api/ai-bargaining/start` - Start bargaining session
- `POST /api/ai-bargaining/:id/message` - Send bargaining message
- `GET /api/ai-bargaining/:id` - Get bargaining session
- `GET /api/ai-bargaining/history` - Get bargaining history

## 🔧 Configuration

### Database Schema
- **Users**: Authentication, profile, addresses, wishlist
- **Products**: Catalog with variants, pricing, inventory
- **Categories**: Hierarchical category structure
- **Orders**: Complete order lifecycle with items and status
- **Cart**: User shopping carts with items
- **AIBargaining**: AI negotiation sessions and conversations

### Security Features
- JWT-based authentication with secure token handling
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Rate limiting (recommended for production)

### Performance Optimizations
- Database indexing for common queries
- Image optimization and lazy loading
- Pagination for large datasets
- Caching strategies (implement as needed)

## 🎯 Key Features Explained

### AI Bargaining System
The AI bargaining system allows users to negotiate prices with an AI assistant:

1. **Initiation**: User starts bargaining on any product
2. **Conversation**: Real-time chat with AI for price negotiation
3. **AI Logic**: AI analyzes product value, user behavior, and market data
4. **Dynamic Pricing**: AI generates counter-offers within predefined limits
5. **Completion**: Both parties agree on final price
6. **Integration**: Bargained price applied to cart/checkout

### Order Management
- **Status Tracking**: Pending → Confirmed → Processing → Shipped → Delivered
- **Email Notifications**: Automatic emails for status changes
- **Payment Processing**: Stripe integration with secure handling
- **Inventory Management**: Automatic stock updates on order completion

## 🚀 Deployment

### Production Deployment
1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Build Frontend**: `npm run build` in frontend directory
4. **Start Backend**: `npm start` in backend directory
5. **Serve Static Files**: Configure web server to serve frontend build

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@hugglemart.com
- GitHub Issues: [Create an issue](repository-url/issues)
- Documentation: [View full docs](repository-url/docs)

## 🎉 Acknowledgments

- React.js team for the amazing framework
- Material-UI for the beautiful component library
- MongoDB for the flexible database solution
- Stripe for secure payment processing
- OpenAI for the powerful AI capabilities

---

**Happy Shopping with Huggle Mart! 🛍️**
