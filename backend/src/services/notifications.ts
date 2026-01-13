import { database } from '../database/connection';
import nodemailer from 'nodemailer';
import * as Notifications from 'expo-notifications';

// Configurar Expo Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configurar email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const notificationService = {
  async sendPushNotification(userId: number, title: string, body: string, data?: any) {
    try {
      // Buscar tokens do usuário
      const [tokens] = await database.query(
        'SELECT token, plataforma FROM push_tokens WHERE user_id = ?',
        [userId]
      ) as any[];

      if (tokens.length === 0) {
        return;
      }

      // Enviar para cada token
      for (const tokenData of tokens) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              data,
            },
            trigger: null, // Enviar imediatamente
          });
        } catch (error) {
          console.error('Erro ao enviar push notification:', error);
        }
      }

      // Salvar notificação no banco
      await database.query(
        'INSERT INTO notificacoes (user_id, tipo, titulo, mensagem) VALUES (?, ?, ?, ?)',
        [userId, 'ALERTA_SISTEMA', title, body]
      );
    } catch (error) {
      console.error('Erro no serviço de notificações push:', error);
    }
  },

  async sendEmail(userId: number, to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
      });

      // Salvar notificação no banco
      await database.query(
        'INSERT INTO notificacoes (user_id, tipo, titulo, mensagem) VALUES (?, ?, ?, ?)',
        [userId, 'ALERTA_SISTEMA', subject, html]
      );
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  },

  async checkDocumentosVencendo() {
    try {
      const hoje = new Date();
      const em90Dias = new Date();
      em90Dias.setDate(hoje.getDate() + 90);

      // Buscar documentos vencendo
      const [documentos] = await database.query(
        `SELECT d.*, u.email, u.name
         FROM documentos d
         INNER JOIN users u ON d.user_id = u.id
         WHERE d.data_vencimento BETWEEN ? AND ?
         AND d.id NOT IN (
           SELECT documento_id FROM documento_alertas WHERE enviado = 1
         )`,
        [hoje, em90Dias]
      ) as any[];

      for (const doc of documentos) {
        const diasRestantes = Math.ceil(
          (new Date(doc.data_vencimento).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Verificar preferências do usuário
        const [prefs] = await database.query(
          'SELECT * FROM notificacao_preferencias WHERE user_id = ? AND tipo_notificacao = ?',
          [doc.user_id, 'DOCUMENTO_VENCENDO']
        ) as any[];

        const preferencias = prefs.length > 0 ? prefs[0] : { email: true, push: true, dias_antes: 30 };

        // Verificar se deve enviar alerta
        if (diasRestantes <= (preferencias.dias_antes || 30)) {
          const titulo = `Documento vencendo: ${doc.tipo}`;
          const mensagem = `Seu documento ${doc.tipo} (${doc.numero}) vence em ${diasRestantes} dias.`;

          // Enviar push se habilitado
          if (preferencias.push) {
            await this.sendPushNotification(doc.user_id, titulo, mensagem);
          }

          // Enviar email se habilitado
          if (preferencias.email) {
            const html = `
              <h2>Alerta de Vencimento de Documento</h2>
              <p>Olá ${doc.name},</p>
              <p>Seu documento <strong>${doc.tipo}</strong> (${doc.numero}) vence em <strong>${diasRestantes} dias</strong>.</p>
              <p>Data de vencimento: ${new Date(doc.data_vencimento).toLocaleDateString('pt-BR')}</p>
            `;
            await this.sendEmail(doc.user_id, doc.email, titulo, html);
          }

          // Marcar alerta como enviado
          await database.query(
            'INSERT INTO documento_alertas (documento_id, dias_antes, enviado, enviado_em) VALUES (?, ?, 1, NOW())',
            [doc.id, diasRestantes]
          );
        }
      }
    } catch (error) {
      console.error('Erro ao verificar documentos vencendo:', error);
    }
  },
};
