# E-commerce Backend Server

## Environment Variables Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory and add the following variables:

### Required Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Optional Environment Variables (Based on Features)

```env
# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Email Configuration (Required for email features)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Security
BCRYPT_SALT_ROUNDS=12
```

### Environment Variables Description

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Application environment | development | Yes |
| PORT | Server port number | 5000 | Yes |
| MONGODB_URI | MongoDB connection string | - | Yes |
| JWT_SECRET | Secret key for JWT tokens | - | Yes |
| JWT_EXPIRES_IN | JWT token expiration time | 7d | Yes |
| JWT_COOKIE_EXPIRES_IN | JWT cookie expiration in days | 7 | Yes |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 | Yes |
| STRIPE_SECRET_KEY | Stripe API secret key | - | No |
| STRIPE_WEBHOOK_SECRET | Stripe webhook secret | - | No |
| EMAIL_HOST | SMTP server host | - | No |
| EMAIL_PORT | SMTP server port | - | No |
| EMAIL_USERNAME | SMTP server username | - | No |
| EMAIL_PASSWORD | SMTP server password | - | No |
| MAX_FILE_SIZE | Maximum file upload size in bytes | 5MB | No |
| UPLOAD_PATH | File upload directory | uploads | No |
| RATE_LIMIT_WINDOW | Rate limiting time window in minutes | 15 | No |
| RATE_LIMIT_MAX | Maximum requests per window | 100 | No |
| BCRYPT_SALT_ROUNDS | Number of salt rounds for password hashing | 12 | No |

### Security Notes

1. Never commit your `.env` file to version control
2. Generate a strong JWT secret using a secure method
3. Use strong passwords for all credentials
4. Keep your environment variables secure and don't share them
5. Regularly rotate secrets and credentials

### Generating Secure JWT Secret

You can generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Setting Up Development Environment

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the values in `.env` with your configuration

3. Make sure to set proper values for all required variables before starting the server 