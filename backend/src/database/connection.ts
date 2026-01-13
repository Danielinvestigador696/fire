import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export const database = {
  get pool() {
    return pool;
  },
  async connect() {
    console.log('----------------------------------------');
    console.log('🔍 DEBUG CONEXÃO BANCO DE DADOS');
    console.log('----------------------------------------');

    // Debug detalhado das variáveis
    const vars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'DB_PASSWORD'];
    vars.forEach(v => {
      const val = process.env[v];
      console.log(`${v}:`, val ? `Presente (${val.length} chars)` : 'NÃO DEFINIDO/VAZIO');
      if (v !== 'DB_PASSWORD' && val) console.log(`   Valor: "${val}"`);
    });
    console.log('----------------------------------------');

    if (!pool) {
      if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
        console.error('❌ ERRO CRÍTICO: Variáveis de ambiente obrigatórias não encontradas!');
      }

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

    try {
      const connection = await pool.getConnection();
      console.log('✅ Conectado ao MySQL com sucesso!');
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar ao MySQL:', error);
      throw error;
    }
  },
  async query(sql: string, params?: any[]) {
    // Auto-connect se o pool ainda não existir
    if (!pool) {
      console.log('⚠️ Pool não inicializado na query, tentando conectar...');
      await this.connect();
    }

    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error: any) {
      // Se for erro de conexão fechada, tenta reconectar uma vez
      if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
        console.log('⚠️ Conexão perdida, tentando reconectar...');
        await this.connect();
        const [results] = await pool.execute(sql, params);
        return results;
      }
      console.error('Erro na query:', error);
      throw error;
    }
  },
};
