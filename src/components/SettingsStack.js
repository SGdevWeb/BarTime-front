// src/components/Settings/SettingsStack.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import SettingsHome from './Settings/SettingsHome';
import AssociationInfo from './Settings/AssociationInfo';
import MemberManagement from './Settings/MemberManagement';
import BarmanManagement from './Settings/BarmanManagement';
import StripeSettings from './Settings/StripeSettings';
import ProductManagement from './Settings/ProductManagement';
import CategoryManagement from './Settings/CategoryManagement';
import AccountSettings from './Settings/AccountSettings';
import About from './Settings/About';

export default function SettingsStack({ onLogout, user }) {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [screenTitle, setScreenTitle] = useState('Paramètres');

  console.log(user);

  const navigateTo = (screen, title) => {
    setCurrentScreen(screen);
    setScreenTitle(title);
  };

  const goBack = () => {
    setCurrentScreen('home');
    setScreenTitle('Paramètres');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <SettingsHome
            onNavigate={navigateTo}
            onLogout={onLogout}
            user={user}
          />
        );
      case 'association':
        return <AssociationInfo user={user} />;
      case 'members':
        return <MemberManagement user={user} />;
      case 'barmans':
        return <BarmanManagement user={user} />;
      case 'products':
        return <ProductManagement user={user} />;
      case 'categories':
        return <CategoryManagement user={user} />;
      case 'stripe':
        return <StripeSettings user={user} />;

      case 'account':
        return <AccountSettings user={user} onLogout={onLogout} />;
      case 'about':
        return <About />;
      default:
        return (
          <SettingsHome
            onNavigate={navigateTo}
            onLogout={onLogout}
            user={user}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {currentScreen !== 'home' && (
        <Appbar.Header>
          <Appbar.BackAction onPress={goBack} />
          <Appbar.Content title={screenTitle} />
        </Appbar.Header>
      )}
      <View style={styles.content}>{renderScreen()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
