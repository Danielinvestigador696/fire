import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { api } from '@/app/services/api';
import { useRouter } from 'expo-router';

interface SubscriptionStatus {
  status: string;
  tipo: string;
  ativa: boolean;
  diasRestantes: number | null;
}

export function SubscriptionBanner() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await api.get('/assinaturas/status');
      setStatus(response.data);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !status) {
    return null;
  }

  // Não mostrar se for admin ou se estiver pago e ativo
  if (status.tipo === 'PAGO' && status.ativa) {
    return null;
  }

  // Se trial está próximo de expirar (3 dias ou menos)
  if (status.tipo === 'TRIAL' && status.diasRestantes !== null && status.diasRestantes <= 3) {
    return (
      <View style={[styles.banner, status.diasRestantes === 0 && styles.bannerExpired]}>
        <Text style={styles.bannerText}>
          {status.diasRestantes === 0
            ? '⚠️ Seu trial expirou! Entre em contato para liberar seu acesso.'
            : `⚠️ Seu trial expira em ${status.diasRestantes} ${status.diasRestantes === 1 ? 'dia' : 'dias'}. Entre em contato para continuar usando.`}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/assinatura')}
        >
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Se trial está ativo, mostrar contador
  if (status.tipo === 'TRIAL' && status.ativa && status.diasRestantes !== null) {
    return (
      <View style={styles.bannerInfo}>
        <Text style={styles.bannerTextInfo}>
          Trial: {status.diasRestantes} {status.diasRestantes === 1 ? 'dia' : 'dias'} restantes
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF9500',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerExpired: {
    backgroundColor: '#FF3B30',
  },
  bannerInfo: {
    backgroundColor: '#007AFF',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  bannerTextInfo: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '600',
  },
});
