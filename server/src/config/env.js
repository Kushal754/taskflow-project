
require('dotenv').config();


module.exports = {
  port: process.env.PORT || 3000 // Si no hay puerto en .env, usa el 3000 por defecto
};