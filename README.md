# StoringFleet E-commerce Platform

A modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

[StoringFleet Homepage](/ecommerce_app/client/public/screenshot.png)

## Features

- 🛍️ Product browsing with search and filters
- 🔍 Advanced sorting and filtering options
- 🛒 Shopping cart functionality
- 👤 User authentication (Buyer/Seller roles)
- 💳 Secure payment processing
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend:**
  - React.js
  - Material-UI
  - React Router
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/storingfleet.git
cd storingfleet
```

2. Install backend dependencies:
```bash
cd ecommerce_app/server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/storingfleet
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
CORS_ORIGIN=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
```

## Running the Application

1. Start the MongoDB server:
```bash
mongod
```

2. Start the backend server (in ecommerce_app/server directory):
```bash
npm start
```

3. Start the frontend development server (in ecommerce_app/client directory):
```bash
npm start
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Usage

1. Register as either a buyer or seller
2. Browse products using the search and filter options
3. Add items to cart (buyers)
4. Manage products (sellers)
5. Process orders and track shipments

## Project Structure

```
ecommerce_app/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # React components
│       ├── services/      # API services
│       └── data/          # Static data
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    └── middleware/       # Custom middleware
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### Products
- GET /api/products - Get all products
- POST /api/products - Create new product (seller only)
- PUT /api/products/:id - Update product (seller only)
- DELETE /api/products/:id - Delete product (seller only)

### Orders
- GET /api/orders - Get user orders
- POST /api/orders - Create new order
- GET /api/orders/:id - Get order details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@storingfleet.com or create an issue in this repository. 
