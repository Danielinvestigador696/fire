import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { api } from '@/app/services/api';

interface ShareButtonProps {
  cacaId: number;
  fotoUrl: string;
  titulo?: string;
  mensagem?: string;
}

export function ShareButton({ cacaId, fotoUrl, titulo, mensagem }: ShareButtonProps) {
  const handleShare = async (tipo: 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'LINK') => {
    try {
      const shareMessage = mensagem || 'Confira este registro de caça!';
      const shareTitle = titulo || 'Registro de Caça';

      if (tipo === 'LINK') {
        // Compartilhar link
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fotoUrl);
        } else {
          Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo');
        }
      } else {
        // Registrar compartilhamento no backend
        await api.post(`/caca/${cacaId}/compartilhar`, {
          tipo,
          urlCompartilhada: fotoUrl,
        });

        // Para redes sociais, usar deep links ou Web Share API
        Alert.alert('Sucesso', `Compartilhamento em ${tipo} registrado!`);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao compartilhar');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleShare('WHATSAPP')}
      >
        <Text style={styles.buttonText}>Compartilhar no WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonFacebook]}
        onPress={() => handleShare('FACEBOOK')}
      >
        <Text style={styles.buttonText}>Compartilhar no Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonInstagram]}
        onPress={() => handleShare('INSTAGRAM')}
      >
        <Text style={styles.buttonText}>Compartilhar no Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonTwitter]}
        onPress={() => handleShare('TWITTER')}
      >
        <Text style={styles.buttonText}>Compartilhar no Twitter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonLink]}
        onPress={() => handleShare('LINK')}
      >
        <Text style={styles.buttonText}>Compartilhar Link</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonFacebook: {
    backgroundColor: '#4267B2',
  },
  buttonInstagram: {
    backgroundColor: '#E4405F',
  },
  buttonTwitter: {
    backgroundColor: '#1DA1F2',
  },
  buttonLink: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
