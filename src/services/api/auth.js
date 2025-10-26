// src/services/api/auth.js
import { publicClient } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Connexion
  login: async (username, password) => {
    const response = await publicClient('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    // Sauvegarder le token
    if (response.token) {
      await AsyncStorage.setItem('token', response.token);
    }

    return response;
  },

  // Inscription
  register: async userData => {
    return publicClient('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Déconnexion
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },

  // Vérifier si connecté
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};
