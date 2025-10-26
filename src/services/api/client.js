// src/services/api/client.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:3000/api';

// Récupérer le token JWT
export const getAuthToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Client HTTP avec authentification automatique
export const apiClient = async (endpoint, options = {}) => {
  const token = await getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur réseau');
  }

  return response.json();
};

// Client sans authentification (pour login/register)
export const publicClient = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur réseau');
  }

  return response.json();
};
