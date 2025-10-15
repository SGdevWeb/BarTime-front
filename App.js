import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainLayout from './src/layouts/MainLayout'; // wrapper BarmanLayout/UserLayout
import { View } from 'react-native';

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = data => setUser(data);

  const handleLogout = async () => {
    setUser(null);
  };

  return (
    <SafeAreaProvider>
      <PaperProvider
        settings={{
          icon: props => <MaterialCommunityIcons {...props} />,
        }}
      >
        <NavigationContainer>
          <AppContent
            user={user}
            showRegister={showRegister}
            setShowRegister={setShowRegister}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

function AppContent({
  user,
  showRegister,
  setShowRegister,
  onLoginSuccess,
  onLogout,
}) {
  // Si pas connecté → login/register
  if (!user) {
    return showRegister ? (
      <RegisterScreen onRegisterSuccess={onLoginSuccess} />
    ) : (
      <LoginScreen
        onLoginSuccess={onLoginSuccess}
        onNavigateToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Si connecté → layout principal avec header + contenu + bottom navigation
  return <MainLayout user={user} onLogout={onLogout} />;
}
