const mysql = require('mysql2');
require('dotenv').config();

let dbConfig;

switch (process.env.NODE_ENV) {
  case 'production':
    dbConfig = {
      host: process.env.DB_HOST_PROD,
      user: process.env.DB_USERNAME_PROD,
      password: process.env.DB_PASSWORD_PROD,
      database: process.env.DB_NAME_PROD,
    };
    break;
  case 'empresa':
    dbConfig = {
      host: process.env.DB_HOST_EMPRESA,
      user: process.env.DB_USERNAME_EMPRESA,
      password: process.env.DB_PASSWORD_EMPRESA,
      database: process.env.DB_NAME_EMPRESA,
    };
    break;
  case 'test':
    dbConfig = {
      host: process.env.DB_HOST_TEST,
      user: process.env.DB_USERNAME_TEST,
      password: process.env.DB_PASSWORD_TEST,
      database: process.env.DB_NAME_TEST,
    };
    break;
  default:
    dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    break;
}

const connection = mysql.createConnection(dbConfig);

const connectToDatabase = () => {
  connection.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos: ', err);
      setTimeout(connectToDatabase, 5000);
    } else {
      console.log(`Conectado a la base de datos en entorno ${process.env.NODE_ENV}`);
    }
  });
};

connectToDatabase();

module.exports = connection;
