import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/app/services/api';
import { Documento } from '@/shared/types';

export default function DocumentosScreen() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [vencendo, setVencendo] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      const [allDocs, vencendoDocs] = await Promise.all([
        api.get('/documentos'),
        api.get('/documentos/vencendo'),
      ]);
      setDocumentos(allDocs.data.documentos);
      setVencendo(vencendoDocs.data.documentos);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (diasRestantes: number) => {
    if (diasRestantes < 0) return '#FF3B30';
    if (diasRestantes <= 30) return '#FF9500';
    return '#34C759';
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
      {vencendo.length > 0 && (
        <View style={styles.alertSection}>
          <Text style={styles.alertTitle}>⚠️ Documentos Vencendo</Text>
          <FlatList
            data={vencendo}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: any) => (
              <View style={styles.alertCard}>
                <Text style={styles.alertText}>
                  {item.tipo} - {item.numero}
                </Text>
                <Text style={[styles.alertDays, { color: getStatusColor(item.diasRestantes) }]}>
                  {item.diasRestantes < 0
                    ? 'Vencido'
                    : `${item.diasRestantes} dias restantes`}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/documentos/new')}
      >
        <Text style={styles.addButtonText}>+ Novo Documento</Text>
      </TouchableOpacity>

      <FlatList
        data={documentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/documentos/${item.id}`)}
          >
            <Text style={styles.cardTitle}>{item.tipo}</Text>
            <Text style={styles.cardSubtitle}>Número: {item.numero}</Text>
            <Text style={styles.cardSubtitle}>
              Vencimento: {new Date(item.dataVencimento).toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum documento cadastrado</Text>
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
  alertSection: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#856404',
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  alertDays: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
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
