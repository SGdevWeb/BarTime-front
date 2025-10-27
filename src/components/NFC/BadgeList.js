// src/components/NFC/BadgeList.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native'; // ✅ Retire FlatList
import { Card, Text, Button, Chip } from 'react-native-paper';
import { badgeService } from '../../services/api/badges';

export default function BadgeList({ badges, onRefresh }) {
  const [actionLoading, setActionLoading] = useState(null);

  const handleToggleActive = async badge => {
    const action = badge.is_active ? 'désactiver' : 'activer';
    const actionVerb = badge.is_active ? 'désactivé' : 'activé';

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} le badge`,
      `Voulez-vous ${action} le badge de ${badge.username || badge.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: badge.is_active ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setActionLoading(badge.id);

              if (badge.is_active) {
                await badgeService.deactivate(badge.id);
              } else {
                await badgeService.activate(badge.id);
              }

              Alert.alert('Succès', `Badge ${actionVerb} avec succès`);

              if (onRefresh) {
                onRefresh();
              }
            } catch (err) {
              console.error('Erreur toggle badge:', err);
              Alert.alert(
                'Erreur',
                err.message || `Impossible de ${action} le badge`,
              );
            } finally {
              setActionLoading(null);
            }
          },
        },
      ],
    );
  };

  if (!badges || badges.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          🏷️ Aucun badge enregistré
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Utilisez "Appairer un badge" pour en ajouter
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {badges.map(
        (
          item, // ✅ Simple map au lieu de FlatList
        ) => (
          <Card key={item.id} style={styles.card} mode="outlined">
            <Card.Content>
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <Text variant="titleMedium" style={styles.userName}>
                    👤{' '}
                    {item.name && item.surname
                      ? `${item.name} ${item.surname}`
                      : item.username}
                  </Text>
                  {item.username !== (item.name || item.surname) && (
                    <Text variant="bodySmall" style={styles.username}>
                      {item.username}
                    </Text>
                  )}
                </View>

                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    item.is_active ? styles.activeChip : styles.inactiveChip,
                  ]}
                  textStyle={styles.statusText}
                >
                  {item.is_active ? '✓ Actif' : '✗ Inactif'}
                </Chip>
              </View>

              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.label}>
                    🏷️ Badge ID:
                  </Text>
                  <Text variant="bodyMedium" style={styles.value}>
                    {item.id}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.label}>
                    💰 Solde:
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.value,
                      styles.balance,
                      {
                        color:
                          parseFloat(item.balance) >= 0 ? '#2a9d8f' : '#e63946',
                      },
                    ]}
                  >
                    {parseFloat(item.balance).toFixed(2)} €
                  </Text>
                </View>

                {item.email && (
                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={styles.label}>
                      📧 Email:
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={styles.value}
                      numberOfLines={1}
                    >
                      {item.email}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text variant="bodySmall" style={styles.label}>
                    📅 Créé le:
                  </Text>
                  <Text variant="bodySmall" style={styles.value}>
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Button
                  mode={item.is_active ? 'outlined' : 'contained'}
                  onPress={() => handleToggleActive(item)}
                  loading={actionLoading === item.id}
                  disabled={actionLoading !== null}
                  icon={item.is_active ? 'lock' : 'lock-open'}
                  style={[
                    styles.actionButton,
                    !item.is_active && styles.activateButton,
                  ]}
                  textColor={item.is_active ? '#e63946' : '#fff'}
                >
                  {item.is_active ? '🔒 Désactiver' : '🔓 Activer'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 4,
  },
  username: {
    color: '#6c757d',
    fontStyle: 'italic',
  },
  statusChip: {
    marginLeft: 8,
  },
  activeChip: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  inactiveChip: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    color: '#6c757d',
    fontWeight: '600',
  },
  value: {
    color: '#212529',
    fontWeight: '500',
  },
  balance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
  activateButton: {
    backgroundColor: '#28a745',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#adb5bd',
    textAlign: 'center',
  },
});
