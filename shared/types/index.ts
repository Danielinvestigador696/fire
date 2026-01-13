// Tipos compartilhados entre frontend e backend

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Equipe {
  id: string;
  nome: string;
  descricao?: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipeMembro {
  id: string;
  equipeId: string;
  userId: string;
  role: 'admin' | 'membro';
  createdAt: string;
}

export interface Arma {
  id: string;
  userId: string;
  equipeId?: string;
  numeroSerie: string;
  modelo: string;
  calibre: string;
  fabricante?: string;
  tipo?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArmaFoto {
  id: string;
  armaId: string;
  url: string;
  ordem: number;
  createdAt: string;
}

export interface Documento {
  id: string;
  userId: string;
  tipo: 'CR' | 'PORTE' | 'CAC' | 'LICENCA' | 'SEGURO';
  numero: string;
  orgaoEmissor?: string;
  dataEmissao: string;
  dataVencimento: string;
  arquivoUrl?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CacaRegistro {
  id: string;
  userId: string;
  equipeId?: string;
  publico: boolean;
  fotoUrl: string;
  latitude: number;
  longitude: number;
  data: string;
  peso?: number;
  tamanho?: number;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notificacao {
  id: string;
  userId: string;
  tipo: 'DOCUMENTO_VENCENDO' | 'CONVITE_EQUIPE' | 'NOVA_CACA' | 'ALERTA_SISTEMA';
  titulo: string;
  mensagem: string;
  lida: boolean;
  createdAt: string;
}
