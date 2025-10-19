import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

export default function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('adhérent');

  // State pour le dropdown
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Un adhérent', value: 'adhérent' },
    { label: 'Une association', value: 'association' },
  ]);

  const handleBackToLogin = () => {
    onNavigateToLogin();
  };

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

      <View style={styles.dropdownWrapper}>
        <Text style={styles.label}>Je suis</Text>
        <DropDownPicker
          open={open}
          value={role}
          items={items}
          setOpen={setOpen}
          setValue={setRole}
          setItems={setItems}
          placeholder="Sélectionne un rôle"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleRegister}
        style={{ borderRadius: 10, backgroundColor: '#457b9d' }}
      >
        S'inscrire
      </Button>

      <TouchableOpacity onPress={handleBackToLogin}>
        <Text style={styles.registerLink}>
          Déjà un compte ?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Connecte toi</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  dropdownWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 12,
    top: -8,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 9999,
    color: '#333',
    fontWeight: 'bold',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 12,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#457b9d',
  },
  registerLink: {
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
});
