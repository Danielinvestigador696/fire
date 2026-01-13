import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL da API - Hostinger
// Para desenvolvimento, pode usar a mesma URL da Hostinger
// Ou configurar via .env: EXPO_PUBLIC_API_URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fire.dgapp.com.br/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para adicionar token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log de erro para debug
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('Erro de rede:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    }

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@auth_token');
      // Redirecionar para login se necessário
    }
    // Erros de assinatura são tratados nas telas específicas
    // Não redirecionar automaticamente aqui
    return Promise.reject(error);
  }
);
