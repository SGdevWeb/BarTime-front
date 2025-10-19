import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';

export default function ReadBadge() {
  const [isScanning, setIsScanning] = React.useState(false);
  const [badgeInfo, setBadgeInfo] = React.useState(null);

  const fakeBadges = [
    { id: 'B001', user: 'Alice Dupont', balance: 12.5 },
    { id: 'B002', user: 'Bob Martin', balance: 8 },
    { id: 'B003', user: 'Charlie Leroy', balance: 25 },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setBadgeInfo(null);
    setTimeout(() => {
      const random = fakeBadges[Math.floor(Math.random() * fakeBadges.length)];
      setBadgeInfo(random);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Simulation lecture de badge NFC
        </Text>

        <Button
          mode="contained-tonal"
          icon="nfc"
          onPress={handleScan}
          loading={isScanning}
          disabled={isScanning}
          style={{ marginVertical: 10 }}
        >
          {isScanning ? 'Lecture en cours...' : 'Scanner un badge'}
        </Button>

        {badgeInfo && (
          <View style={styles.infoBox}>
            <Text variant="bodyLarge">👤 {badgeInfo.user}</Text>
            <Text variant="bodyMedium">🆔 ID : {badgeInfo.id}</Text>
            <Text variant="bodyMedium">
              💰 Solde : {badgeInfo.balance.toFixed(2)} €
            </Text>
          </View>
        )}

        {!isScanning && !badgeInfo && (
          <Text style={{ textAlign: 'center', color: '#777', marginTop: 10 }}>
            Appuie sur le bouton pour lire un badge.
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 10 },
  title: { marginBottom: 10, textAlign: 'center' },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
});
