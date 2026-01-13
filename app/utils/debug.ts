// Utilitário para debug de conexão

export const testConnection = async () => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  console.log('🔍 Testando conexão com API...');
  console.log('URL:', API_URL);
  
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`);
    const data = await response.json();
    console.log('✅ Backend está respondendo:', data);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao conectar com backend:', error.message);
    console.log('💡 Verifique:');
    console.log('  1. Backend está rodando? (npm run dev no backend)');
    console.log('  2. URL está correta? (EXPO_PUBLIC_API_URL)');
    console.log('  3. Para dispositivo físico, use o IP da máquina, não localhost');
    return false;
  }
};
