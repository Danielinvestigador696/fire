import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/app/services/api';

export function BlockedScreen() {
  const router = useRouter();

  const handleSolicitarLiberacao = async () => {
    try {
      // Enviar notificação/email para admin
      Alert.alert(
        'Solicitação Enviada',
        'Sua solicitação de liberação foi enviada. O administrador entrará em contato em breve.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar solicitação');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>Acesso Bloqueado</Text>
      <Text style={styles.message}>
        Seu período de trial expirou ou sua assinatura não está ativa.
      </Text>
      <Text style={styles.submessage}>
        Entre em contato com o administrador para liberar seu acesso.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSolicitarLiberacao}
      >
        <Text style={styles.buttonText}>Solicitar Liberação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push('/(tabs)/assinatura')}
      >
        <Text style={styles.buttonTextSecondary}>Ver Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  submessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
