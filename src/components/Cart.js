import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { productService } from '../services/api/products';

export default function Cart({
  cart,
  removeFromCart,
  clearCart,
  addToCart,
  user,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();

      if (response.success) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Erreur chargement produits : ', err);
      Alert.alert('Erreur', 'Impossible de carger les produits');
    }
  };

  // Transforme l'objet `cart` {id: qty} → tableau de produits avec quantité
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find(p => p.id === parseInt(id));
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  // Calculer le total
  const total = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.qty;
  }, 0);

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
      'Êtes-vous sûr de vouloir vider le panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: clearCart },
      ],
    );
  };

  // Panier vide
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🍻</Text>
          <Text style={styles.emptyText}>Aucune commande en cours</Text>
          <Text style={styles.emptySubtext}>
            Ajoutez des produits depuis la carte
          </Text>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.itemInfo}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {item.category?.name || 'Autre'}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>x{item.qty}</Text>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => addToCart(item.id)}
        >
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.price}>
        {(parseFloat(item.price) * item.qty).toFixed(2)}€
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Liste des items */}
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Footer avec total et bouton vider */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>{total.toFixed(2)}€</Text>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Text style={styles.clearText}>🗑️ Vider le panier</Text>
        </TouchableOpacity>
      </View>

      {/* Boutons de paiement */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.payButton, styles.badgeButton]}
          onPress={handlePayByBadge}
        >
          <Text style={styles.payText}>Payer par badge</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payButton, styles.qrButton]}
          onPress={handlePayByQR}
        >
          <Text style={styles.payText}>Payer par QR code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
    marginBottom: 80,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  itemInfo: {
    width: 140,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1d3557',
    marginBottom: 3,
  },
  category: {
    fontSize: 12,
    color: '#6c757d',
  },
  qty: {
    width: 40,
    textAlign: 'center',
  },
  price: {
    width: 60,
    textAlign: 'right',
  },
  footer: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#F8F9FA',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e63946',
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  clearText: {
    color: '#333',
    fontWeight: '600',
  },
  actions: {
    marginTop: 30,
    gap: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    marginHorizontal: 12,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#457b9d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonIcon: {
    fontSize: 24,
  },
  badgeButton: {
    backgroundColor: '#457b9d',
  },
  qrButton: {
    backgroundColor: '#1d3557',
  },
  payText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
