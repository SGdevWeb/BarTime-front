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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        onLoginSuccess(data);
      } else {
        Alert.alert(
          'Erreur',
          data.message || 'Nom d’utilisateur ou mot de passe incorrect',
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
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
