// src/services/api/users.js
import { apiClient } from './client';

export const userService = {
  // Créer un adhérent (par l'association)
  createAdherent: async data => {
    return apiClient('/users/create-adherent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Récupérer le profil de l'utilisateur connecté
  getProfile: async () => {
    return apiClient('/users/profile');
  },

  // Récupérer tous les users de l'association
  getAll: async () => {
    return apiClient('/users');
  },
};
