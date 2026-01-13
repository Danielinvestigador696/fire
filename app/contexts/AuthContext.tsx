import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/app/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface SubscriptionStatus {
  status: string;
  tipo: string;
  ativa: boolean;
  diasRestantes: number | null;
}

interface AuthContextType {
  user: User | null;
  subscription: SubscriptionStatus | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      }
    } catch (error) {
      await AsyncStorage.removeItem('@auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('@auth_token', response.data.token);
    setUser(response.data.user);
    if (response.data.assinatura) {
      setSubscription(response.data.assinatura);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    await AsyncStorage.setItem('@auth_token', response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    setUser(null);
    setSubscription(null);
  };

  const loginWithGoogle = async () => {
    // Implementar OAuth Google
    throw new Error('Google OAuth não implementado ainda');
  };

  const loginWithFacebook = async () => {
    // Implementar OAuth Facebook
    throw new Error('Facebook OAuth não implementado ainda');
  };

  const resetPassword = async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
