import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/app/services/api';
import { CacaRegistro } from '@/shared/types';

export default function CacaScreen() {
  const [registros, setRegistros] = useState<CacaRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRegistros();
  }, []);

  const loadRegistros = async () => {
    try {
      const response = await api.get('/caca');
      setRegistros(response.data.registros);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/caca/new')}
      >
        <Text style={styles.addButtonText}>+ Novo Registro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => router.push('/caca/mapa')}
      >
        <Text style={styles.mapButtonText}>Ver Mapa</Text>
      </TouchableOpacity>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/caca/${item.id}`)}
          >
            <Text style={styles.cardDate}>
              {new Date(item.data).toLocaleDateString('pt-BR')}
            </Text>
            {item.peso && (
              <Text style={styles.cardInfo}>Peso: {item.peso} kg</Text>
            )}
            {item.publico && (
              <Text style={styles.publicoBadge}>Público</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum registro de caça</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardInfo: {
    fontSize: 14,
    color: '#666',
  },
  publicoBadge: {
    backgroundColor: '#34C759',
    color: '#fff',
    padding: 5,
    borderRadius: 4,
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
