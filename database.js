const mysql = require("mysql2");

const connection = mysql
  .createPool({
    host: process.env.HOST,
    database: process.env.DB,
    user: process.env.USER,
    password: process.env.PASSWORD,
  })
  .promise();

module.exports = connection;
