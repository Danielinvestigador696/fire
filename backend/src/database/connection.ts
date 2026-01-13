import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('Tentando conectar ao banco de dados...');
console.log('DB_HOST definido:', !!process.env.DB_HOST, process.env.DB_HOST);
console.log('DB_USER definido:', !!process.env.DB_USER, process.env.DB_USER);
console.log('DB_NAME definido:', !!process.env.DB_NAME, process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const database = {
  pool,
  async connect() {
    try {
      const connection = await pool.getConnection();
      console.log('Conectado ao MySQL');
      connection.release();
      return true;
    } catch (error) {
      console.error('Erro ao conectar ao MySQL:', error);
      throw error;
    }
  },
  async query(sql: string, params?: any[]) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Erro na query:', error);
      throw error;
    }
  },
};
