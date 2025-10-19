import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function PairBadge({ badges, setBadges }) {
  const [scannedBadge, setScannedBadge] = React.useState(null);
  const [isScanning, setIsScanning] = React.useState(false);

  // Fake
  const fakeUsers = [
    { id: 'B001', user: 'Alice Dupont' },
    { id: 'B002', user: 'Bob Martin' },
    { id: 'B003', user: 'Charlie Leroy' },
    { id: 'B004', user: 'David Petit' },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setScannedBadge(null);
    setTimeout(() => {
      const randomBadge =
        fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
      // Vérifier si le badge est déjà appairé
      const alreadyPaired = badges.some(b => b.id === randomBadge.id);
      setScannedBadge({ ...randomBadge, paired: alreadyPaired });
      setIsScanning(false);
    }, 1000);
  };

  const handlePair = () => {
    if (!scannedBadge) return;

    setBadges(prev => [...prev, { ...scannedBadge, balance: 0, history: [] }]);

    Alert.alert(
      '✅ Badge appairé',
      `${scannedBadge.user} (${scannedBadge.id}) a été appairé avec succès !`,
    );

    setScannedBadge(prev => ({ ...prev, paired: true }));
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
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

        {scannedBadge && (
          <View style={styles.infoBox}>
            <Text variant="bodyLarge">👤 {scannedBadge.user}</Text>
            <Text variant="bodyMedium">🆔 ID : {scannedBadge.id}</Text>
            <Text variant="bodyMedium">
              {scannedBadge.paired ? '🔒 Déjà appairé' : '🔓 Non appairé'}
            </Text>

            {!scannedBadge.paired && (
              <Button
                mode="contained"
                icon="link-variant"
                onPress={handlePair}
                style={{ marginTop: 10 }}
              >
                Appairer ce badge
              </Button>
            )}
          </View>
        )}

        {!isScanning && !scannedBadge && (
          <Text style={{ textAlign: 'center', color: '#777', marginTop: 10 }}>
            Appuie sur le bouton pour scanner un badge.
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
