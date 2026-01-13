import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { api } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { SubscriptionBanner } from '@/app/components/SubscriptionBanner';
import { BlockedScreen } from '@/app/components/BlockedScreen';

interface SubscriptionStatus {
  status: string;
  tipo: string;
  ativa: boolean;
  diasRestantes: number | null;
  dataInicio: string;
  dataFim: string | null;
}

export default function AssinaturaScreen() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await api.get('/assinaturas/status');
      setStatus(response.data);
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
        // Usuário não tem assinatura
        setStatus({
          status: 'SEM_ASSINATURA',
          tipo: 'NONE',
          ativa: false,
          diasRestantes: 0,
          dataInicio: '',
          dataFim: null,
        });
      } else {
        Alert.alert('Erro', error.message || 'Erro ao carregar status');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarLiberacao = async () => {
    Alert.alert(
      'Solicitar Liberação',
      'Deseja solicitar a liberação do seu acesso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Solicitar',
          onPress: async () => {
            try {
              // Aqui você pode implementar uma chamada para notificar o admin
              Alert.alert(
                'Solicitação Enviada',
                'Sua solicitação foi enviada. O administrador entrará em contato em breve.'
              );
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao enviar solicitação');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  // Se não tem assinatura ativa, mostrar tela de bloqueio
  if (!status || (!status.ativa && status.status !== 'SEM_ASSINATURA')) {
    return <BlockedScreen />;
  }

  const getStatusColor = () => {
    if (status.tipo === 'PAGO' && status.ativa) return '#34C759';
    if (status.tipo === 'TRIAL' && status.ativa) {
      if (status.diasRestantes !== null && status.diasRestantes <= 3) return '#FF9500';
      return '#007AFF';
    }
    return '#FF3B30';
  };

  const getStatusText = () => {
    if (status.tipo === 'PAGO' && status.ativa) return 'Assinatura Paga Ativa';
    if (status.tipo === 'TRIAL' && status.ativa) return 'Trial Ativo';
    return 'Sem Assinatura';
  };

  return (
    <ScrollView style={styles.container}>
      <SubscriptionBanner />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status da Assinatura</Text>

        <View style={styles.statusRow}>
          <Text style={styles.label}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        {status.tipo === 'TRIAL' && status.diasRestantes !== null && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dias Restantes:</Text>
            <Text style={styles.value}>{status.diasRestantes} dias</Text>
          </View>
        )}

        {status.dataInicio && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Início:</Text>
            <Text style={styles.value}>
              {new Date(status.dataInicio).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}

        {status.dataFim && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data de Término:</Text>
            <Text style={styles.value}>
              {new Date(status.dataFim).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}

        {status.tipo === 'TRIAL' && status.diasRestantes !== null && status.diasRestantes <= 3 && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSolicitarLiberacao}
          >
            <Text style={styles.buttonText}>Solicitar Liberação</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          • Todos os novos usuários recebem 15 dias de trial gratuito{'\n'}
          • Após o trial, é necessário liberação manual pelo administrador{'\n'}
          • Entre em contato para solicitar a liberação do seu acesso
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 15,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    margin: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});
