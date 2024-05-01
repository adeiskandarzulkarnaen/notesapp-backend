/* istanbul ignore file */
const mysql = require('mysql2');

const prodConfig = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  database: process.env.DBNAME,
  password: process.env.DBPASS,
  port: process.env.DBPORT,
  debug: false,
};

const pool = mysql.createPool(prodConfig);
module.exports = pool.promise();
