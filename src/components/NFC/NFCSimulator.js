// src/components/NFC/NFCSimulator.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';

export default function NFCSimulator({ onBadgeScanned, isScanning }) {
  const [badgeId, setBadgeId] = useState('');

  const simulateScan = () => {
    if (badgeId.trim()) {
      onBadgeScanned(badgeId.trim());
      setBadgeId('');
    }
  };

  // Badges de test prédéfinis
  const quickScan = id => {
    onBadgeScanned(id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Simulateur NFC</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Entrez un ID de badge (ex: 1-0001)"
        value={badgeId}
        onChangeText={setBadgeId}
        autoCapitalize="none"
        editable={!isScanning}
      />

      <Button
        mode="contained"
        onPress={simulateScan}
        style={styles.button}
        disabled={!badgeId.trim() || isScanning}
        icon="flash"
      >
        {isScanning ? '⏳ Scan en cours...' : '📡 Simuler un scan'}
      </Button>

      <View style={styles.quickButtons}>
        <Text style={styles.subtitle}>Badges de test :</Text>
        <TouchableOpacity
          style={[styles.quickButton, isScanning && styles.disabled]}
          onPress={() => quickScan('1-0001')}
          disabled={isScanning}
        >
          <Text style={styles.quickText}>🏷️ Badge 1-0001</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickButton, isScanning && styles.disabled]}
          onPress={() => quickScan('1-0002')}
          disabled={isScanning}
        >
          <Text style={styles.quickText}>🏷️ Badge 1-0002</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickButton, isScanning && styles.disabled]}
          onPress={() => quickScan('1-0003')}
          disabled={isScanning}
        >
          <Text style={styles.quickText}>🏷️ Badge 1-0003</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffc107',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#856404',
  },
  input: {
    borderWidth: 1,
    borderColor: '#856404',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#ffc107',
  },
  quickButtons: {
    marginTop: 8,
  },
  quickButton: {
    padding: 12,
    backgroundColor: '#457b9d',
    borderRadius: 6,
    marginVertical: 4,
  },
  quickText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
