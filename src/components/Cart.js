import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'Leffe blonde', price: 3, category: 'Bières' },
  { id: '2', name: 'Bière de Noel', price: 3.5, category: 'Bières' },
  { id: '3', name: 'Jupiler', price: 3.5, category: 'Bières' },
  { id: '4', name: 'Jenlain ambré', price: 3.5, category: 'Bières' },
  { id: '5', name: 'Coca', price: 2, category: 'Sodas' },
  { id: '6', name: 'Orangina', price: 2, category: 'Sodas' },
  { id: '7', name: 'Oasis', price: 2, category: 'Sodas' },
  { id: '8', name: 'Eau', price: 2, category: 'Sodas' },
  { id: '9', name: 'Vin rouge', price: 4, category: 'Vins' },
  { id: '10', name: 'Vin blanc', price: 4, category: 'Vins' },
  { id: '11', name: 'Rosé', price: 4, category: 'Vins' },
  { id: '12', name: 'Pastis', price: 3, category: 'Apéritif' },
  { id: '13', name: 'Chips', price: 1.5, category: 'Autres' },
  { id: '14', name: 'Snikers', price: 1.5, category: 'Autres' },
];

export default function Cart({ cart, removeFromCart, clearCart }) {
  // Transforme l’objet `cart` {id: qty} → tableau de produits avec quantité
  const items = Object.entries(cart)
    .map(([id, qty]) => {
      const product = PRODUCTS.find(p => p.id === id);
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handlePayByBadge = () => {
    Alert.alert(
      'Paiement par badge',
      '👉 Simulation du paiement par badge NFC',
    );
  };

  const handlePayByQR = () => {
    Alert.alert(
      'Paiement par QR Code',
      '👉 Simulation du paiement via QR code',
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vider le panier',
      'Souhaitez-vous vraiment vider le panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: clearCart },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Votre Panier</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Votre panier est vide.</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.qty}>x{item.qty}</Text>
                <Text style={styles.price}>
                  {(item.price * item.qty).toFixed(2)}€
                </Text>
              </View>
            )}
          />

          {/* Total + bouton "vider" */}
          <View style={styles.footer}>
            <Text style={styles.total}>Total : {total.toFixed(2)}€</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
            >
              <Text style={styles.clearText}>Vider le panier</Text>
            </TouchableOpacity>
          </View>

          {/* Boutons d’action */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.payButton, styles.badge]}
              onPress={handlePayByBadge}
            >
              <Text style={styles.payText}>Payer par badge</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payButton, styles.qr]}
              onPress={handlePayByQR}
            >
              <Text style={styles.payText}>Payer par QR code</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: '#777' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  name: { fontSize: 16, flex: 1 },
  qty: { width: 40, textAlign: 'center' },
  price: { width: 60, textAlign: 'right' },

  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#e63946',
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  clearText: { color: '#333', fontWeight: '600' },

  actions: {
    marginTop: 30,
    gap: 12,
  },
  payButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  badge: { backgroundColor: '#457b9d' },
  qr: { backgroundColor: '#1d3557' },
  payText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
