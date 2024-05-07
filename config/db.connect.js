const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: "u318670773_sergio_916",
});

async function createDBTable() {
  const createSQLTable = `CREATE TABLE IF NOT EXISTS books(
       id INT AUTO_INCREMENT PRIMARY KEY,
       book_id VARCHAR(100) NOT NULL,
       title VARCHAR(100) NOT NULL,
       author VARCHAR(100),
       description TEXT,
       image_url VARCHAR(100),
       page_count VARCHAR(100),
       main_category VARCHAR(100),
       language VARCHAR(100),
       publish_year VARCHAR(100),
       categories VARCHAR(100)
       )`;

       
  const connection = await pool.getConnection();
  try {
    await connection.query(createSQLTable);
    console.log("Table created successfully.");
  } catch (err) {
    console.error("Failed to create table:", err);
  } finally {
    connection.release();
  }
}

module.exports = { pool, createDBTable };
