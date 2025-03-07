const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Required environment variables with their descriptions
const requiredEnvVars = {
  NODE_ENV: 'Application environment (development, production, or test)',
  PORT: 'Server port number',
  MONGODB_URI: 'MongoDB connection string',
  JWT_SECRET: 'Secret key for JWT tokens',
  JWT_EXPIRES_IN: 'JWT token expiration time (e.g., "7d", "24h")',
  JWT_COOKIE_EXPIRES_IN: 'JWT cookie expiration in days',
  CORS_ORIGIN: 'Allowed CORS origin (e.g., http://localhost:3000)'
};

// Optional environment variables with their descriptions
const optionalEnvVars = {
  BCRYPT_SALT_ROUNDS: 'Number of salt rounds for password hashing (default: 12)',
  MAX_FILE_SIZE: 'Maximum file upload size in bytes (default: 5MB)',
  UPLOAD_PATH: 'File upload directory (default: uploads)',
  RATE_LIMIT_WINDOW: 'Rate limiting time window in minutes (default: 15)',
  RATE_LIMIT_MAX: 'Maximum requests per window (default: 100)',
  COOKIE_SECRET: 'Secret for signing cookies'
};

console.log('\nValidating environment variables...');
console.log('==================================');

// Check required variables
const missingVars = [];
const invalidVars = [];

Object.entries(requiredEnvVars).forEach(([key, description]) => {
  if (!process.env[key]) {
    missingVars.push({ key, description });
  } else {
    // Validate specific variables
    switch (key) {
      case 'NODE_ENV':
        if (!['development', 'production', 'test'].includes(process.env[key])) {
          invalidVars.push({ key, value: process.env[key], expected: 'development, production, or test' });
        }
        break;
      case 'PORT':
        if (isNaN(process.env[key])) {
          invalidVars.push({ key, value: process.env[key], expected: 'a number' });
        }
        break;
      case 'JWT_EXPIRES_IN':
        if (!process.env[key].match(/^\d+[hdwmy]$/)) {
          invalidVars.push({ key, value: process.env[key], expected: 'format like 7d, 24h, 30d, etc.' });
        }
        break;
      case 'JWT_COOKIE_EXPIRES_IN':
        if (isNaN(process.env[key])) {
          invalidVars.push({ key, value: process.env[key], expected: 'a number' });
        }
        break;
    }
  }
});

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(({ key, description }) => {
    console.error(`   - ${key}: ${description}`);
  });
}

if (invalidVars.length > 0) {
  console.error('\n❌ Invalid environment variables:');
  invalidVars.forEach(({ key, value, expected }) => {
    console.error(`   - ${key}: "${value}" is invalid. Expected ${expected}`);
  });
}

// Check optional variables
const missingOptionalVars = Object.entries(optionalEnvVars)
  .filter(([key]) => !process.env[key])
  .map(([key, description]) => ({ key, description }));

if (missingOptionalVars.length > 0) {
  console.warn('\n⚠️  Missing optional environment variables (using defaults):');
  missingOptionalVars.forEach(({ key, description }) => {
    console.warn(`   - ${key}: ${description}`);
  });
}

// Exit if there are missing or invalid required variables
if (missingVars.length > 0 || invalidVars.length > 0) {
  process.exit(1);
}

// Success message
console.log('\n✅ All required environment variables are set correctly');
console.log('==================================\n');

// Print current configuration (excluding sensitive data)
console.log('Current Configuration:');
console.log('--------------------');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
console.log('JWT_COOKIE_EXPIRES_IN:', process.env.JWT_COOKIE_EXPIRES_IN, 'days');
console.log('--------------------\n'); 