import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';
import NFCSimulator from './NFCSimulator';
import { badgeService } from '../../services/api/badges';

export default function ReadBadge({ badges, onRefresh }) {
  const [isScanning, setIsScanning] = React.useState(false);
  const [badgeInfo, setBadgeInfo] = React.useState(null);

  const handleBadgeScanned = async badgeId => {
    try {
      setIsScanning(true);
      setBadgeInfo(null);

      console.log('🔍 Lecture du badge:', badgeId);

      // Appeler l'API pour lire le badge
      const response = await badgeService.read(badgeId);

      if (response.success) {
        const badge = response.data;

        setBadgeInfo({
          id: badge.id,
          user:
            badge.name && badge.surname
              ? `${badge.name} ${badge.surname}`
              : badge.username,
          username: badge.username,
          balance: parseFloat(badge.balance),
          isActive: badge.is_active,
        });

        // Rafraîchir la liste des badges
        if (onRefresh) {
          onRefresh();
        }
      } else {
        Alert.alert('Erreur', 'Badge non trouvé');
      }
    } catch (err) {
      console.error('Erreur lecture badge:', err);

      if (err.message.includes('404')) {
        Alert.alert(
          'Badge inconnu',
          "Ce badge n'est pas enregistré dans le système",
        );
      } else if (err.message.includes('inactif')) {
        Alert.alert('Badge inactif', 'Ce badge a été désactivé');
      } else {
        Alert.alert('Erreur', err.message || 'Impossible de lire le badge');
      }

      setBadgeInfo(null);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setBadgeInfo(null);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Lecture de badge NFC
        </Text>

        <>
          <NFCSimulator
            onBadgeScanned={handleBadgeScanned}
            isScanning={isScanning}
          />
          <Divider style={{ marginVertical: 16 }} />
        </>

        {/* <Button
          mode="contained"
          icon="nfc"
          onPress={() => {
            // TODO: Implémenter le vrai scan NFC
            Alert.alert('NFC', 'Scan NFC réel pas encore implémenté');
          }}
          loading={isScanning}
          disabled={isScanning}
          style={styles.scanButton}
        >
          {isScanning ? 'Lecture en cours...' : '📡 Scanner un badge'}
        </Button> */}

        {badgeInfo && (
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Text variant="titleLarge" style={styles.userName}>
                👤 {badgeInfo.user}
              </Text>
              {badgeInfo.isActive ? (
                <View style={styles.statusActive}>
                  <Text style={styles.statusText}>✓ Actif</Text>
                </View>
              ) : (
                <View style={styles.statusInactive}>
                  <Text style={styles.statusText}>✗ Inactif</Text>
                </View>
              )}
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>
                🆔 Identifiant :
              </Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {badgeInfo.id}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={styles.infoLabel}>
                👨‍💻 Utilisateur :
              </Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {badgeInfo.username}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyLarge" style={styles.infoLabel}>
                💰 Solde :
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.infoValue,
                  styles.balance,
                  { color: badgeInfo.balance >= 0 ? '#2a9d8f' : '#e63946' },
                ]}
              >
                {badgeInfo.balance.toFixed(2)} €
              </Text>
            </View>

            <Button
              mode="outlined"
              onPress={resetScan}
              style={{ marginTop: 16 }}
            >
              Nouveau scan
            </Button>
          </View>
        )}

        {!isScanning && !badgeInfo && (
          <Text style={{ textAlign: 'center', color: '#777', marginTop: 10 }}>
            Appuie sur le bouton pour lire un badge (simulation).
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 2,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scanButton: {
    marginVertical: 12,
    borderRadius: 8,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    color: '#1d3557',
    flex: 1,
  },
  statusActive: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  statusInactive: {
    backgroundColor: '#f8d7da',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#6c757d',
    fontWeight: '600',
  },
  infoValue: {
    color: '#212529',
    fontWeight: 'bold',
  },
  balance: {
    fontSize: 20,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
