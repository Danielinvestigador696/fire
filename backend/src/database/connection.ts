import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export const database = {
  get pool() {
    return pool;
  },
  async connect() {
    console.log('Iniciando conexão com banco de dados...');
    console.log('Vars de ambiente no momento da conexão:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);

    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

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
