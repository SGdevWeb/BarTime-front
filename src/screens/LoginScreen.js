// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { authService } from '../services/api/auth';

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      const response = await authService.login(username, password);

      if (response.success && response.user) {
        console.log(
          'User connecté:',
          response.user.username,
          'Role:',
          response.user.role,
        );
        onLoginSuccess(response.user);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Erreur login:', err);
      Alert.alert('Erreur', err.message || 'Impossible de se connecter');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion BarTime</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={{ borderRadius: 10, backgroundColor: '#457b9d' }}
      >
        Se connecter
      </Button>

      <TouchableOpacity onPress={onNavigateToRegister}>
        <Text style={styles.registerLink}>
          Pas encore inscrit ?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>
            Crée un compte
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  registerLink: {
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
});
