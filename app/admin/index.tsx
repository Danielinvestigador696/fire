import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { testConnection } from '@/app/utils/debug';

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  assinatura: {
    id: number;
    status: string;
    tipo: string;
    dataFim: string | null;
    diasRestantes: number | null;
  } | null;
}

export default function AdminScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [estatisticas, setEstatisticas] = useState<any>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      Alert.alert('Acesso Negado', 'Apenas administradores podem acessar esta área.');
      router.back();
      return;
    }
    
    // Testar conexão primeiro
    testConnection().then((connected) => {
      if (connected) {
        loadData();
      } else {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar com o servidor. Verifique se o backend está rodando e a URL da API está correta.',
          [
            {
              text: 'Tentar Novamente',
              onPress: () => loadData(),
            },
          ]
        );
      }
    });
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosRes, statsRes] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/admin/estatisticas'),
      ]);
      setUsuarios(usuariosRes.data.usuarios);
      setEstatisticas(statsRes.data.estatisticas);
    } catch (error: any) {
      console.error('Erro ao carregar dados admin:', error);
      
      let errorMessage = 'Erro ao carregar dados.';
      
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
        errorMessage = 'Não foi possível conectar com o servidor.\n\nVerifique:\n1. Backend está rodando?\n2. URL da API está correta?\n3. Para dispositivo físico, use o IP da máquina, não localhost';
      } else if (error.response?.status === 403) {
        errorMessage = error.response.data?.error || 'Acesso negado. Verifique se você é admin.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Não autenticado. Faça login novamente.';
      } else {
        errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLiberar = async (userId: number) => {
    Alert.alert(
      'Liberar Usuário',
      'Deseja liberar o acesso deste usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Liberar',
          onPress: async () => {
            try {
              await api.post(`/admin/usuarios/${userId}/liberar`, {});
              Alert.alert('Sucesso', 'Usuário liberado com sucesso!');
              loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao liberar usuário');
            }
          },
        },
      ]
    );
  };

  const handleCancelar = async (userId: number) => {
    Alert.alert(
      'Cancelar Assinatura',
      'Deseja cancelar a assinatura deste usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.post(`/admin/usuarios/${userId}/cancelar`, {});
              Alert.alert('Sucesso', 'Assinatura cancelada com sucesso!');
              loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao cancelar assinatura');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    if (status === 'ATIVA') return '#34C759';
    if (status === 'EXPIRADA') return '#FF3B30';
    return '#FF9500';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {estatisticas && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Estatísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{estatisticas.total_usuarios}</Text>
              <Text style={styles.statLabel}>Usuários</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{estatisticas.trial_ativos}</Text>
              <Text style={styles.statLabel}>Trials Ativos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{estatisticas.pagos_ativos}</Text>
              <Text style={styles.statLabel}>Pagos Ativos</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Usuários</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardEmail}>{item.email}</Text>
                {item.role === 'admin' && (
                  <Text style={styles.adminBadge}>ADMIN</Text>
                )}
              </View>
              {item.assinatura && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.assinatura.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.assinatura.status}</Text>
                </View>
              )}
            </View>

            {item.assinatura && (
              <View style={styles.assinaturaInfo}>
                <Text style={styles.infoText}>
                  Tipo: {item.assinatura.tipo}
                  {item.assinatura.diasRestantes !== null &&
                    ` • ${item.assinatura.diasRestantes} dias restantes`}
                </Text>
              </View>
            )}

            {item.role !== 'admin' && (
              <View style={styles.actions}>
                {(!item.assinatura || item.assinatura.status !== 'ATIVA' || item.assinatura.tipo === 'TRIAL') && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.liberarButton]}
                    onPress={() => handleLiberar(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Liberar</Text>
                  </TouchableOpacity>
                )}
                {item.assinatura && item.assinatura.status === 'ATIVA' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelarButton]}
                    onPress={() => handleCancelar(item.id)}
                  >
                    <Text style={styles.actionButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  adminBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF9500',
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  assinaturaInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  liberarButton: {
    backgroundColor: '#34C759',
  },
  cancelarButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
