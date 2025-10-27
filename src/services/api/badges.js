// src/services/api/badges.js
import { apiClient } from './client';

export const badgeService = {
  // Récupérer tous les badges
  getAll: async () => {
    return apiClient('/badges');
  },

  // Récupérer les badges d'un utilisateur
  getUserBadges: async userId => {
    return apiClient(`/badges/user/${userId}`);
  },

  // Lire un badge (scan NFC)
  read: async badgeId => {
    return apiClient(`/badges/${badgeId}`);
  },

  // Créer/Appairer un badge à un utilisateur
  pair: async badgeData => {
    return apiClient('/badges/pair', {
      method: 'POST',
      body: JSON.stringify(badgeData),
    });
  },

  // Désactiver un badge
  deactivate: async badgeId => {
    console.log('entrée');
    return apiClient(`/badges/${badgeId}/deactivate`, {
      method: 'PUT',
    });
  },

  // Activer un badge
  activate: async badgeId => {
    return apiClient(`/badges/${badgeId}/activate`, {
      method: 'PUT',
    });
  },

  // Supprimer un badge (soft delete)
  delete: async badgeId => {
    return apiClient(`/badges/${badgeId}`, {
      method: 'DELETE',
    });
  },
};
