import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('adhérent');

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/register',
        {
          username,
          password,
          role,
        },
      );
      console.log(response);
      if (response.data && response.data.user) {
        onRegisterSuccess(response.data.user);
      } else {
        Alert.alert('Erreur', 'Impossible de créer l’utilisateur');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur serveur');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>Je suis :</Text>
      <View style={styles.roleContainer}>
        <Button
          title="Adhérent"
          onPress={() => setRole('adhérent')}
          color={role === 'adhérent' ? 'blue' : 'gray'}
        />
        <Button
          title="Association"
          onPress={() => setRole('association')}
          color={role === 'association' ? 'blue' : 'gray'}
        />
      </View>

      <Button title="S'inscrire" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  label: { marginBottom: 8 },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
});
