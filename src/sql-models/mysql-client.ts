import mysql from "mysql2/promise";

// Update these values as needed for your MySQL setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // url or IP address of the MySQL server
  port: Number(process.env.DB_PORT) || 3306, // port number of the MySQL server
  user: process.env.DB_USER || "root", // username for the MySQL server
  password: process.env.DB_PASSWORD || "password", // password for the MySQL server
  database: process.env.DB_NAME || "ecom_app", // name of the database to connect to
  connectionLimit: 10, // maximum number of connections to create at once
  waitForConnections: true, // wait for a connection to be available if all are in use
  queueLimit: 0, // maximum number of connection requests to queue before returning an error
});

export default pool;
