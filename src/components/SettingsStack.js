import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function SettingsScreen({ onLogout }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Paramètres du compte</Text>
      <Button mode="contained" onPress={onLogout} buttonColor="#e63946">
        Se déconnecter
      </Button>
    </View>
  );
}
