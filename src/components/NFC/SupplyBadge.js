import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Text, TextInput, Chip } from 'react-native-paper';

export default function SupplyBadge({ badges, setBadges }) {
  const [isScanning, setIsScanning] = React.useState(false);
  const [badgeInfo, setBadgeInfo] = React.useState(null);
  const [amount, setAmount] = React.useState('');

  const handleScan = () => {
    setIsScanning(true);
    setBadgeInfo(null);
    setTimeout(() => {
      const scanned = badges[Math.floor(Math.random() * badges.length)];
      setBadgeInfo(scanned);
      setIsScanning(false);
    }, 1000);
  };

  const handleRecharge = () => {
    const numericAmount = parseFloat(amount);
    if (!badgeInfo || isNaN(numericAmount) || numericAmount <= 0) return;

    setBadges(prev =>
      prev.map(b =>
        b.id === badgeInfo.id
          ? {
              ...b,
              balance: b.balance + numericAmount,
              history: [
                ...b.history,
                {
                  date: new Date().toISOString().slice(0, 10),
                  montant: numericAmount,
                  type: 'Recharge',
                },
              ],
            }
          : b,
      ),
    );

    Alert.alert(
      '✅ Recharge effectuée',
      `${badgeInfo.user} (${badgeInfo.id}) a été rechargé de ${numericAmount} €`,
    );

    setBadgeInfo(prev => ({ ...prev, balance: prev.balance + numericAmount }));
    setAmount('');
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

        {badgeInfo && (
          <View style={styles.infoBox}>
            <Text variant="bodyLarge">👤 {badgeInfo.user}</Text>
            <Text variant="bodyMedium">🆔 ID : {badgeInfo.id}</Text>
            <Text variant="bodyMedium">
              💰 Solde : {badgeInfo.balance.toFixed(2)} €
            </Text>

            <TextInput
              label="Montant à recharger"
              mode="outlined"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={{ marginTop: 12 }}
            />

            <Button
              mode="contained"
              icon="credit-card-plus-outline"
              onPress={handleRecharge}
              disabled={!amount}
              style={{ marginTop: 10 }}
            >
              Recharger
            </Button>
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
