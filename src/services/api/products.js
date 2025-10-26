// src/services/api/products.js
import { apiClient } from './client';

export const productService = {
  // Récupérer tous les produits
  getAll: async () => {
    return apiClient('/products');
  },

  // Récupérer un produit par ID
  getById: async id => {
    return apiClient(`/products/${id}`);
  },

  // Créer un produit (association uniquement)
  create: async productData => {
    return apiClient('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Mettre à jour un produit
  update: async (id, productData) => {
    return apiClient(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Supprimer un produit
  delete: async id => {
    return apiClient(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
