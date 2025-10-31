// src/screens/MainLayout.js
import React, { useState } from 'react';
import BarmanLayout from './BarmanLayout';
import UserLayout from './UserLayout';

export default function MainLayout({ user, onLogout }) {
  // Démarrer en mode barman si c'est une association pure
  const defaultMode = user.role === 'association' ? 'barman' : 'adherent';
  const [mode, setMode] = useState(defaultMode);

  // Vérifier si l'utilisateur peut gérer le bar
  const hasBarAccess =
    user.role === 'association' || user.permissions?.includes('manage_bar');

  // Enrichir l'objet user avec le mode actuel
  const userWithMode = {
    ...user,
    currentMode: mode,
    isActingAsBarman: mode === 'barman',
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
