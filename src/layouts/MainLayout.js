// src/screens/MainLayout.js
import React, { useState } from 'react';
import BarmanLayout from './BarmanLayout';
import UserLayout from './UserLayout';

export default function MainLayout({ user, onLogout }) {
  // On démarre en mode adhérent par défaut
  const [mode, setMode] = useState('adherent');

  // Vérifier si l'utilisateur peut gérer le bar
  const hasBarAccess =
    user.role === 'association' || user.permissions?.includes('manage_bar');

  // Enrichir l'objet user avec le mode actuel
  const userWithMode = {
    ...user,
    currentMode: mode, // Ajouter le mode actuel pour les vérifications
    isActingAsBarman: mode === 'barman', // Flag explicite
  };

  // Mode Barman
  if (mode === 'barman' && hasBarAccess) {
    return (
      <BarmanLayout
        user={userWithMode}
        onLogout={onLogout}
        onSwitchMode={() => setMode('adherent')}
        canSwitch={user.role === 'adherent'} // Seulement si adhérent-barman
      />
    );
  }

  // Mode Adhérent
  return (
    <UserLayout
      user={userWithMode}
      onLogout={onLogout}
      onSwitchMode={() => setMode('barman')}
      canSwitch={hasBarAccess}
    />
  );
}
