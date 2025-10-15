// src/screens/MainLayout.js
import React from 'react';
import BarmanLayout from './BarmanLayout';
import UserLayout from './UserLayout';

export default function MainLayout({ user, onLogout }) {
  if (user.role === 'association') {
    return <BarmanLayout onLogout={onLogout} />;
  } else {
    return <UserLayout onLogout={onLogout} />;
  }
}
