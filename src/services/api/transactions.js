// src/services/api/transactions.js
import { apiClient } from './client';

export const transactionService = {
  // Créer une transaction (achat)
  create: async transactionData => {
    return apiClient('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  // Récupérer les transactions d'un utilisateur
  getUserTransactions: async userId => {
    return apiClient(`/transactions/user/${userId}`);
  },

  // Récupérer toutes les transactions (association)
  getAll: async () => {
    return apiClient('/transactions');
  },

  // Récupérer une transaction par ID
  getById: async id => {
    return apiClient(`/transactions/${id}`);
  },

  // Récupérer l'historique avec détails
  getHistory: async (userId, limit = 50) => {
    return apiClient(`/transactions/user/${userId}?limit=${limit}`);
  },
};
