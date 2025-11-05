// src/services/api/categories.js
import { apiClient } from './client';

export const categoryService = {
  // Récupérer toutes les catégories
  getAll: async () => {
    return apiClient('/categories');
  },

  // Créer une catégorie
  create: async categoryData => {
    return apiClient('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Modifier une catégorie
  update: async (id, categoryData) => {
    return apiClient(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Supprimer une catégorie
  delete: async id => {
    return apiClient(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  checkUsage: async id => {
    return apiClient(`/categories/${id}/usage`);
  },
};
