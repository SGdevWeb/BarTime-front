// src/screens/UserLayout.js
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Appbar, BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>🏠 Accueil utilisateur</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>👤 Profil utilisateur</Text>
    </View>
  );
}

function SettingsScreen({ onLogout }) {
  return (
    <View style={styles.screen}>
      <Text>⚙️ Paramètres</Text>
      <Text
        onPress={onLogout}
        style={{ color: 'red', marginTop: 20, fontWeight: 'bold' }}
      >
        Déconnexion
      </Text>
    </View>
  );
}

export default function UserLayout({ onLogout }) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Accueil', focusedIcon: 'home' },
    { key: 'profile', title: 'Profil', focusedIcon: 'account' },
    { key: 'settings', title: 'Paramètres', focusedIcon: 'cog' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    profile: ProfileScreen,
    settings: () => <SettingsScreen onLogout={onLogout} />,
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.Content title={routes[index].title} />
      </Appbar.Header>

      {/* BottomNavigation (gère le contenu et la barre) */}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        safeAreaInsets={{ bottom: insets.bottom }}
        activeColor="#e63946"
        inactiveColor="#555"
        barStyle={{ backgroundColor: '#fff', height: 70 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
