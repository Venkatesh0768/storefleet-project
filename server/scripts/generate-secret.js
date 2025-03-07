const crypto = require('crypto');

// Generate a secure random string for JWT secret
const generateSecret = () => {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('\nGenerated JWT Secret:');
  console.log('====================');
  console.log(secret);
  console.log('\nAdd this to your .env file as:');
  console.log('JWT_SECRET=' + secret);
  console.log('====================\n');
};

generateSecret(); 