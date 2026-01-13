import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { api } from './api';

// Configurar handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.warn('Push notifications só funcionam em dispositivos físicos');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Permissão para notificações negada');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Enviar token para o backend
  try {
    const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
    await api.post('/notificacoes/token', { token, plataforma: platform });
  } catch (error) {
    console.error('Erro ao registrar token:', error);
  }

  return token;
}

export async function scheduleNotification(title: string, body: string, trigger?: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: trigger || null,
  });
}

// Export default para evitar erro do Expo Router
export default {};
