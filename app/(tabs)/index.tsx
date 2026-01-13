import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { api } from '@/app/services/api';
import { SubscriptionBanner } from '@/app/components/SubscriptionBanner';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    documentosVencendo: 0,
    armasCadastradas: 0,
    cacasRegistradas: 0,
    equipes: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [docs, armas, cacas, equipes] = await Promise.all([
        api.get('/documentos/vencendo'),
        api.get('/armas/count'),
        api.get('/caca/count'),
        api.get('/equipes/count'),
      ]);

      setStats({
        documentosVencendo: docs.data.count || 0,
        armasCadastradas: armas.data.count || 0,
        cacasRegistradas: cacas.data.count || 0,
        equipes: equipes.data.count || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SubscriptionBanner />
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name || 'Usuário'}!</Text>
        <Text style={styles.subtitle}>Bem-vindo ao AnotFire CAC</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.documentosVencendo}</Text>
          <Text style={styles.statLabel}>Documentos Vencendo</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.armasCadastradas}</Text>
          <Text style={styles.statLabel}>Armas Cadastradas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.cacasRegistradas}</Text>
          <Text style={styles.statLabel}>Caças Registradas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.equipes}</Text>
          <Text style={styles.statLabel}>Equipes</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/armas')}
        >
          <Text style={styles.actionButtonText}>Cadastrar Nova Arma</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/caca')}
        >
          <Text style={styles.actionButtonText}>Registrar Nova Caça</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/documentos')}
        >
          <Text style={styles.actionButtonText}>Ver Documentos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
