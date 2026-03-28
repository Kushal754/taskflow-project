require('dotenv').config();

if (!process.env.PORT) {
  throw new Error('❌ CRITICAL: The PORT is not defined in the .env file');
}

module.exports = {
  port: process.env.PORT
};