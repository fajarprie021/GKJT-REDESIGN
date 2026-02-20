import mysql from 'mysql2/promise';

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nextjs_demo',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool for use in API routes
export default pool;

// Helper function to execute queries
export async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Failed SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Helper function to get a single row
export async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

// Helper function to insert and get the inserted ID
export async function insert(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result.insertId;
}

// Helper function to test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
